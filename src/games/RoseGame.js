import {
  Phaser,
  Copyright,
  ActionFigure,
  PublicPath,
  randBetween,
  portalRequestGameData,
  portalReportHighscore,
  requestXHR,
} from '@commontown/arcade-library';
import { Egg } from './egg';
import GameEndBoard from './gameEndBoard';
import { GameJson, LoadGameJsonScene, LoadScene } from './LoadScene';
import MakeSureBoard from './makeSureBoard {';
import { Options } from './options';
import { PreloadScene } from './Preload';
import TimeOverBoard from './timeOverBoard';
// import dragonBones from "./dragonBone";

const appInfo = {
  publisher: 'CommonTown Pte Ltd',
  version: 'v1.0.0',
  releaseDate: ' 2021-08-11',
};
let questionData;


export default function RoseGame(elid) {
  const object = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    parent: elid,
    transparent: true,
    scene: [LoadGameJsonScene, LoadScene, PreloadScene, RoseGameScene],
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH,
      mode: Phaser.Scale.FIT,
      width: 1024,
      height: 768
    },
    audio: {
      disableWebAudio: true,
    },
    plugins: {
      scene: [
        { key: "DragonBones", plugin: window.dragonBones.phaser.plugin.DragonBonesScenePlugin, mapping: "dragonbone" }    // setup DB scene plugin
      ]
    }
  });
  const destroy = _ => {
    object.destroy(true);
  };
  const { version, releaseDate } = appInfo;
}

class RoseGameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'RoseGame'
  });
  }

  create() {
    questionData = JSON.parse(JSON.stringify(GameJson.questions)); // deep clone
    const startfn = (scene, gameData) => {
      const logic = new __logic(scene, gameData);
      scene.input.on('gameobjectdown', (pointer, obj) => logic.clickObject(pointer, obj),);
      scene.input.on('gameobjectup', () => { });
      logic.gameStartRound();
      // logic.gameStartRound();
    };
    // wait for portal to start, startfn will be called if there is no encapsulating portal
    portalRequestGameData(this, startfn);
  }
}

// private logic class
class __logic {
  // depth of objects
  depth = {
    interface: 200,
  };

  animations = {
    rule: [
      {
        sheet: 'rule',
        anims: [
          {
            _act: 'normal',
            frameRate: 5,
            repeat: -1,
            _frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        ],
        origin: [.5, .5],
      },
    ],
  }

  constructor(scene, gameData) {
    /** @type {Phaser.Scene} */
    this.scene = scene;
    this.gameData = gameData;
    this.standalone = !gameData; // running as standalone if no gameData
    this.copyright = new Copyright(scene, appInfo);
  }

  clickObject(pointer, btn) {
    // non-colored buttons
    const onclick = btn.getData('onclick');
    if (typeof onclick === 'function')
      return onclick(pointer.event);

    // colored buttons
    const btnColor = btn.getData('color');
    if (btnColor) {

    }
  }

  // main game screen
  gameStartRound() {
    const { width, height } = this.scene.scale;
    if (this.music) {
    } else {
      this.music = /** @type {Phaser.Sound.HTML5AudioSound} */(this.scene.sound.add('theme'));
      this.music.play({ loop: true });
      this.music.setVolume(0.8)
    }
    this.state = { 
      gameBigRoundIndex: 0,
      gameBigRoundSum: 1, // questionData.length,
      score: 0, sum_egg: questionData.length, broke_num: 0, remainTime: GameJson.timeEveryQuestion, sumTime: 0, gameIsPause: false };

    this.scene.add.image(0, 0, 'bg').setOrigin(0); // background image

    this.egg = new Egg(this.scene, width / 2, height / 2, this); // ['egg']);
    // this.hammer = this.scene.add.image(170 + width / 2, 20 + height / 2, 'hammer').setOrigin(1);
    
    this.pet = this.scene.add.image(width / 2, height / 2 - 20, 'end-pet').setOrigin(0.5).setScale(1.5).setVisible(false);
    const petNames = ["幽灵猫", "冒失猫", "走路菇", "海狸巨人", "树叶浣熊", "狸猫公主", "独角海豹", "人参村长", "恐龙战士", "火焰龙"];
    this.petName = this.scene.add.text(width * 0.5, 0.75 * height, petNames[GameJson.monster - 1], { fontFamily: 'yahei', fontSize: 40, align: 'center', color: '#000' }).setOrigin(0.5).setVisible(false);

    this.options = new Options(this.scene, this.depth.interface, questionData, this);
    this.scoreboard = this.makeScoreboard();
    this.progressBar = this.makeProgressBar();
    this.clockInterval = this.makeClock();

    this.copyright.render();
    this.makeRightTopButton(width);

    this.exitMakeSureBoard = new MakeSureBoard(this.scene, this);

    // new GameEndBoard(this.scene, this)
  }

  makeScoreboard() {
    // background image
    this.scene.add.image(0, 0, 'score-bg').setOrigin(0);

    // score label text
    const label = this.scene.add.text(
      90,
      40,
      (GameJson.language === 'zh' ? '积分' : 'score') + ':0', // not setting any text because font is not loaded yet
      {
        fontFamily: 'Buding Ti',
        fontSize: 30,
        align: 'center',
        color: '#ff8109',
      },
    ).setOrigin(0.5);
    // label.setStroke('#010101', 3);

    const update = (score) => {
      this.state.score = score;
      label.setText((GameJson.language === 'zh' ? '积分' : 'score') + ':' + this.state.score);
    };
    return { update };
  }

  makeProgressBar() {
    const { width: w } = this.scene.scale;
    if(!this.progressBarContainer) this.progressBarContainer = this.scene.add.container();
    const container = this.progressBarContainer;
    container.removeAll(true);
    // background image
    const sumW = this.state.sum_egg * 571 / 10;
    const leftX = w / 2 - sumW / 2

    // bg
    container.add(new Phaser.GameObjects.Image(this.scene, leftX, 0, 'top-bg', 0).setOrigin(0, 0));
    for (let i = 1; i < this.state.sum_egg - 1; i++) {
      container.add(new Phaser.GameObjects.Image(this.scene, leftX + i * 57.1, 0, 'top-bg', 1).setOrigin(0, 0));
    }
    container.add(new Phaser.GameObjects.Image(this.scene, leftX + (this.state.sum_egg - 1) * 57.1, 0, 'top-bg', 9).setOrigin(0, 0));

    for (let i = 0; i < this.state.sum_egg; i++) {
      const egg = new Phaser.GameObjects.Image(this.scene,28.5 + leftX + 57.1 * i, 52, 'top-egg').setOrigin(0.5, 1);
      container.add(egg) ;
    }

    const update = (broke_num) => {
      if(broke_num) this.state.broke_num = broke_num;
      for (let i = 0; i < this.state.sum_egg; i++) {
        if(i < this.state.broke_num) 
          /** @type {Phaser.GameObjects.Image} */ 
          (container.list[this.state.sum_egg + i]).setTexture('top-broke-egg');
        else 
          /** @type {Phaser.GameObjects.Image} */ 
          (container.list[this.state.sum_egg + i]).setTexture('top-egg');
      }
    };
    return { update };
  }

  makeClock() {
    const { width: w } = this.scene.scale;
    this.clock = this.scene.add.image(w / 4, 480, 'clock').setOrigin(0.5).setVisible(GameJson.needClock);
    const number = this.scene.add.text(w / 4, 480,
      this.state.remainTime.toString(),
      {
        fontFamily: 'yahei',
        fontSize: 35,
        align: 'center',
        color: '#fffe77',
      },
    ).setOrigin(0.5).setVisible(GameJson.needClock);
    number.setStroke('#d45a1d', 3);
    this.clockNumber = number;

    const interval = setInterval(
      () => {
        if(this.state.gameIsPause ) { return }
        this.state.remainTime--;
        number.setText(this.state.remainTime.toString());
        this.state.sumTime ++;
        if(!this.clock.visible) return;
        if (this.state.remainTime === 5) {
          this.scene.sound.add('last5s').play();
        } else if (this.state.remainTime === 0) {
          clearInterval(interval);
          console.log('time over!!')
          // new TimeOverBoard(this.scene, this);
        }
      }, 1000
    )
    return interval;
  }

  makeRightTopButton(width) {
    // music
    const btn = this.scene.add.image(width - 90, 10, 'volume-button').setOrigin(0);
    btn.setInteractive({ useHandCursor: true });
    btn.setData('onclick', () => { 
      if(this.music.volume===0){
        this.music.setVolume(0.8)
        btn.setTexture('volume-button')
      }else {
        this.music.setVolume(0)
        btn.setTexture('volume-button-gray')
      };
      console.log(this.music)
    });
    btn.setDepth(this.depth.interface);

    // restart
    const btn2 = this.scene.add.image(width - 90, 10 + 1 * 80, 'back-button').setOrigin(0);
    btn2.setInteractive({ useHandCursor: true });
    btn2.setData('onclick', () => { 
      this.state.gameIsPause = true;
      this.exitMakeSureBoard.container.visible = true;
      this.options.optionContainer.setVisible(false);
      this.options.questionContainer.setVisible(false);
      this.pauseButton.setVisible(false);
    });
    btn2.setDepth(this.depth.interface);

    // show or hide should controlled by game json
    if(GameJson.pause){
      const btn3 = this.scene.add.image(width - 90, 10 + 2 * 80, 'pause-button').setOrigin(0);
      this.pauseButton = btn3;
      btn3.setInteractive({ useHandCursor: true });
      btn3.setData('onclick', () => { 
        if(!this.state.gameIsPause){ // 没有暂停
          this.state.gameIsPause = true;
          btn3.setTexture('pause-button-gray')
          btn3.setPosition( width / 2 - 100, 260)
          btn3.setScale(2.6);
          this.options.optionContainer.setVisible(false);
          this.options.questionContainer.setVisible(false);
          btn2.setVisible(false);
        } else {
          this.state.gameIsPause = false;
          btn3.setTexture('pause-button')
          btn3.setPosition( width - 90, 10 + 2 * 80)
          btn3.setScale(1);
          this.options.optionContainer.setVisible(true);
          this.options.questionContainer.setVisible(true);
          btn2.setVisible(true);
        };
        console.log(this.music) });
      btn3.setDepth(this.depth.interface);
    }
  }

  // one round success
  roundSuccess(){
    this.state.gameBigRoundIndex ++;
    if( this.state.gameBigRoundIndex === this.state.gameBigRoundSum) {
      console.log('游戏通关');
      this.egg.setVisible(false);
      this.options.questionContainer.destroy()
      this.egg.boom();
      this.options.optionContainer.destroy();
      this.options.nestContainer.destroy();
      this.options.alphabetContainer.destroy();
      this.clock.visible = false;
      this.clockNumber.visible = false;
      // setTimeout( () => {
      //   new GameEndBoard(this.scene, this)
      // }, 4000)
      this.scene.sound.add('success').play()
      this.pet.setVisible(true);
      this.petName.setVisible(true);
      this.pet.setInteractive();
      this.pet.setData('onclick', () => { new GameEndBoard(this.scene, this) })
    }else{
      this.options.update(questionData);
      this.state.sum_egg = questionData.length
      this.state.broke_num = 0;
      this.makeProgressBar();
    }
  }
}

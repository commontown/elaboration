import {
  Phaser,
  PublicPath,
  portalRequestGameData,
} from '@commontown/arcade-library';
import { GameJson } from './LoadScene';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  init() {
    const { width, height } = this.game.scale;
    this.add.image(0, 0, 'loading').setOrigin(0);
    this.add.image(width / 2, 0.22 * height, 'logo').setOrigin(0.5).setScale(1.1);

    this.add.image(width - 10, 10, 'load_page_hint').setOrigin(1, 0).setInteractive({ useHandCursor: true }).on(
      'pointerdown', ()=> {
      //   this.text1.setText(GameJson.language === 'en' ? 'Answer questions to hatch your monster.':'答对问题，孵化萌宠');
      //   GameJson.language = GameJson.language === 'en' ? 'zh':'en';
        this.add.rectangle( width - 110, 30, 200, 40, 0xffffaa).setOrigin(1, 0);
        this.text1 = this.add.text(width - 210, 50, GameJson.language === 'en' ? 'Answer questions to hatch your monster.':'答对问题，孵化萌宠', { font: "18px Buding Ti", fill: "#000",wordWrap: { width: 200, useAdvancedWrap: true } }).setOrigin(0.5);
      });
    // this.text1.setStroke('#f0f', 2);
    // this.text1.setTintFill(0x0000ff, 0x00ff00, 0x00ffff)
  }

  preload() {
    const modpath = `${PublicPath}/assets/games`;
    this.load.image('start', `${modpath}/load/start.png`);

    const audiopath = `${PublicPath}/assets/audio`;

    this.load.image('bg', `${modpath}/bg.jpg`);

    this.load.image('volume-button', `${modpath}/volume_button.png`);
    this.load.image('volume-button-gray', `${modpath}/volume_button_gray.png`);
    // this.load.image('config-button', `${modpath}/config_button.png`);
    this.load.image('back-button', `${modpath}/back_button.png`);
    this.load.image('pause-button', `${modpath}/pause_button.png`);
    this.load.image('pause-button-gray', `${modpath}/pause_button_gray.png`);
    // this.load.image('music-button', `${modpath}/music_button.png`);

    this.load.image('option-nest', `${modpath}/option-nest.png`);

    // this.load.image('egg', `${modpath}/egg.png`);
    // for (let i = 0; i < 10; i++) { this.load.image('egg-crack' + i, `${modpath}/egg-crack/${i + 1}.png`); }
    // for (let i = 1; i < 10; i++) { this.load.image('egg' + i, `${modpath}/eggs/蛋${i}.png`); }
    // this.load.spine('egg', `${modpath}/egg-spine/NewProject.json`, `${modpath}/egg-spine/NewProject.atlas`, true);
    for (let i = 10; i < 19; i++) { 
      this.load.dragonbone(
        `egg${(18 - i)}`  ,
        `${modpath}/egg-spine/图层 25 拷贝 ${i}.png`,
        `${modpath}/egg-spine/NewProject_tex.json`,
        `${modpath}/egg-spine/NewProject_ske.json`,
      );
    }
    // this.load.spine('boy', `${modpath}/egg-spine/spineboy-pro.json`, `${modpath}/egg-spine/spineboy-pro.atlas`, true);
    for (let i = 0; i <= 12; i++) { this.load.image('hammer' + i, `${modpath}/hammers/Armature_newAnimation_${i < 10 ? '0' + i : i}.png`); }
    for (let i = 0; i <= 19; i++) { this.load.image('main-egg-boom' + i, `${modpath}/effect/main-egg-boom/备用全屏特效4输出03_000${i < 10 ? '0' + i : i}.png`); }
    for (let i = 0; i <= 25; i++) { this.load.image('effect-under-egg' + i, `${modpath}/effect/effect-under-egg/备用全屏特效1输出01_000${i < 10 ? '0' + i : i}.png`); }
    // this.load.image('hammer', `${modpath}/hammer.png`);

    this.load.image('score-bg', `${modpath}/score-bg.png`);

    this.load.image('clock', `${modpath}/clock.png`);

    this.load.image('top-egg', `${modpath}/top-egg.png`);
    this.load.image('top-broke-egg', `${modpath}/top-broke-egg.png`);
    this.load.spritesheet('top-bg', `${modpath}/top-bg.png`, { frameWidth: 57, frameHeight: 60 });

    // random pet at game end 后面要json data可控制
    // const random = Math.ceil(10 * Math.random());
    const random = GameJson.monster;
    this.load.image('end-pet', `${modpath}/pet/${random}.png`);
    // window.petInfo = { name: petNames[random - 1], key: 'end-pet' + random}
    this.load.image('end-bg', `${modpath}/new-end-bg.png`);

    this.load.image('alphabet-bg', `${modpath}/alphabet-bg.png`);
    this.load.spritesheet('question-bg', `${modpath}/question-bg.png`, { frameWidth: 39, frameHeight: 138 });
    this.load.spritesheet('option-bg', `${modpath}/option-bg.png`, { frameWidth: 74 / 3, frameHeight: 74 }); // 74 x 74

    this.load.spritesheet('old-end-bg', `${modpath}/end_bg.png`, { frameWidth: 104/3, frameHeight: 106/3 });
    this.load.image('good-zh', `${modpath}/good-zh.png`);
    this.load.image('good-en', `${modpath}/good-en.png`);
    this.load.image('button', `${modpath}/button.png`);
    this.load.image('play-again', `${modpath}/play_again.png`);

    this.load.image('egg-audio', `${modpath}/egg-audio.png`);
    // music
    this.load.audio('theme', `${audiopath}/bg.mp3`);
    this.load.audio('btn-press', `${audiopath}/button.mp3`);
    this.load.audio('last5s', `${audiopath}/last5s.mp3`);
    this.load.audio('right', `${audiopath}/smash-egg.mp3`);
    this.load.audio('wrong', `${audiopath}/wrong.mp3`);
    this.load.audio('success', `${audiopath}/success.mp3`);

    // load resources question by url in json
    GameJson.questionData.forEach( round => {
      round.forEach( question => {
        if(question.type === "image"){
          this.load.image(question.question, `${modpath}/question/${question.question}`);
        }else if(question.type === "audio"){
          this.load.audio(question.question, `${audiopath}/question/${question.question}`);
        }

        question.answers.forEach( q => {
          if(q.type === 'image'){
            this.load.image(q.content, `${modpath}/question/${q.content}`);
          }else if(q.type === "audio"){
            this.load.audio(q.content, `${audiopath}/question/${q.content}`);
          }
        })
      })
    })
  }

  create() {
    const { width, height } = this.game.scale;
    const startButton = this.add.image(0.5 * width, 0.75 * height, 'start').setOrigin(0.5).setInteractive({ useHandCursor: true });
    startButton.on('pointerdown', ()=> { this.scene.start('RoseGame')})
  }
}
import { GameJson } from './LoadScene';

const petNames = ["幽灵猫", "冒失猫", "走路菇", "海狸巨人", "树叶浣熊", "狸猫公主", "独角海豹", "人参村长", "恐龙战士", "火焰龙"];
export default class GameEndBoard {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, logic) {
        this.scene = scene;
        this.logic = logic;
        const { width: w, height: h } = this.scene.scale;

        this.bg = scene.add.image(w / 2, h / 2 - 20, 'end-bg').setOrigin(0.5).setScale(0.9);
        this.pet = scene.add.image(w / 3, h / 2 - 20, 'end-pet').setOrigin(0.5).setScale(1.3);

        scene.add.image(w / 2, 120, GameJson.language === 'zh' ? 'good-zh' : 'good-en').setOrigin(0.5).setScale(1);

        this.scene.add.text(w * 0.3, 0.75 * h, petNames[GameJson.monster - 1], { fontFamily: 'yahei', fontSize: 40, align: 'center', color: '#000' }).setOrigin(0.5).setDepth(logic.depth.interface + 3);
        this.scene.add.text(w * 0.63, 0.23 * h, (GameJson.language === 'zh' ? '用 时' : 'Time') + ':    ' + this.logic.state.sumTime, { fontFamily: 'Buding Ti', fontSize: 25, align: 'center', color: '#fa0' }).setDepth(logic.depth.interface + 3);
        this.scene.add.text(w * 0.63, 0.33 * h, (GameJson.language === 'zh' ? '得 分' : 'Score') + ':    ' + this.logic.state.score, { fontFamily: 'Buding Ti', fontSize: 25, align: 'center', color: '#fa0' }).setDepth(logic.depth.interface + 3);

        // again
        const button = this.scene.add.image(w * 0.71, 0.51 * h, 'button').setDisplaySize(180, 80).setInteractive({ useHandCursor: true }).setDepth(logic.depth.interface + 3);
        button.on('pointerdown', () => { clearInterval(this.logic.clockInterval); this.scene.scene.start('RoseGame') });
        this.scene.add.text(w * 0.71, 0.51 * h, GameJson.language === 'zh' ? '再玩一次' : 'Play again', { fontFamily: 'Buding Ti', fontSize: 20, align: 'center', color: '#fe0' }).setOrigin(0.5).setDepth(logic.depth.interface + 3);

        // exit
        const button2 = this.scene.add.image(w * 0.71, 0.65 * h, 'button').setDisplaySize(180, 80).setInteractive({ useHandCursor: true }).setDepth(logic.depth.interface + 3);
        button2.on('pointerdown', () => { clearInterval(this.logic.clockInterval); this.scene.scene.start('Preload') });
        this.scene.add.text(w * 0.71, 0.65 * h, GameJson.language === 'zh' ? '返 回' : 'Exit', { fontFamily: 'Buding Ti', fontSize: 20, align: 'center', color: '#fe0' }).setOrigin(0.5).setDepth(logic.depth.interface + 3);

        // // text
        // this.scene.add.text( w / 2, 0.3 * h, '游戏结束', { fontFamily: 'yahei', fontSize: 30, align: 'center', color: '#000'}).setOrigin(0.5).setDepth( logic.depth.interface +3);
        // this.scene.add.text( w * 0.35, 0.3 * h + 50 * 1, '你这次成功孵化出了: ' + window.petInfo.name, { fontFamily: 'yahei', fontSize: 25, align: 'center', color: '#000'}).setDepth( logic.depth.interface +3);
        // this.scene.add.text( w * 0.35, 0.3 * h + 50 * 2, '总共用时: ' + this.logic.state.sumTime + '秒', { fontFamily: 'yahei', fontSize: 25, align: 'center', color: '#000'}).setDepth( logic.depth.interface +3);
        // this.scene.add.text( w * 0.35, 0.3 * h + 50 * 3, '分数: ' + this.logic.state.score + '分', { fontFamily: 'yahei', fontSize: 25, align: 'center', color: '#000'}).setDepth( logic.depth.interface +3);
        // this.scene.add.text( w / 2, 0.65 * h, '每次孵化出来的动物都不一样哦，请多尝试几次吧 ', { fontFamily: 'yahei', fontSize: 20, align: 'center', color: '#f00'}).setOrigin(0.5).setDepth( logic.depth.interface +3);

        // button
        // const button = this.scene.add.image(w / 2, 0.73 * h, 'play-again').setInteractive({ useHandCursor: true }).setDepth( logic.depth.interface +3);

        // button.on('pointerdown', ()=> { clearInterval(this.logic.clockInterval); this.scene.scene.start('Preload')});

        // const widthSegment = 15;
        // const heightSegment = 13;
        // const oneSegmentW = 104 / 3;
        // const oneSegmentH = 106 / 3;
        // const leftX = w / 2 - widthSegment * oneSegmentW / 2;
        // const topY = h / 2 - heightSegment * oneSegmentH / 2;
        // for (let i = 0; i < widthSegment; i++) {
        //     for (let j = 0; j < heightSegment; j++) {
        //         let index = 4;
        //         if (i == 0) {
        //             index = 3;
        //             if (j == 0) {
        //                 index = 0;
        //             } else if (j == heightSegment - 1) {
        //                 index = 6;
        //             }
        //         } else if (i === widthSegment - 1) {
        //             index = 5;
        //             if (j === 0) {
        //                 index = 2;
        //             } else if (j == heightSegment - 1) {
        //                 index = 8;
        //             }
        //         } else if (j === 0) {
        //             index = 1;
        //         } else if (j == heightSegment - 1) {
        //             index = 7;
        //         }
        //         this.scene.add.image(leftX + i * oneSegmentW, topY + j * oneSegmentH, 'end-bg', index).setOrigin(0).setDepth( logic.depth.interface +3);
        //     }
        // }
    }
}
import { GameJson } from './LoadScene';

export default class TimeOverBoard {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, logic) {
        this.scene = scene;
        this.logic = logic;
        const { width: w, height: h } = this.scene.scale;
          
        this.container = this.scene.add.container().setDepth( 99999).setPosition(-250, -120).setVisible(true);

        const widthSegment = 8;
        const heightSegment = 6;
        const oneSegmentW = 104 / 3;
        const oneSegmentH = 106 / 3;
        const leftX = w / 2 - widthSegment * oneSegmentW / 2;
        const topY = h / 2 - heightSegment * oneSegmentH / 2;
        for (let i = 0; i < widthSegment; i++) {
            for (let j = 0; j < heightSegment; j++) {
                let index = 4;
                if (i == 0) {
                    index = 3;
                    if (j == 0) {
                        index = 0;
                    } else if (j == heightSegment - 1) {
                        index = 6;
                    }
                } else if (i === widthSegment - 1) {
                    index = 5;
                    if (j === 0) {
                        index = 2;
                    } else if (j == heightSegment - 1) {
                        index = 8;
                    }
                } else if (j === 0) {
                    index = 1;
                } else if (j == heightSegment - 1) {
                    index = 7;
                }
                const img = this.scene.add.image(leftX + i * oneSegmentW, topY + j * oneSegmentH, 'old-end-bg', index).setOrigin(0).setDepth( logic.depth.interface +3);
                this.container.add(img);
            }
        }
        this.container.add( this.scene.add.text(420, 320, GameJson.language === 'zh' ? '时间结束了！你失去了计时分数！':"Time is over! You lost your timing score!", { fontFamily: 'yahei', fontSize: 30, color: '#000', wordWrap: { width: 200, useAdvancedWrap: true } }).setDepth( logic.depth.interface + 6) );
    }
}
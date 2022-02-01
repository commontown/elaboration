import { GameJson } from "./LoadScene";

/** click back button board */
export default class MakeSureBoard {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, logic) {
        this.scene = scene;
        this.logic = logic;
        const { width: w, height: h } = this.scene.scale;

        this.container = this.scene.add.container().setDepth( 100000).setVisible(false);

        const widthSegment = 15;
        const heightSegment = 13;
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

        const bg1 = this.scene.add.image(0.4 * w - 15, 0.35 *h - 20, 'button').setOrigin(0);
        this.container.add(bg1);
        const option = this.scene.add.text(0.4 * w + 110, 0.35 *h, GameJson.language ==='zh' ? '确认退出':'Exit', { fontFamily: 'Buding Ti', fontSize: 43, align: 'center', color: '#000' }).setOrigin( 0.5, 0);
        this.container.add(option);
        bg1.setInteractive({ useHandCursor: true });
        bg1.setData('onclick', () => {  scene.scene.start('Preload');      })

        // back game
        const bg2 = this.scene.add.image(0.4 * w - 15, 0.55 *h - 20, 'button').setOrigin(0)
        this.container.add(bg2);
        const option1 = this.scene.add.text(0.4 * w + 110, 0.55 *h, GameJson.language ==='zh' ? '回到游戏':'back game', { fontFamily: 'Buding Ti', fontSize: 43, align: 'center', color: '#000' }).setOrigin( 0.5, 0);
        this.container.add(option1);
        bg2.setInteractive({ useHandCursor: true });
        bg2.setData('onclick', () => {
            this.container.visible = false;
            this.logic.options.optionContainer.setVisible(true);
            this.logic.pauseButton.setVisible(true);
            this.logic.state.gameIsPause = false;
            this.logic.options.questionContainer.setVisible(false);
        })
    }
}
/** egg and hammer*/
export class Egg {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, x, y, logic) {
        // super(scene, x, y, brokenImages[0]);
        // scene.add.existing(this);

        // const framesInfo = [];
        // for (let i = 0; i < 10; i++) { framesInfo.push({ key: 'egg' + i }); } // { key: 'cat4', duration: 50 }
        // scene.anims.create({
        //     key: 'shake',
        //     frames: framesInfo,
        //     frameRate: 60,
        //     repeat: 1
        // });
        const framesInfo2 = [];
        for (let i = 0; i <= 12; i++) { framesInfo2.push({ key: 'hammer' + i }); } // { key: 'cat4', duration: 50 }
        scene.anims.create({
            key: 'down',
            frames: framesInfo2,
            frameRate: 60,
            repeat: 1
        });
        const framesInfo3 = [];
        for (let i = 0; i <= 19; i++) { framesInfo3.push({ key: 'main-egg-boom' + i }); } // { key: 'cat4', duration: 50 }
        scene.anims.create({
            key: 'boom',
            frames: framesInfo3,
            frameRate: 15,
            repeat: 1
        });
        const framesInfo4 = [];
        for (let i = 0; i <= 25; i++) { framesInfo4.push({ key: 'effect-under-egg' + i }); } // { key: 'cat4', duration: 50 }
        scene.anims.create({
            key: 'zhen',
            frames: framesInfo4,
            frameRate: 6,
            repeat: -1
        });
        const { width: w, height: h } = scene.scale;
        this.zhen = scene.add.sprite(x  + 30, y + 15, 'zhen0').play('zhen');
        // this.object = scene.add.image(x, y, 'egg');
        // this.egg_crack = scene.add.image(x + 1, y - 11, 'egg-crack1').setVisible(false);
        // dragon bone
        this.object = scene.add.armature("Armature", "egg8");
        this.object.x = x; this.object.y = y + 100;

        this.hammer = scene.add.sprite(150 + w / 2, -100 + h / 2, 'hammer0').setDepth(logic.depth.interface + 3);;
        this.boomEffect = scene.add.sprite(w / 2, h / 2, 'main-egg-boom0').setOrigin(0.5).setDisplaySize(w, h).setVisible(false).setDepth(logic.depth.interface + 3);
        this.brokenProgress = 0;

        this.scene = scene;
        this.initY = this.object.y;
    }

    shake(percent, needShake = true) {
        this.hammer.play('down')
        if(needShake){
            this.object.animation.play("newAnimation", 1);
        }
        setTimeout( () => {
            if(percent){
                // this.egg_crack.setVisible(true).setTexture('egg-crack'+Math.floor(10*( 1 - percent)))
                this.object.setVisible(false);
                const x = this.object.x;
                this.object = this.scene.add.armature("Armature", "egg"+Math.floor(9*percent));
                this.object.x = x; this.object.y = this.initY;
            }
        }, 500)
    }

    boom() {
        this.boomEffect.visible = true;
        this.boomEffect.play('boom');
    }

    broke() {
        // birth logic
        // if(this.brokenProgress === this.brokenImages.length - 1) return;
        // this.setTexture(this.brokenImages[++this.brokenProgress]);
    }

    setVisible(visible) {
        this.hammer.visible = visible;
        this.object.visible = visible;
        this.zhen.visible = visible;
    }
}
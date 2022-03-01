import {
    Phaser,
    PublicPath,
    portalRequestGameData,
} from '@commontown/arcade-library';
// import { GameJson } from './mockGameJson';

export let GameJson = null;

// load JsonData Before All Scenes
export class LoadGameJsonScene extends Phaser.Scene {
    constructor() {
        super('LoadJson')
    }
    preload() {
        const jsonPath = `${PublicPath}/assets/games/`;
        this.load.json('gameData', jsonPath + "GameData.json");
    }
    create() {
        GameJson = this.cache.json.get('gameData');
        portalRequestGameData(this, (scene, gameData)=>{
            if (gameData) GameJson = gameData;
            this.scene.start('Load');
        })
    }
}

export class LoadScene extends Phaser.Scene {
    constructor() {
        super('Load')
    }

    preload() {
        const modpath = `${PublicPath}/assets/games`;
        this.load.image('loading', `${modpath}/load/LOADING.jpg`);
        this.load.image('logo', `${modpath}/load/LOGO_${GameJson.language === 'en'? 'EN':'ZH'}.png`);
        this.preloadFonts();
        this.load.image('load_page_hint', `${modpath}/load/load_page_hint.png`); // hint button
    }

    preloadFonts() {
        this.add.text(
            0,
            0,
            '1',
            {
                fontFamily: 'Buding Ti',
                fontSize: 1,
                align: 'left',
                color: '#000000',
            },
        ).setOrigin(0);
    }

    create() {
        this.scene.start('Preload');
    }
}
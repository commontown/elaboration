import { GameJson } from "./LoadScene";

/** question and options */
export class Options {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} depth
     * @param { { question: string, type: string, answers: {content: any, isTrue: boolean}[] }[] } questionData
     */
    constructor(scene, depth, questionData, logic) {
        /** @property {Phaser.Scene} */
        this.scene = scene;
        this.depth = depth;
        this.questionData = questionData;
        this.currentQuestionIndex = 0;
        this._makeFourNest();
        this._makeFourAlphabet();
        this._makeOption();
        this._makeQuestion();
        this._logic = logic;
    }

    // every round
    update( questionData){
        this.questionData = questionData;
        this.currentQuestionIndex = 0;
        this._makeQuestion();
    }

    _makeQuestion() {
        if(this.questionContainer){
            this.questionContainer.destroy();
        }
        const { width: w, height: h } = this.scene.scale;
        
        if(this.questionData[this.currentQuestionIndex].type==="text"){
            const sumW = 290; // max 290
            const bg0 = this.scene.add.image(0, 0, 'question-bg', 0).setOrigin(0, 0.5);
            const frameW = bg0.width;
            const bg1 = this.scene.add.image(bg0.width, 0, 'question-bg', 1).setOrigin(0, 0.5).setScale( (sumW - 2 * frameW)/frameW, 1);
            const bg2 = this.scene.add.image(sumW, 0, 'question-bg', 2).setOrigin(1, 0.5);
            this.questionContainer = this.scene.add.container(w * 0.63, h * 0.35, [bg0, bg1, bg2]).setDepth(this.depth + 999);
            
            const text = this.scene.add.text( 35, -50,
                this.questionData[this.currentQuestionIndex].question.substr(0, 30),
                // 'dsafsdfsfsdafdsfsdaf',
                {
                    fontFamily: 'yahei',
                    fontSize: 25,
                    align: 'center',
                    color: '#ffffff',
                    wordWrap: { width: sumW - 50, useAdvancedWrap: true }
                },
            )
            this.questionContainer.add(text)
        } if (this.questionData[this.currentQuestionIndex].type==="image"){
            const sumW = 180; // max 290
            const bg0 = this.scene.add.image(0, 0, 'question-bg', 0).setOrigin(0, 0.5);
            const frameW = bg0.width;
            const bg1 = this.scene.add.image(bg0.width, 0, 'question-bg', 1).setOrigin(0, 0.5).setScale( (sumW - 2 * frameW)/frameW, 1);
            const bg2 = this.scene.add.image(sumW, 0, 'question-bg', 2).setOrigin(1, 0.5);
            this.questionContainer = this.scene.add.container(w * 0.63, h * 0.35, [bg0, bg1, bg2]);
            
            const image = this.scene.add.image( 35, -50,  this.questionData[this.currentQuestionIndex].question ).setOrigin(0)
            image.setDisplaySize(132, 99);
            this.questionContainer.add(image)
        } if (this.questionData[this.currentQuestionIndex].type==="audio"){
            const sumW = 180; // max 290
            const bg0 = this.scene.add.image(0, 0, 'question-bg', 0).setOrigin(0, 0.5);
            const frameW = bg0.width;
            const bg1 = this.scene.add.image(bg0.width, 0, 'question-bg', 1).setOrigin(0, 0.5).setScale( (sumW - 2 * frameW)/frameW, 1);
            const bg2 = this.scene.add.image(sumW, 0, 'question-bg', 2).setOrigin(1, 0.5);
            this.questionContainer = this.scene.add.container(w * 0.63, h * 0.35, [bg0, bg1, bg2]);
            
            const image = this.scene.add.image( 50, -50,  'egg-audio' ).setOrigin(0).setScale(0.8);
            image.setInteractive({ useHandCursor: true });
            image.setData('onclick', () => { this.scene.sound.add(this.questionData[this.currentQuestionIndex].question).play()} );

            // image.setDisplaySize(132, 99);
            this.questionContainer.add(image)
        }

        this._makeOption();
    }

    _makeFourNest() {
        this.nestContainer = this.scene.add.container();
        const { width: w, height } = this.scene.scale;
        for (let i = 0; i < 4; i++) {
            const nest = this.scene.add.image((0.15 + (i * (0.7 / 3))) * w, height - 50, 'option-nest');
            nest.setDepth(this.depth);
            this.nestContainer.add(nest);
            const answer = this.questionData[this.currentQuestionIndex].answers[i];

            let img;
            if(answer.type === 'image') {
                img = this.scene.add.image((0.15 + (i * (0.7 / 3))) * w, height - 50, answer.content).setOrigin( 0, 1);
                this.nestContainer.add(img);
            } else if (answer.type === 'audio'){
                img = this.scene.add.image((0.15 + (i * (0.7 / 3))) * w, height - 50, 'egg-audio').setOrigin( 0, 1);
                this.nestContainer.add(img);
            }
        }
    }

    _makeOption() {
        if(this.optionContainer){
            this.optionContainer.destroy();
        }
        this.optionContainer = this.scene.add.container(0, 0).setDepth(this.depth + 1);
        const { width: w, height } = this.scene.scale;

        /** change order and will change origin array */
        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
        const shuffledArray = shuffleArray(this.questionData[this.currentQuestionIndex].answers)
        for (let i = 0; i < 4; i++) {
            const answer = shuffledArray[i];
            if(answer.type === 'image') {
                const option = this.scene.add.image((0.15 + (i * (0.7 / 3))) * w, height - 70, answer.content).setOrigin( 0.5, 1).setDisplaySize(160, 120);
                this.optionContainer.add(option);
            } else if (answer.type === 'audio'){
                const option = this.scene.add.image((0.15 + (i * (0.7 / 3))) * w, height - 50, 'egg-audio').setOrigin( 0.5, 1);
                option.setInteractive({ useHandCursor: true });
                this.optionContainer.add(option);
                option.setData('onclick', () => { this.scene.sound.add(answer.content).play()} );
            } else { // text
                const bgW = 210;
                const bgCenterW = bgW - 2 * (74 / 3);
                const optionBg = this.scene.add.image((0.15 + i * 0.7 / 3) * w - bgCenterW / 2, height - 60, 'option-bg', 0).setOrigin( 1, 1).setDisplaySize(74/3, 110);
                const optionBg1 = this.scene.add.image((0.15 + i * 0.7 / 3) * w, height - 60, 'option-bg', 1).setOrigin( 0.5, 1).setDisplaySize(bgCenterW, 110);
                const optionBg2 = this.scene.add.image((0.15 + i * 0.7 / 3) * w + bgCenterW / 2, height - 60, 'option-bg', 2).setOrigin( 0, 1).setDisplaySize(74/ 3, 110);

                const option = this.scene.add.text((0.15 + i * 0.7 / 3) * w, height - 120, answer.content.substr(0, 5),
                    { fontFamily: 'yahei', fontSize: 22, align: 'center', color: '#ffffff', wordWrap: { width: 170, useAdvancedWrap: true } }
                ).setOrigin(0.5, 0.5)
                this.optionContainer.add([optionBg,optionBg1, optionBg2, option]);
            }
        }

    }

    _makeFourAlphabet() {
        const { width: w, height } = this.scene.scale;
        this.alphabetContainer = this.scene.add.container().setDepth(this.depth + 2)
        for (let i = 0; i < 4; i++) {
            const nest = this.scene.add.image((0.15 + (i * (0.7 / 3))) * w, height - 40, 'alphabet-bg').setOrigin(0.5);
            nest.scale = 1.2;
            nest.setInteractive({ useHandCursor: true });
            this.alphabetContainer.add(nest);

            // select one option EVENT
            nest.setData('onclick', () => {
                if( this._logic.state.gameIsPause || !this.questionData[this.currentQuestionIndex]) return; // cannot interactive when pause or end
                this.scene.sound.add('btn-press').play();
                // right answer
                if(this.questionData[this.currentQuestionIndex].answers[i].isTrue){
                    this.scene.sound.add('right').play({delay: 0.5});
                    this._logic.state.score += this._logic.state.remainTime + 10;
                    setTimeout( ()=> {
                        this._logic.scoreboard.update(this._logic.state.score);
                        this._logic.progressBar.update( ++this._logic.state.broke_num);
                        this._logic.state.remainTime = GameJson.timeEveryQuestion;
                        this.currentQuestionIndex ++;
                        this._logic.egg.shake( 1 - this.currentQuestionIndex / this.questionData.length );
                        if( this.currentQuestionIndex === this.questionData.length) {
                            // one round game success
                            setTimeout( () => {
                                this._logic.roundSuccess();
                            }, 1000) // wait egg shake
                        } else{
                            this._makeQuestion();
                        }
                    })
                    
                }else{
                    this.scene.sound.add('wrong').play({delay: 0.5});
                    this.questionData.push( this.questionData[this.currentQuestionIndex] );
                    this._logic.egg.shake(null, false);
                    this._logic.state.remainTime = GameJson.timeEveryQuestion;
                    this.currentQuestionIndex ++;
                    if( this.currentQuestionIndex === this.questionData.length) {
                        // one round game success
                        this._logic.roundSuccess();
                    } else{
                        this._makeQuestion();
                    }
                }
            });
            nest.setDepth(this.depth + 2);

            const label = this.scene.add.text(
                nest.x,
                nest.y,
                ["A", "B", "C", "D"][i],
                {
                    fontFamily: 'yahei',
                    fontSize: 25,
                    align: 'center',
                    color: '#ffffff',
                },
            ).setOrigin(0.5);
            this.alphabetContainer.add(label);
        }
    }
}
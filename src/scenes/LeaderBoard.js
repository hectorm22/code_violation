import { Scene } from 'phaser';

export class LeaderBoard extends Scene
{
    constructor ()
    {
        super('LeaderBoard');
    }

    preload (){
        this.load.text('highScores', 'http://localhost:3000/leaderboard');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor("#000000");

        this.add.image(512, 384, 'background').setAlpha(0.3);

        this.add.text(512, 150, 'Leaderboard!\n', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const highScores = this.cache.text.get('highScores'); // Get the loaded text content
        if (highScores !== undefined && highScores.trim() !== '') {
            try {
                const scoresVar = JSON.parse(highScores);

                // Display high scores in the game

                let fontSize = 24;
                let headerHeight = 200;
                let userColumnPosX = 50;
                let bestScoreColumnPosX = 400;
                let bestTimeColumnPosX = 600;

                // display header
                this.add.text(userColumnPosX, headerHeight, `Rank & User`, { 
                    fontSize: fontSize, color: '#e3bc59',
                    backgroundColor: "#000000",
                });

                this.add.text(bestScoreColumnPosX, headerHeight, `Best Score`, { 
                    fontSize: fontSize, color: '#e3bc59',
                    backgroundColor: "#000000",
                });

                this.add.text(bestTimeColumnPosX, headerHeight, `Best Time`, { 
                    fontSize: fontSize, color: '#e3bc59',
                    backgroundColor: "#000000",
                });

                // display records
                scoresVar.forEach((score, index) => {
                    // rank and name
                    this.add.text(userColumnPosX, 230 + index * 40, `${index+1}\t${score.username}:`, { 
                        fontSize: fontSize, color: '#e3bc59',
                        backgroundColor: "#000000",
                    });

                    // best score column
                    this.add.text(bestScoreColumnPosX, 230 + index * 40, `${score.bestScore}`, { 
                        fontSize: fontSize, color: '#e3bc59',
                        backgroundColor: "#000000",
                    });

                    // best time column
                    let [whole, fractional] = [Math.floor(score.bestTime), Math.floor((score.bestTime % 1) * 100)]; 
                    let formattedBestTime = `${whole}:${fractional.toString().padEnd(2, "0")}`;

                    this.add.text(bestTimeColumnPosX, 230 + index * 40, formattedBestTime, { 
                        fontSize: fontSize, color: '#e3bc59',
                        backgroundColor: "#000000",
                    });
                });
            } catch (error) {
                console.error('Error parsing high scores JSON:', error);
            }
        } else {
            console.error('High scores data is empty or undefined.');
        }

        // this.add.text(512, 600, 'click, return to main menu!\n', {
        //     fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);
        
        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}

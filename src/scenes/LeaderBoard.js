import { Scene } from 'phaser';

export class LeaderBoard extends Scene
{
    constructor ()
    {
        super('LeaderBoard');
    }

    preload (){
        this.load.text('highScores', 'http://localhost:3000/highscores');
        
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

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
                scoresVar.forEach((score, index) => {
                    this.add.text(450, 180 + index * 30, `${index+1} ${score.username}: ${score.bestScore}`, { fontSize: '24px', color: '#ff0000' });
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

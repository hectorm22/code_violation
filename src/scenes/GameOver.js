import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create() {
        this.add.image(512, 384, 'gameover_background');

        const gameOverString = 'Game Over';
        const letterSpacing = 55; // Constant spacing between each letter

        // Function to animate each letter falling into place
        const animateLetter = (index) => {
            if (index >= gameOverString.length) {
                return;
            }

            const letter = gameOverString[index];
            const x = 512 - ((gameOverString.length - 1) * letterSpacing) / 2 + index * letterSpacing; // Adjusted x-coordinate for each letter
            const y = 384 - 200; // Start from above the screen
            const duration = 350; // Duration of the animation

            // Create a new text object for the current letter
            const text = this.add.text(x, y, letter, {
                fontFamily: 'Arial Black',
                fontSize: 64,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5);

            // Animate the letter falling into place
            this.tweens.add({
                targets: text,
                y: 384, // Move to the center
                duration: duration,
                ease: 'Bounce.easeOut', // Bounce effect
                onComplete: () => {
                    // Recursively animate the next letter
                    animateLetter(index + 1);
                }
            });
        };

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });

        // Start the animation by animating the first letter
        animateLetter(0);
    }
}
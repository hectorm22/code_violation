import { Scene } from 'phaser';
import levels from '../data/levels';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
        this.menuButtons = [];
        this.selectedButtonIndex = 0;
        this.buttonSound;
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.add.image(512, 384, 'background');
        this.createMenuButtons();
        this.selectButton(this.selectedButtonIndex);
        this.menuButtons.forEach((button, index) => {
            this.animateButton(button, index * 200); // Adjust delay as needed
        });

        this.buttonSound = this.sound.add('buttonAudio');
    }

    createMenuButtons() {
        this.menuButtons.forEach(button => button.destroy()); // Clear existing buttons
        this.menuButtons = [];

        for (let i = 0; i < levels.length; i++) {
            const menuButton = this.add.text(
                460,
                400 + i * 75,
                levels[i].name,
                {
                    fontFamily: 'Arial Black',
                    fontSize: 26,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 6,
                    align: 'center'
                }
            );
            menuButton.setInteractive();

            menuButton.on('pointerup', () => {
                this.confirmSelection();
            });

            this.menuButtons.push(menuButton);
        }
    }

    update() {
        if (!this.cursors) return;

        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

        if (upJustPressed) {
            this.selectedButtonIndex = Math.max(this.selectedButtonIndex - 1, 0);
            this.selectButton(this.selectedButtonIndex);
            this.buttonSound.play();
        } else if (downJustPressed) {
            this.selectedButtonIndex = Math.min(this.selectedButtonIndex + 1, levels.length - 1);
            this.selectButton(this.selectedButtonIndex);
            this.buttonSound.play();
        } else if (spaceJustPressed) {
            this.confirmSelection();
            this.buttonSound.play();
        }
    }

    selectButton(index) {
        this.menuButtons.forEach((button, buttonIndex) => {
            button.setStyle({ color: buttonIndex === index ? '#ff0000' : '#ffffff' });
        });
    }

    confirmSelection() {
        const selectedButton = this.menuButtons[this.selectedButtonIndex];

        if (selectedButton) {
            if (this.selectedButtonIndex === 0) {
                this.scene.start('Game', { levelIndex: this.selectedButtonIndex });
            } else if (this.selectedButtonIndex === 1) {
                this.scene.start('Credits');
            } else if (this.selectedButtonIndex === 2) {
                this.scene.start('LeaderBoard');
            } else {
                if (confirm('Are you sure you want to exit?')) {
                    this.scene.stop('MainMenu'); // stop the main menu
                }
            }
        } else {
            console.error('Selected button is undefined.');
        }
    }

    animateButton(button, delay) {
        this.tweens.add({
            targets: button,
            scaleX: 1.05, // Scale up by 10%
            scaleY: 1.05,
            duration: 750, // Animation duration in milliseconds
            ease: 'Sine.easeInOut',
            yoyo: true, // Play animation in reverse
            repeat: -1, // Repeat indefinitely
            delay: delay, // Delay before starting the animation
        });
    }
}

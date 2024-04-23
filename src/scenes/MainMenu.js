import { Scene } from 'phaser';
import levels from '../data/levels';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
        this.menuButtons = [];
        this.selectedButtonIndex = 0;
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.add.image(512, 384, 'background');
        this.add.image(512, 100, 'logo');
        /*this.add.text(512, 260, 'Main Menu', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);*/

        this.createMenuButtons();
        this.selectButton(this.selectedButtonIndex);
    }

    createMenuButtons() {
        this.menuButtons.forEach(button => button.destroy()); // Clear existing buttons
        this.menuButtons = [];

        for (let i = 0; i < levels.length; i++) {
            const menuButton = this.add.text(
                460,
                360 + i * 100,
                levels[i].name,
                {
                    fontFamily: 'Arial Black',
                    fontSize: 26,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 8,
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
        } else if (downJustPressed) {
            this.selectedButtonIndex = Math.min(this.selectedButtonIndex + 1, levels.length - 1);
            this.selectButton(this.selectedButtonIndex);
        } else if (spaceJustPressed) {
            this.confirmSelection();
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
            } else {
                if (confirm('Are you sure you want to exit?')) {
                    this.scene.stop('MainMenu'); // stop the main menu
                }
            }
        } else {
            console.error('Selected button is undefined.');
        }
    }
}

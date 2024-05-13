import { Scene } from 'phaser';
import options from '../data/options';
import eventsCenter from './EventsCenter';

export class Settings extends Scene
{
    constructor() {
        super('Settings');
        this.settingButtons = [];
        this.selectedButtonIndex = 0;
        this.buttonSound = true;
        this.musicEnabled = true;
        this.soundsEnabled = true;
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create ()
    {
        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });

        this.cameras.main.setBackgroundColor("#000000");

        this.add.image(512, 384, 'background').setAlpha(0.3);

        this.add.text(512, 150, 'Settings\n', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.createsettingButtons();
        this.selectButton(this.selectedButtonIndex);

        this.buttonSound = this.sound.add('buttonAudio');
    }

    createsettingButtons() {
        this.settingButtons.forEach(button => button.destroy()); // Clear existing buttons
        this.settingButtons = [];

        for (let i = 0; i < options.length; i++) {
            const menuButton = this.add.text(
                460,
                400 + i * 75,
                options[i].name,
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

            this.settingButtons.push(menuButton);
        }
    }

    update() {
        if (!this.cursors) return;

        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

        if (upJustPressed) {
            this.selectedButtonIndex = Math.max(this.selectedButtonIndex - 1, 0);
        } else if (downJustPressed) {
            this.selectedButtonIndex = Math.min(this.selectedButtonIndex + 1, options.length - 1);
        }
        
        if (spaceJustPressed) {
            this.confirmSelection();
            if (this.buttonSound !== false) {
                this.buttonSound.play();
            }
        }
        
        if (this.buttonSound !== false && (upJustPressed || downJustPressed || spaceJustPressed)) {
            this.buttonSound.play();
        }
        
        this.selectButton(this.selectedButtonIndex);
    }

    selectButton(index) {
        this.settingButtons.forEach((button, buttonIndex) => {
            button.setStyle({ color: buttonIndex === index ? '#ff0000' : '#ffffff' });
        });
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        eventsCenter.emit('toggleMusic', this.musicEnabled);
    }
    
    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
        eventsCenter.emit('toggleSounds', this.soundsEnabled);
        this.buttonSound = false;
    }
    
    confirmSelection() {
        const selectedButton = this.settingButtons[this.selectedButtonIndex];

        if (selectedButton) {
            if (this.selectedButtonIndex === 0) {
                this.toggleMusic();
            } else if (this.selectedButtonIndex === 1) {
                this.toggleSounds();
            } else {
                this.scene.start('MainMenu');
            }
        } else {
            console.error('Selected button is undefined.');
        }
    }
}
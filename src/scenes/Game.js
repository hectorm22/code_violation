import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.playerHealth = 5;
        this.heartSprites = [];
        this.startTime = 10 * 60;
        this.currentTime = this.startTime;
        this.timerText = null;
        this.timerEvent = null;
    }

    create() {
        // Resets timer
        this.currentTime = this.startTime;

        //this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'game_background');
        // Create heart sprites based on player's healßth
        this.updateHealthIndicator();

        // Calculate the position for the life text
        const heartsWidth = this.playerHealth * 40;
        const lifeTextX = 30 + heartsWidth / 2;
        const lifeTextY = 40;

        // Create life text
        this.add.text(lifeTextX, lifeTextY, '--- Life ---', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 1);

        // Create weapon box
        const weaponBox = this.add.graphics();
        const boxWidth = 100;
        const boxHeight = 50;
        const boxX = this.cameras.main.width / 2 - boxWidth / 2;
        const boxY = 30;
        weaponBox.fillStyle(0x000000, 0.8);
        weaponBox.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Create weapon text
        this.add.text(this.cameras.main.width / 2, boxY + boxHeight / 2, 'Weapon', {
            fontFamily: 'Sans',
            fontSize: 16,
            color: '#ffffff'
        }).setOrigin(0.5);

        // Create timer text in the top-right corner
        this.timerText = this.add.text(this.cameras.main.width - 30, 30, '', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0);

        // Start the countdown timer
        this.startTimer();

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }

    update() {
        // Update the timer display every second
        if (this.timerEvent) {
            this.timerText.setText(this.formatTime(this.currentTime));
        }
    }

    updateHealthIndicator() {
        // Remove all existing heart sprites
        this.heartSprites.forEach(heartSprite => heartSprite.destroy());
        this.heartSprites = [];

        // Create heart sprites based on player's health
        for (let i = 0; i < this.playerHealth; i++) {
            const heartSprite = this.add.sprite(50 + i * 40, 50, 'heart');
            this.heartSprites.push(heartSprite);
        }
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }

    onTimerTick() {
        this.currentTime--;
        if (this.currentTime <= 0) {
            // Time's up, handle game over
            this.scene.start('GameOver');
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
        return `${minutes}:${paddedSeconds}`;
    }
}

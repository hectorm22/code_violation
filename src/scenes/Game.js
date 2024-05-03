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
        this.player = null;
        this.cursors = null;
        this.map = null;
        this.layer = null;
        this.layer = null;
        this.enemy = null;
        this.map2 = null;
        this.map3 = null;
        this.laser = null;
        this.map4 = null;
    }

    
    create() {

        this.cursors = this.input.keyboard.createCursorKeys();
        // Resets timer
        this.currentTime = this.startTime;

      
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
        }).setOrigin(0.5, 1).setScrollFactor(0);

        // Create weapon box
        const weaponBox = this.add.graphics();
        const boxWidth = 100;
        const boxHeight = 50;
        const boxX = this.cameras.main.width / 2 - boxWidth / 2;
        const boxY = 30;
        weaponBox.fillStyle(0x000000, 0.8);
        weaponBox.fillRect(boxX, boxY, boxWidth, boxHeight).setScrollFactor(0);

        // Create weapon text
        this.add.text(this.cameras.main.width / 2, boxY + boxHeight / 2, 'Weapon', {
            fontFamily: 'Sans',
            fontSize: 16,
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        // Create timer text in the top-right corner
        this.timerText = this.add.text(this.cameras.main.width - 30, 30, '', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);

        // Start the countdown timer
        this.startTimer();

        
        const array=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        const array2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        const array3 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        
        this.map2 = this.make.tilemap({ data:array, tileWidth: 100, tileHeight: 100});
        this.map2.addTilesetImage("tiles");

        this.map3 = this.make.tilemap({ data:array2, tileWidth: 100, tileHeight: 100});
        this.map3.addTilesetImage("tiles");
        
        this.map4 = this.make.tilemap({ data:array3, tileWidth: 100, tileHeight: 100});
        this.map4.addTilesetImage("tiles");

        this.layer = this.map2.createLayer(0, "tiles", 0, 600);
        this.layer2 = this.map3.createLayer(0, "tiles", 1800, 500);
        this.layer3 = this.map4.createLayer(0, "tiles", 3600, 400);

        

        // Or, you can set collision on all indexes within an array
        this.map2.setCollision([0]);
        this.map3.setCollision([0]);
        this.map4.setCollision([0]);

        // Visualize the colliding tiles
        const debugGraphics = this.add.graphics();
        debugGraphics.setScale(2);
        this.map2.renderDebug(debugGraphics);

        this.input.on('pointerdown', () =>
        {
            debugGraphics.visible = !debugGraphics.visible;
        });

        const help = this.add.text(16, 16, 'Click to toggle rendering collision information.', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        help.setScrollFactor(0);

        const controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            speed: 0.5
        };

        //settings for the camera and bounds for camera
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        this.cameras.main.setBounds(0, 0, this.map2.widthInPixels + this.map3.widthInPixels + this.map4.widthInPixels, this.map3.heightInPixels + this.map4.heightInPixels);
        
        //addition of enemy spritye and maincharacter
        this.enemy = this.physics.add.sprite(1000, 100, 'enemydrone');
        this.enemy.setScale(.2)
        this.player = this.physics.add.sprite(100,100, 'maincharacter');
        this.player.setScale(.5);
        this.player.flipX = true;
        //quick fix for players contact with floor
        this.player.body.setOffset(20, -35);

        //set collisions with player and world
        this.player.setCollideWorldBounds(true);

        

        //setting camera to follow player
        this.cameras.main.startFollow(this.player, true);
        this.player.setGravityY(-10);
    
        //animations for main character
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('maincharacter', {
                prefix: 'sprite',
                suffix: '.png',
                start: 4,
                end: 7,
                zeroPad: 2,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('maincharacter', {
                prefix: 'sprite',
                suffix: '.png',
                start: 8,
                end: 8,
                zeroPad: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNames('maincharacter', {
                prefix: 'sprite',
                suffix: '.png',
                start: 1,
                end: 3,
                zeroPad: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('maincharacter', {
                prefix: 'sprite',
                suffix: '.png',
                start: 0,
                end: 0,
                zeroPad: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });

        //animations for enemy
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('enemydrone', {
                prefix: 'sprite',
                suffix: '.png',
                start: 1,
                end:1,
                zeroPad: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'irate',
            frames: this.anims.generateFrameNames('enemydrone', {
                prefix: 'sprite',
                suffix: '.png',
                start: 2,
                end:2,
                zeroPad: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });

        //applying physics for player
        this.physics.add.existing(this.player);


        this.player.play('walk');
        this.player.setBounce(0.2);
        
        this.enemy.play('fly');

        this.cursors.up.on('down', () =>
        {
            if (this.player.body.blocked.down)
            {
                this.player.body.setVelocityY(-360);
            }
        }, this);

        //setting world bounds 
        this.physics.world.bounds.width = this.map2.widthInPixels + this.map3.widthInPixels + this.map4.widthInPixels + 100000;
        this.physics.world.bounds.height = this.map2.heightInPixels + 1000;

        //collision detetction for browser
        this.physics.add.collider(this.player, this.layer, this.handleCollision, null, this);
        this.physics.add.collider(this.player, this.layer2, this.handleCollision, null, this);
        this.physics.add.collider(this.player, this.layer3, this.handleCollision, null, this);
    }

    update(time, delta) {

        //setting collision for players
        this.physics.collide(this.player, this.layer);
        this.physics.collide(this.player, this.layer2);
        this.physics.collide(this.player, this.layer3);
        //this.physics.collide(this.enemy, this.layer1);
        
        //character orientation
        if (this.player.x > this.enemy.x) {
            this.enemy.flipX = true;
        } else {
            this.enemy.flipX = false;
        }

        this.controls.update(delta);
        // Update the timer display every second
        if (this.timerEvent) {
            this.timerText.setText(this.formatTime(this.currentTime));
        }
        
        //character controls
        if (this.cursors.left.isDown) {
            this.player.anims.play('walk', true);
            this.player.setVelocityX(-360); 
            this.player.flipX = false; 
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('walk', true);
            this.player.setVelocityX(360); 
            this.player.flipX = true; 
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);     
        }

        if (this.cursors.up.isDown) {
            this.player.anims.play('jump', true);
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }
            

            
        }
    
        // Distance between player and enemy
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
    const followDistance = 500; 
    const minDistance = 200;

    
    //if enemy comes in distance  of main chracter he follows
    if (distance < followDistance) {
        // Calculate the angle from the enemy to the player
        const angle = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
        this.enemy.play('irate');
        // Set the velocity of the enemy to move towards the player
        if (distance > minDistance) {
            this.enemy.setVelocityX(Math.cos(angle) * 260); 
            this.enemy.setVelocityY(Math.sin(angle) * 260); 
        } else {        
            this.enemy.setVelocityX(-Math.cos(angle) * 100); 
            this.enemy.setVelocityY(-Math.sin(angle) * 100);
        }
    }
    else {
        this.enemy.play('fly');
        this.enemy.setVelocityX(0);
        this.enemy.setVelocityY(0);
    }
    
    //ends game if player falls through floor
    if (this.player.y > 1000) {
        console.log('Player is out of bounds');
        this.endGame();
    }


}   

    updateHealthIndicator() {
        // Remove all existing heart sprites
        this.heartSprites.forEach(heartSprite => heartSprite.destroy());
        this.heartSprites = [];

        // Create heart sprites based on player's health
        for (let i = 0; i < this.playerHealth; i++) {
            const heartSprite = this.add.sprite(50 + i * 40, 50, 'heart').setScrollFactor(0);
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

    handleCollision(player, enemy) {
        // Handle what happens when they collide
        console.log('Collision detected!');
        // Example: Decrease health, trigger animations, etc.
        player.health -= 1;
        if (player.health <= 0) {
           player.anims.play('death');
            // Further game over handling
        }
    }

    endGame() {
        // Handle game end logic here
        console.log('Game Over!');
        // For example, you might stop physics or transition to a 'Game Over' scene
        this.physics.pause();
        this.scene.start('GameOver');
}
}

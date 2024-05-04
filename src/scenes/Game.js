import { Scene } from 'phaser';
import LaserGroup from '../objects/LaserGroup';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.playerHealth = 5;
        this.heartSprites = [];
        // this.startTime = 10 * 60;
        // this.currentTime = this.startTime;
        // this.timerText = null;
        // this.timerEvent = null;
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

        this.score = 0;               // Set the core 
        this.scoreText = null;
        this.username = null;         // Get username from cookie
        this.usrnameText = null;
        this.timer = 0;
        this.timerText = null;
        this.interval = 0;

        this.lasers = null;
        this.laserSound;
        this.gameOver = false;
        this.attachPlayer = false;
        this.shield = 10000;
        this.shieldText;
        this.explosionSound;

        this.stars;
    }

    
    create() {
        this.gameOver = false;
        /****************************
         *  Build the game world
         ****************************/

        // Build the background image
        this.add.image(512, 384, 'game_background');
        // Build the gound
        const array=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        const array2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        const array3 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
        this.map2 = this.make.tilemap({ data:array, tileWidth: 100, tileHeight: 100});
        this.map2.addTilesetImage("tiles");
        this.map3 = this.make.tilemap({ data:array2, tileWidth: 100, tileHeight: 100});
        this.map3.addTilesetImage("tiles");
        this.layer = this.map2.createLayer(0, "tiles", 0, 600);
        this.layer2 = this.map3.createLayer(0, "tiles", 1800, 500);        

        // Or, you can set collision on all indexes within an array
        this.map2.setCollision([0]);
        this.map3.setCollision([0]);
        // Visualize the colliding tiles
        const debugGraphics = this.add.graphics();
        debugGraphics.setScale(2);
        this.map2.renderDebug(debugGraphics);
        //setting world bounds 
        this.physics.world.bounds.width = this.map2.widthInPixels + this.map3.widthInPixels;
        this.physics.world.bounds.height = this.map2.heightInPixels + 1000;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', () =>
        {
            debugGraphics.visible = !debugGraphics.visible;
        });
      
        /****************************
         *  Build the health indicator
         ****************************/
        
        // Calculate the position for the life text
        const heartsWidth = this.playerHealth * 40;
        const lifeTextX = 30 + this.playerHealth * 40/2;
        const lifeTextY = 40;
        // Create life text
        this.add.text(lifeTextX, lifeTextY, '--- Life ---', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 1).setScrollFactor(0);

        this.shieldText = this.add.text(220, lifeTextY+20, `--- Shield: ${this.shield}`, {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);

        /****************************
         *  Build the timer
         ****************************/
        // Print User, Score, and Timer on the page
        this.username = this.getUsernameFromCookie();
        this.usrnameText = this.add.text(this.cameras.main.width-60, 56, `User: ${this.username}`, {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);
        this.scoreText = this.add.text(this.cameras.main.width-60, 96, 'Score: 0', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);
        this.timerText = this.add.text(this.cameras.main.width-60, 16, '', {
                fontFamily: 'Sans',
                fontSize: 18,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0).setScrollFactor(0);

        this.interval = setInterval(()=>{
            this.timer += 1;
            this.timerText.setText('Timer: '+this.timer.toString());
            if (this.timer % 10 === 0) {
                // Perform an action every 50 seconds
                console.log('10 seconds have passed');

                // update player data
                let minutePart = Math.floor(this.timer / 60);
                let secondsPart = (this.timer % 60) / 100;
                this.playerData = {'username': this.username, 'score': this.score, "time": minutePart + secondsPart};

                this.saveData();
            }
            if (this.timer % 2 === 0 && this.attachPlayer === true){
                this.shield += 10;
                this.enemyAttach();
            }

        }, 1000);

        const controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            speed: 0.5
        };

        //settings for the camera and bounds for camera
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        this.cameras.main.setBounds(0, 0, this.map2.widthInPixels + this.map3.widthInPixels, this.map2.heightInPixels + this.map3.heightInPixels);
        
        //addition of enemy sprit and maincharacter
        this.enemy = this.physics.add.sprite(1000, 100, 'enemydrone');
        this.enemy.setScale(.2)
        this.enemy.setGravity(-10);
        this.player = this.physics.add.sprite(100,550, 'maincharacter');
        this.player.setScale(.5);
        this.player.flipX = true;
        //quick fix for players contact with floor
        this.player.body.setOffset(20, -35);

        //set collisions with player and world
        this.player.setCollideWorldBounds(true);      

        //setting camera to follow player
        this.cameras.main.startFollow(this.player, true);
        //this.player.setGravityY(-10);
    
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

        this.cursors.up.on('down', () =>
        {
            if (this.player.body.blocked.down)
            {
                this.player.body.setVelocityY(-360);
            }
        }, this);

        // Set up input cursors
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // 'S' key
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); // 'F' key
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // 'E' key

        //applying physics for player
        this.physics.add.existing(this.player);
        this.player.play('walk');
        this.player.setBounce(0.2);       
        this.enemy.play('fly');

        // Set laserGroup
        this.lasers = new LaserGroup(this);
        this.laserSound = this.sound.add('laserAudio');
        
        //collision detetction for browser
        this.physics.add.collider(this.player, this.layer);
        this.physics.add.collider(this.player, this.layer2);
        
        // Set Bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.layer);
        this.physics.add.collider(this.bombs, this.layer2);
        this.physics.add.collider(this.player, this.bombs, this.touchBomb, null, this);
        this.physics.add.overlap(this.lasers, this.enemy, this.touchEnemies, null, this);
        this.explosionSound = this.sound.add('exploseAudio');

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 2,
            setXY: { x: this.enemy.x-200, y: 0, stepX: 70 }
        });       
        this.stars.children.iterate(function (child) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });
        this.physics.add.collider(this.stars, this.layer);
        this.physics.add.collider(this.stars, this.layer2);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }

    update() {
        if (!this.player) return; // Guard clause to avoid updating when player is not initialized

        if (this.gameOver){
            clearInterval(this.interval);
            this.timer = 0;
            this.physics.pause();
            this.gameOver = false;
            this.scene.start('GameOver');
        }

        //setting collision for players
        this.physics.collide(this.player, this.layer);
        this.physics.collide(this.player, this.layer2);
        
        //character orientation
        if (this.player.x > this.enemy.x) {
            this.enemy.flipX = true;
        } else {
            this.enemy.flipX = false;
        }
        
        //character controls
        if (this.cursors.left.isDown || this.keyS.isDown) {
            this.player.anims.play('walk', true);
            this.player.setVelocityX(-360); 
            this.player.flipX = false; 
        } else if (this.cursors.right.isDown || this.keyF.isDown) {
            this.player.anims.play('walk', true);
            this.player.setVelocityX(360); 
            this.player.flipX = true; 
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);     
        }

        if (this.cursors.up.isDown || this.keyE.isDown) {
            this.player.anims.play('jump', true);
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }                      
        }

        //Control fighting
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
        if (spaceJustPressed)
        {
            // this.player.setVelocityY(-500);
            const laser = this.lasers.get(this.player.x, this.player.y);
            if (laser) {
                this.fireBullet();
                this.laserSound.play();
            }
        }
    
        // Distance between player and enemy
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
        const followDistance = 600; 
        const minDistance = 200;

        // Calculate the target position above the player
        const targetX = this.player.x;
        const targetY = this.player.y - 200; // Adjust this value as needed

        // Calculate the angle from the enemy to the target position
        const angleToTarget = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, targetX, targetY);
    
        //if enemy comes in distance  of main chracter he follows
        if (distance < followDistance) {
            // Calculate the angle from the enemy to the player
            const angle = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
            this.enemy.play('irate');
            // Set the velocity of the enemy to move towards the player
            if (distance > minDistance) {
                this.enemy.setVelocityX(Math.cos(angleToTarget) * 260); 
                this.enemy.setVelocityY(Math.sin(angleToTarget) * 260); 
                //this.attachPlayer = false;
            } 
            else {        
                this.enemy.setVelocityX(-Math.cos(angleToTarget) * 100); 
                this.enemy.setVelocityY(-Math.sin(angleToTarget) * 100);
                this.attachPlayer = true;
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
            this.gameOver = true;
        }

        // Create heart sprites based on player's healßth
        this.updateHealthIndicator();

        if (this.playerHealth <=0){
            this.attachPlayer = false;    
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

    // retrieve username from cookie
    getUsernameFromCookie() {
        const usernameCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
        const username = usernameCookie ? usernameCookie.split('=')[1] : 'No session found';
        console.log('Username from cookie:', username); 
        return username; // Return the retrieved username
    }
    
    // save username and score into server
    saveData()
    {
        fetch('http://localhost:3000/post_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.playerData),
            })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }   

    fireBullet() {
		this.lasers.fireBullet(this.player.x, this.player.y + 20);
	}

    enemyAttach ()
    {
        var numOfBomb = 3;
        for (var i = 0; i < numOfBomb; i++) {
            // var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(this.enemy.x, this.enemy.y+20, 'bomb');
            bomb.setBounce(0.5);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(350);
        }
    }
    touchBomb (player, bomb)
    {
        //this.physics.pause();
        this.playerHealth -= 1;
        bomb.disableBody(true,true);
        this.explosionSound.play();
        if (this.playerHealth < 5){
            player.setTint(0xff0000);
        }else{
            player.clearTint();
        }
        if (this.playerHealth <= 0){
            this.gameOver = true;
        }
    }

    touchEnemies (laser, enemy)
    {
        //laser.disableBody(true, true);
        //enemy.disableBody(true, true);
        this.shield -= 10;
        this.shieldText.setText('--- Shield:' + this.shield);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if (this.shield <=0){
            this.explosionSound.play();
            laser.disableBody(true,true);
        }
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);
        this.playerHealth += 1;
        if (this.stars.countActive(true) === 0)
        {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }
}

import { Scene } from 'phaser';
import BustlingOrson from '../objects/MainCharacter'; // import the player
import LaserGroup from '../objects/LaserGroup';
import eventsCenter from './EventsCenter';

export class Level1 extends Scene {
    constructor() {
        super('Level1');

        this.playerHealth = 5;
        this.heartSprites = [];
        this.player = null;
        this.cursors = null;
        this.map = null;
        this.layer = null;
        this.layer = null;
        this.enemy = null;
        this.enemy_alive = true;
        this.map2 = null;
        this.map3 = null;
        this.laser = null;
        this.map4 = null;

        this.score = 0;
        this.scoreText = null;
        this.username = null;
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
        this.fighters;
    }

    create() {
        // build the level
        this.bangerSound = this.sound.add('banger');
        eventsCenter.on('toggleMusic', (toggle) => {
            if (toggle) {
                this.bangerSound.play();
            } else {
                this.bangerSound.stop();
            }
        });

        eventsCenter.on('toggleSounds', (toggle) => {
            if (toggle) {
                this.soundsEnabled = toggle;
            }
        });
        
        this.add.image(3840 / 2, 1536 / 2, 'level1_bg');

        this.map = this.make.tilemap({ key: "level1map", tileWidth: 128, tileHeight: 128 });
        const tileset = this.map.addTilesetImage("level1tiles", "level1tiles");
        this.layer = this.map.createLayer("toplayer", tileset, 0, 0);
        this.layer.setCollision([1, 2, 3, 4, 5, 6], true);

        //setting world bounds
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;

        console.log(this.layer.displayWidth, this.layer.displayHeight);

        this.cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            speed: 0.5,
        };

        // settings for the camera and bounds for camera
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(0.88);

        // create and spawn the main character
        this.player = new BustlingOrson({ scene: this, x: 200, y: 710, cursors: this.cursors });

        // enemy
        this.enemy = this.physics.add.sprite(400, 850, 'enemydrone');
        this.enemy.setScale(.2)
        this.enemy.setGravity(-10);

        //animations for enemy
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('enemydrone', {
                prefix: 'sprite',
                suffix: '.png',
                start: 1,
                end: 1,
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
                end: 2,
                zeroPad: 2,
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.enemy.play('fly');

        // Set laserGroup
        this.lasers = new LaserGroup(this);
        this.laserSound = this.sound.add('laserAudio');

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject && body.gameObject.name === 'laser') {
                body.gameObject.destroy(); // Destroy the laser
            }
        });
        
        this.explosionSound = this.sound.add('exploseAudio');

        // Set Bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.layer);
        this.physics.add.collider(this.player, this.bombs, this.touchBomb, null, this);

        this.physics.add.collider(this.lasers, this.layer);
        this.physics.add.collider(this.lasers, this.enemy, this.touchEnemies, null, this);

        // make the character collide with any solid in this layer of the the level
        this.physics.add.collider(this.player, this.layer);

        // setting camera to follow the character
        this.cameras.main.startFollow(this.player, true, 0.22, 0.22);

        /****************************
         *  Build the health indicator
         ****************************/

        // Calculate the position for the life text
        const heartsWidth = this.playerHealth * 40;
        const lifeTextX = 30 + this.playerHealth * 40 / 2;
        const lifeTextY = 40;

        // Create life text
        this.add.text(lifeTextX, lifeTextY, '--- Life ---', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 1).setScrollFactor(0);

        this.shieldText = this.add.text(220, lifeTextY + 20, `--- Shield: ${this.shield}`, {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);


        const help = this.add.text(16, 16, 'Click to toggle rendering collision information.', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        help.setScrollFactor(0);

        /****************************
         *  Build the timer
         ****************************/
        // Print User, Score, and Timer on the page
        this.username = this.getUsernameFromCookie();
        this.usrnameText = this.add.text(this.cameras.main.width - 60, 56, `User: ${this.username}`, {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);

        this.scoreText = this.add.text(this.cameras.main.width - 60, 96, 'Score: 0', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);

        this.timerText = this.add.text(this.cameras.main.width - 60, 16, '', {
            fontFamily: 'Sans',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0);

        // timer
        this.interval = setInterval(() => {
            this.timer += 1;
            this.timerText.setText('Timer: ' + this.timer.toString());
            if (this.timer % 10 === 0) {
                // Perform an action every 50 seconds
                console.log('10 seconds have passed')

                // update player data
                let minutePart = Math.floor(this.timer / 60);
                let secondsPart = (this.timer % 60) / 100;
                this.playerData = { 'username': this.username, 'score': this.score, "time": minutePart + secondsPart };

                this.saveData();
            }
            if (this.timer % 2 === 0 && this.attachPlayer === true && this.enemy_alive == true) {
                this.shield += 10;
                this.enemyAttach();
            }

        }, 1000);

        // Set Stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 2,
            setXY: { x: this.enemy.x - 100, y: this.player.y + 100, stepX: 70 }
        });  

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.layer);
        this.physics.add.collider(this.stars, this.layer2);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Fighters group
        this.fighters = this.physics.add.group({
            key: 'enemyfighter',
            repeat: 2,
            setXY: { x:this.player.x, y: 50, stepX: 150 },
        });

        // Move fighters towards player and generate new fighters
        this.time.addEvent({
            delay: 5000, // Delay for generating new fighters 
            callback: () => {
                this.fighters.children.iterate((fighter) => {
                    //fighter.y -= 1; // Adjust speed here (e.g., 1 units per update)
                
                });

            // Generate new fighter if needed
            const lastFighter = this.fighters.getLast(true); // Get the last fighter in the group
            if (lastFighter && lastFighter.y > 100) {
                const newFighter = this.fighters.create(this.player.x, 50, 'enemyfighter'); // Create new fighter
                newFighter.setVelocityY(150); // Set initial velocity if needed
            }
            this.dropBomb(lastFighter);
            },
            callbackScope: this,
            loop: true,
        });

        this.physics.add.collider(this.lasers, this.fighters, this.touchFighters, null, this);
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
    saveData() {
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
		this.lasers.fireBullet(this.player.x, this.player.y - 30);
	}

    enemyAttach ()
    {
        var numOfBomb = 1;
        for (var i = 0; i < numOfBomb; i++) {
            // var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(this.enemy.x, this.enemy.y+10, 'bomb');
            bomb.setBounce(0.5);
            bomb.setCollideWorldBounds(true);
            if (this.player.x < this.enemy.x) {
                // Player is to the left, set velocity to negative
                bomb.setVelocityX(-350);
            }
            else
            {
                // Player is to the right, set velocity to positive
                bomb.setVelocityX(350);
            }       
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
        //laser.setVisible(false);
        //enemy.disableBody(true, true);
        this.shield -= 10;
        this.shieldText.setText('--- Shield:' + this.shield);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if (this.shield <=0){
            this.explosionSound.play();
            laser.disableBody(true,true);
            this.enemy_alive = false;
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

    dropBomb (fighter)
    {
        var numOfBomb = 1;
        for (var i = 0; i < numOfBomb; i++) {
            // var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(fighter.x-200, 300, 'bomb');
            bomb.setBounce(0.5);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(250);
        }
    }

    touchFighters(laser, fighter)
    {
        laser.disableBody(true, true);
        laser.setVisible(false);
        fighter.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    update() {
        if (!this.player) return; // Guard clause to avoid updating when player is not initialized

        // render the player
        this.player.update();

        if (this.gameOver){
            clearInterval(this.interval);
            this.timer = 0;
            this.physics.pause();
            this.gameOver = false;
            this.playerHealth = 5;
            this.shield = 10000; 
            this.scene.start('GameOver');
        }

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

        // shoot laser above
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

        if (spaceJustPressed)
        {
            // this.player.setVelocityY(-500);
            const laser = this.lasers.get(this.player.x, this.player.y);
            if (laser) {
                this.fireBullet();
                this.laserSound.play();
            }
            if (laser.y > 700){
                laser.destroy();
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

        // Create heart sprites based on player's healßth
        this.updateHealthIndicator();

        if (this.playerHealth <=0){
            this.attachPlayer = false;    
        }
    }
}
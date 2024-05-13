import Phaser from 'phaser';

export default class BustlingOrson extends Phaser.Physics.Arcade.Sprite {
    /**
     * Makes and spawns the player.
     * @param config.scene the scene to add this character in.
     * @param config.x the x position in the scene to spawn this character at
     * @param config.y the y position in the scene to spawn this character at
     **/
    constructor(config) {
        super(config.scene, config.x, config.y, "maincharacter");

        config.scene.physics.add.existing(this, false);
        config.scene.add.existing(this);

        this.cursors = config.scene.cursors;

        this.setScale(.5);
        this.body.setOffset(20, -35);
        this.body.setGravityY(360);
        this.flipX = true;

        // sets collsions between this character and the scene
        this.setCollideWorldBounds(true);

        // make his collision box slightly skinny
        this.setBodySize(this.displayWidth - 1, this.displayHeight);

        // set up animations
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
    }

    update() {
        // update character movements and animation

        // if player is on ground
        if (this.cursors.left.isDown) {
            // walk left
            this.play("walk", true);
            this.body.setVelocityX(-230);
            this.flipX = false;
        }
        
        if (this.cursors.right.isDown) {
            // walk right
            this.play("walk", true);
            this.body.setVelocityX(230);
            this.flipX = true;
        }
        
        if (this.cursors.up.isDown && this.body.blocked.down) {
            // jump
            this.body.setVelocityY(-600);
        }
        
        if (this.cursors.down.isDown) {
            // crouch
        }
        
        if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            // idle - all inputs inactive
            this.play("idle", true);
            this.body.setVelocityX(0);
        }

        // if player is in the air (very weird way of checking it)
        if (!this.body.blocked.down && (this.body.deltaYFinal() != 0.0 && !this.body.onFloor())) {
            this.play("jump", true);
        }
    }
}
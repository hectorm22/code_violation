import { Scene } from 'phaser';
import BustlingOrson from '../objects/MainCharacter'; // import the player

export class Level1 extends Scene {
    constructor() {
        super('Level1');

        this.player = null;
    }

    create() {
        // build the level
        this.add.image(3840/2, 1536/2, 'level1_bg');

        this.map = this.make.tilemap({key: "level1map", tileWidth: 128, tileHeight: 128});
        const tileset = this.map.addTilesetImage("level1tiles", "level1tiles");
        this.layer = this.map.createLayer("toplayer", tileset, 0, 0);
        this.layer.setCollision([1,2,3,4,5,6], true);

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
        this.cameras.main.setZoom(0.87);

        // create and spawn the main character
        this.player = new BustlingOrson({scene: this, x: 200, y: 710, cursors: this.cursors});

        // make the character collide with any solid in this layer of the the level
        this.physics.add.collider(this.player, this.layer);

        // setting camera to follow the character
        this.cameras.main.startFollow(this.player, true, 0.22, 0.22);
    }

    update() {
        // render the player
        this.player.update();
    }
}
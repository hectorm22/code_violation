import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });

    }

    
    
    
    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('background', 'menu_background.jpg');
        this.load.image('credits_background', 'c_background.png');
        this.load.image('heart', 'heart.png');
        this.load.image('game_background', 'animations/game_background_new.png');
        this.load.image('gameover_background', 'game_over.jpg');
        this.load.image('platform', 'animations/platform.png');
        this.load.tilemapTiledJSON('map', 'animations/SuperMariotilemap.json');
        this.load.image('SuperMarioBros-World1-1', 'animations/SuperMario.png');
        this.load.atlas('maincharacter', 'animations/maincharacter.png', 'animations/maincharacter.json');
        //this.load.tilemapTiledJSON('map1', 'animations/map.json');
        //this.load.spritesheet('tiles', 'animations/tiles.png', {frameWidth: 70, frameHeight: 70});
        this.load.atlas('enemydrone', 'animations/enemy.png', 'animations/enemy.json');
        this.load.image('tiles', 'animations/texture.png');
        this.load.atlas('laser', 'animations/laser.png', 'animations/laser.json');
        this.load.image('game_background', 'entrance.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}

import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('background', 'assets/mm_background.png');
        this.load.image('credits_background', 'assets/c_background.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}

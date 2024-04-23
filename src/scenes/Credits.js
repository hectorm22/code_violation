import { Scene } from 'phaser';

export class Credits extends Scene
{
    constructor ()
    {
        super('Credits');
    }

    create ()
    {
        // this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'credits_background')

        this.add.text(512, 250, 'Sprite Animations: Cade Andersen\n', {
            fontFamily: 'Sans', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 350, 'Input Control: Fang Lin\n', {
            fontFamily: 'Sans', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 450, 'User Interface: Everardo Robles\n', {
            fontFamily: 'Sans', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 550, 'Database: Hector Martinez\n', {
            fontFamily: 'Sans', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 7,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}

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
        this.load.image('laser', 'laserBlue.png');
        this.load.audio('buttonAudio', './audio/buttonPressSound.wav');
        this.load.audio('laserAudio', './audio/laser.m4a')
        this.load.audio('exploseAudio', './audio/explosion.wav')
        this.load.image('bomb', 'bomb.png');
        this.load.image('star', 'star.png');
    }

    create ()
    {
        if (!this.usernameCookie){
            this.setUsername();
        }
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }

    getUsername ()
    {
        /*
        this.load.json('http://localhost:3000/getUsername', (response) => {
            const username = response.username || 'No session found';
            console.log('Username from session:', username);
        });
        */
        const usernameCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
        const username = usernameCookie ? usernameCookie.split('=')[1] : 'No session found';
        return username;
    }

    setUsername ()
    {
        /*const usernameCookie = document.cookie.split('; ').find(row => row.startsWith('connect.sid='));
        if (!usernameCookie) {
            const username = prompt('Set an username:');

            if (username) {
                // Send a POST request to set the username in the server's session
                fetch('http://localhost:3000/setUsername', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Username set successfully:', username);
                        // Set username in a cookie
                        document.cookie = `username=${username}; max-age=${30 * 24 * 60 * 60}; path=/`; // Set cookie path as needed
                    } else {
                        console.error('Failed to set username');
                    }
                })
                .catch(error => console.error('Error setting username:', error));
            }
        }*/
        const username = prompt('Set an username:');

        // Set username in a cookie
        document.cookie = `username=${username}; max-age=${30 * 24 * 60 * 60}; path=/`; // Set cookie path as needed
        console.log('Username set successfully:', username);

    }

}

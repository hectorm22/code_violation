import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Credits } from './scenes/Credits';
import { LeaderBoard } from './scenes/LeaderBoard';
import { Level1 } from './scenes/Level1';
import { Settings } from './scenes/Settings';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 600},
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        Credits,
        LeaderBoard,
        GameOver,
        Level1,
        Settings
    ]
};

export default new Phaser.Game(config);

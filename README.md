# Phaser-Webpack Framework

This is a Phaser 3 project framework that uses webpack for bundling. Including a main menu, it can move cursor to choose button and enter next page. 

## Basic Gameplay

The enemy will trace the player. When the enemy approches the player, it will drop bombs. If a bomb touched the player, the health of the player will decrease. But the player can collect the star to increase the health. The player can use the laser to shoot the enemy. If the laser touches the enemy, the shield of the enemy will decrease. However, the enemy will increase its shield over time. I plan to win the game when the enemy lost all shields and lose the game when the player is out of the health or falls out of the bound.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |


## Writing Code

The local development server runs on `http://localhost:8080` by default. Please see the webpack documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Webpack will automatically recompile your code and then reload the browser.

## Project Structure

We have provided a default project structure to get you started. This is as follows:

- `index.html` - A basic HTML page to contain the game.
- `src` - Contains the game source code.
- `src/main.js` - The main entry point. This contains the game configuration and starts the game.
- `src/scenes/` - The Phaser Scenes are in this folder.
- `src/data` - Contains the menu name in the levels.j.
- `public/style.css` - Some simple CSS rules to help with page layout.
- `public/assets` - Contains the static assets used by the game.

## Keyboard events

In the MainMenu scene, using up and down key to move the cursor and space to confirm. In the GameOver and Credits scenes, using mouse click or space to return MainMenu scene.


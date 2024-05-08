![CV Version](https://img.shields.io/badge/version-0.6.0%20alpha-lime)
![NPM Version](https://img.shields.io/npm/v/npm)


# Code Violation
Code Violation is a web-based 2-D platformer game using the Phaser 3 framework.

## Basic Gameplay
The enemy will trace the player. When the enemy approches the player, it will drop bombs. If a bomb touched the player, the health of the player will decrease. But the player can collect the star to increase the health. The player can use the laser to shoot the enemy. If the laser touches the enemy, the shield of the enemy will decrease. However, the enemy will increase its shield over time. I plan to win the game when the enemy lost all shields and lose the game when the player is out of the health or falls out of the bound.

## Requirements
[NodeJS](https://nodejs.org) is required to properly install Code Violation and all of its dependencies. Preferably, `npm` should have  latest update.

## Installation
First, install the [latest release](https://github.com/hectorm22/code_violation/releases/latest) of our build.

Unzip the `dist` folder anywhere, and navigate into it. To initiate the setup process,
execute `npm install` in a terminal. This should bring all the dependencies requires
by Code Violation to function.

## Running Code Violation
Code Violation can be run by executing `npm run start` in a terminal. A message will appear
informing you that the server has been activated and now running.

Using any browser, navigate to `http://localhost:3000`, where upon visiting the game will initialize and display. On each visit or refresh, the game will ask you for a username. Enter any username to proceed. If you receive an error about a port already being in use, navigate to the [troubleshooting](#troubleshooting) section

## Troubleshooting
### Port in use
This is usually because another program on your machine is listening on port 3000, the same port Code Violation uses. In this case do these steps below:
1. Open the `server.js` file located at the root directory.
2. Navigate to the end of the file, there should be a line that reads: 
```js 
app.listen(3000, () => {
```
3. Change `3000` to something like `3030`, or any other port number you think is not in use. Save and close the file and start the server again. The server should now start up normally.

## Contributors and Maintainers
- Cade Andersen
- Fang Lin
- Everardo R. Tena
- Hector Martinez

## Frequently Asked Questions (FAQ)
### Q: Is it possible to run the game other than using Node?
**A: No, you must use NodeJS + ExpressJS as its web server, since the client and server side emit specific fetch calls to each other.**

### Q: How can I read the database file?
**A: You can use a software like [DB Browser for SQLite](https://sqlitebrowser.org/) that runs in most popular operating systems to view, change, import and export data.**

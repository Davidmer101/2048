import Game from './engine/game.js';
// using d/t constructor than normal
// let game = new Game([8,4,4,2,
//                      4,4,8,2,
//                      8,8,2,0,
//                      4,4,0,2], 4);
// console.log('in Test')
// console.log(game.toString());
// game.move('right');
// console.log('after moving right: ')
// console.log(game.toString());
let game = new Game(4);
console.log(game.toString());

let firstGameState = {
    board : [4,  2, 32,  8,
             2,  4, 16,  4,
             8,  0, 32,  8,
             4,  2,  4,  2],
    score: 0,
    won: false,
    over: false
}

let myGameState = {
    board : [256,   8  , 2 ,  0,
	    8 , 64,  16 ,  2,
	    4 ,  8 , 32 , 64,
	    8  , 4 ,  2,  8],
    score: 0,
    won: false,
    over: false
}

game.loadGame(myGameState);
console.log(game.toString());
game.move('right');
console.log(game.toString());
let state = game.getGameState();
console.log(state.over);

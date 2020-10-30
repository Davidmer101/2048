class Game {
    
    board = [];
    score = 0;
    won = false;
    over = false; 
    gameStartDimenstion=0;
    moveListeners = [];
    winListeners = [];
    loseListeners = [];
    restartListener = [];
    gameState;

    /*
    give the array myself for testing purpose only delete after
    */
    // constructor(array, dimension) {
    //     this.gameStartDimenstion = dimension;
    //     let counter = 0; 
    //     for (let row = 0; row < dimension; row++) {
    //         for(let column = 0; column < dimension; column++){
    //             this.board.push(array[counter])
    //             counter++;
    //         }
    //     }
    // }

    //above is constructor for test.js
    //belw is constructor for run_in_console.js
    constructor(dimension) {
        dimension = Math.floor(dimension);
        this.gameStartDimenstion = dimension;
        this.setupNewGame();
    }


    // Resets the game back to a random starting position.
    setupNewGame() { 
        this.gameState = {
            board: [], //was number[]
            score: 0,
            won: false,
            over: false
          }
        //make sure it's integer
        let dimension = this.gameStartDimenstion;
        //create a board with all values = 0
        for (let row = 0; row < dimension; row++) {
            for(let column = 0; column < dimension; column++){
                // console.log('board making process')
                this.gameState.board.push(0)
                // console.log(this.toString());
            }
        }

        //randomly assign two of the tiles to a number
        //randomlyl select two different tiles
        let tileFirst =  Math.floor(Math.random()*(dimension*dimension));
        let tileSecond =  Math.floor(Math.random()*(dimension*dimension))
        while(tileFirst==tileSecond) {
            tileSecond = Math.floor(Math.random()*(dimension*dimension));
        }

        let percent = Math.floor(Math.random()*100)
        if(percent >= 10) {
            //add 2 to random openSlot
            this.gameState.board[tileFirst] = 2;
        } else {
            this.gameState.board[tileFirst] = 4;
        }
        percent = Math.floor(Math.random()*100)
        if(percent >= 10) {
            //add 2 to random openSlot
            this.gameState.board[tileSecond] = 2;
        } else {
            this.gameState.board[tileSecond] = 4;
        }
        //randomly assign two of the tiles to a number
        //randomlyl select two different tiles
        this.updateListeners(this.restartListener,this.gameState)
    }
    //up is constructor for run-in-console.js
    // Given a gameState object, it loads that board, score, etc...
    loadGame(gameState) {
        this.gameState.board =  gameState.board;
        this.gameState.score =  gameState.score;
        this.gameState.won =  gameState.won;
        this.gameState.over =  gameState.over;
    }
    // Given "up", "down", "left", or "right" as string input,
    //  it makes the appropriate shifts and adds a random tile.
    move(direction) {
        switch (direction) {
            case 'up':
                this.moveUp();
                this.updateListeners(this.moveListeners, this.gameState)
                break;
            case 'down':
                this.moveDown();
                this.updateListeners(this.moveListeners, this.gameState)
                break;
            case 'left':
                this.moveLeft();
                this.toString();
                this.updateListeners(this.moveListeners, this.gameState)
                break;
            case 'right':
                this.moveRight();
                this.updateListeners(this.moveListeners, this.gameState)
                break;
        }
        let index = 0;
        while(index < this.gameStartDimenstion**2) {
            if(this.gameState.board[index] == 0) {
                break;
            }
            index++;
        }
        if(index==this.gameStartDimenstion**2) {
            this.isGameOver();
        }
        
    }

    moveUp() {
        this.transposeRight();
        this.moveRight();
        this.transposeLeft();
    }

    moveDown() {
       this.transposeLeft();
       this.moveRight();
       this.transposeRight();
    }

    moveLeft() {
        this.transposeLeft();
        this.moveDown();
        this.transposeRight();
    }

    moveRight() {
        // let openSlots = [];
        let canShift = false;
        let shift = false; //only if there's shift that I generate random number
        let columSize = this.gameStartDimenstion;
        // let adjustinColumn; //adjusts what to subtract in each column
        for(let row = 0; row < this.gameStartDimenstion; row++){ //goes row by row
            let rightPointer, leftPointer, toPut;
            rightPointer =toPut = columSize - 1;

            for(let i = 0; i < this.gameStartDimenstion**2; i++) {
                    //gives you a rightpointer pointing at the first non-zero column
                while(this.gameState.board[rightPointer] == 0 && rightPointer > columSize - this.gameStartDimenstion){
                    rightPointer--; //subtract first to leave a slot to put the addition
                    // openSlots.push(rightPointer)       
                }
                //case 1: rightpointer reaches the left most column
                if(rightPointer == columSize - this.gameStartDimenstion){
                    if(this.gameState.board[rightPointer]==0) {
                        break;
                    } else {
                        // openSlots.push(rightPointer)
                        this.gameState.board[toPut] = this.gameState.board[rightPointer]
                        shift = true; //there's a shift here
                        if(toPut != rightPointer) {
                            this.gameState.board[rightPointer] = 0 // remove it from its orginal location
                        }               
                        break;
                    }
                }
                //case 2: found a non zero number before the end of the column
                leftPointer = rightPointer-1; 
                //find the next non-zero number using the left pointer start before the right pointer
                while(this.gameState.board[leftPointer] == 0 && leftPointer > columSize - this.gameStartDimenstion){
                    // openSlots.push(leftPointer); // dont' add now unil you know  the shift
                    leftPointer--;
                }
                //case 1.2: left pointer end up at the end of the column
                if(leftPointer == columSize - this.gameStartDimenstion) {
                    // openSlots.push(leftPointer)
                    if(this.gameState.board[leftPointer]==0) {
                        this.gameState.board[toPut] = this.gameState.board[rightPointer]
                        if(toPut != rightPointer) {
                            this.gameState.board[rightPointer] = 0 // remove it from its orginal location
                            shift = true; //here shift occurs if righpointer and toput are different
                        }
                        toPut = toPut -1; 
                        break;
                    } else if(this.gameState.board[rightPointer]==this.gameState.board[leftPointer]){
                        this.gameState.board[toPut] = this.gameState.board[rightPointer] + this.gameState.board[leftPointer]
                        this.gameState.score = this.gameState.score +  this.gameState.board[toPut]
                        if(this.gameState.board[leftPointer] == 1024) {
                            this.gameState.won = true;
                            this.updateListeners(this.winListeners, this.gameState)
                        }
                        // console.log(`adding ${this.gameState.board[rightPointer] + this.gameState.board[leftPointer]} to score of ${this.gameState.score}`)
                        shift = true; // u shifted, at least, the leftPointer value
                        if(toPut != rightPointer ) {
                            this.gameState.board[rightPointer] = 0 // remove it from its orginal location
                        }
                        if(toPut != leftPointer) {
                            this.gameState.board[leftPointer] = 0 // remove it from its orginal location
                        }
                        break;
                    } else {
                        this.gameState.board[toPut] = this.gameState.board[rightPointer];
                        this.gameState.board[toPut-1] = this.gameState.board[leftPointer];
                        if(toPut != rightPointer && toPut-1 != rightPointer ) {
                            this.gameState.board[rightPointer] = 0 // remove it from its orginal location
                            shift = true; 
                        }
                        if(toPut-1 != leftPointer) {
                            this.gameState.board[leftPointer] = 0 // remove it from its orginal location
                            shift = true;
                        }
                        toPut = toPut - 2;
                        break;
                    }
                }
                //case 2.2 there are numbers before leftPointer
                //case 2.2.1 the values compared
                //don't break coz you're not done
                if(this.gameState.board[rightPointer]==this.gameState.board[leftPointer]) {
                    // openSlots.push(leftPointer);
                    this.gameState.board[toPut] = this.gameState.board[rightPointer]+ this.gameState.board[leftPointer];
                    this.gameState.score = this.gameState.score + this.gameState.board[toPut]
                    // console.log(`adding ${this.gameState.board[rightPointer]} and ${this.gameState.board[leftPointer]} to score of ${this.gameState.score}`)
                    if(this.gameState.board[leftPointer] == 1024) {
                        this.gameState.won = true;
                        this.updateListeners(this.winListeners, this.gameState)
                    }
                    shift = true;
                    if(toPut != rightPointer ) {
                        this.gameState.board[rightPointer] = 0 // remove it from its orginal location
                    }
                    if(toPut != leftPointer) {
                        this.gameState.board[leftPointer] = 0 // remove it from its orginal location
                    }
                    rightPointer = leftPointer;
                    toPut = toPut-1; //check if you need a check that toPut don't go beyond column

                } else {
                    this.gameState.board[toPut] = this.gameState.board[rightPointer];
                     //was opening slow, moved below
   
                    if(toPut != rightPointer ) {
                        this.gameState.board[rightPointer] = 0 // remove it from its orginal location
                        this.gameState.board[toPut - 1] = this.gameState.board[leftPointer];
                        shift = true;

                    } else {
                        this.gameState.board[toPut - 1] = this.gameState.board[leftPointer];
                        rightPointer = rightPointer - 1;
                        //do u need shift here? 
                    }
                    if(toPut-1 != leftPointer) {
                        this.gameState.board[leftPointer] = 0 // remove it from its orginal location
                        // openSlots.push(leftPointer);
                        shift = true;
                    }
                    // rightPointer = leftPointer; //when do you go to the next one vs. u shouldn't
                    toPut = rightPointer //check if you need a check that toPut don't go beyond column
                }
                //set righPointer to point to a column infront of leftPointer and 
                // repeat the top process with adjusted rightpointer
                
            }
            // console.log(`after doing columns ${columSize-this.gameStartDimenstion} to ${columSize}`)
            // this.toString();
            columSize = columSize + this.gameStartDimenstion;
        }
        if(shift) {
            this.generateRandomNumber();
        } 
    }
    /*
     ascii version of the game board
     [ ] [ ] [2] [4]
     [ ] [2] [ ] [4]
     [ ] [ ] [4] [8]
     [2] [4] [8] [16]
    */
    toString() {
        let str = ''
        let counter = 0;
        for(let dimension = 0; dimension < this.gameStartDimenstion; dimension++ ){
            for (let dimesion2=0; dimesion2<this.gameStartDimenstion; dimesion2++) {
                str = str + `[${this.gameState.board[counter]}]`
                counter++;
            }
            str = str+'\n'
        }
        console.log(str);
        // console.log(`[ ] [ ] [2] [4] \n[ ] [2] [ ] [4] \n[ ] [ ] [4] [8] \n[2] [4] [8] [16]`);
    }
    
    //   Takes a callback function as input and registers that function as 
    //   a listener to the move event. Every time a move is made, 
    //   the game should call all previously registered move callbacks, 
    //   passing in the game's current gameState as an argument to the function.
    onMove(fun) {
        if(this.moveListeners.includes(fun)) {

        } else {
            this.moveListeners.push(fun);
        }
    }
    // Takes a callback function as input and registers that function 
    // as a listener to the win event. When the player wins the game 
    // (by making a 2048 tile), the game should call all previously 
    // registered win callbacks, passing in the game's current gameState
    //  as an argument to the function.
    onWin(fun) {
        if(this.winListeners.includes(fun)) {

        } else {
            this.winListeners.push(fun);
        }
    }
    // Takes a callback function as input and registers that function as a listener
    //  to the move? event. When the game transitions into a state where no more valid
    //   moves can be made, the game should call all previously registered lose callbacks, 
    //   passing in the game's current gameState as an argument to the function.
    onLose(fun) {
        if(this.loseListeners.includes(fun)) {
        } else {
            this.loseListeners.push(fun);
        }
    }

    onRestart(fun) {
        if(this.restartListener.includes(fun)) {
        } else {
            this.restartListener.push(fun);
        }
    }
    //given the list of listeners to update and an event to update with
    // call each listener with the event provided
    updateListeners(listenersList, event) {
        listenersList.forEach((listener) => listener(event))
    }
      
    getGameState() {
        return this.gameState;
    }

    generateRandomNumber(){
        let arr = [];
        let chooseRandomSlot;
        let counter = 0; 
        while(counter < this.gameState.board.length ) {
            if(this.gameState.board[counter] == 0) {
                arr.push(counter)
            }
            counter++;
        }
        if(arr.length>0) {//means there's open slot in board
            chooseRandomSlot = Math.floor(Math.random()*(arr.length-1)); //get a num 0 to arryleng
            let percent = Math.floor(Math.random()*100)
            if(percent >= 10) {
                //add 2 to random openSlot
                this.gameState.board[arr[chooseRandomSlot]] = 2;
            } else {
                this.gameState.board[arr[chooseRandomSlot]] = 4;
            }
        }
        
        
    }

    transposeRight() {
        let boardTransposed = [];
        let counter = 0; 
        for(let k = 0; k < this.gameStartDimenstion; k++){
            for(let i = 1; i <= this.gameStartDimenstion; i++) {
                // console.log(`at ${counter} of bT put ${(this.gameStartDimenstion**2)-(i*this.gameStartDimenstion)+k} of bd`)
                boardTransposed[counter] = this.gameState.board[(this.gameStartDimenstion**2)-(i*this.gameStartDimenstion)+k]
                counter++;
            }
        }
        this.gameState.board = boardTransposed;
    }

    transposeLeft() {
        let leftTransposed = [];
        let counter = 0; 
        for(let k = this.gameStartDimenstion - 1; k >= 0 ; k--){
            for(let i = this.gameStartDimenstion; i >= 1 ; i--) {
                // console.log(`at ${counter} of lT put ${(this.gameStartDimenstion**2)-(i*this.gameStartDimenstion)+k} of bd`)
                leftTransposed[counter] = this.gameState.board[(this.gameStartDimenstion**2)-(i*this.gameStartDimenstion)+k]
                counter++;
            }
        }
        this.gameState.board = leftTransposed;
    }

    isGameOver() {
        //need to check for equality of each tile
        //case1. goint row by row
        let horizontal = this.gameState.board
        //case2. going column by column 
        this.transposeRight();
        let vertical = this.gameState.board
        console.log(`Transposed Right to check vertica: `)
        this.toString();
        //if match doesn't  happens game is over else update this.gameState.over to true
        if(this.checkAMatch(horizontal) || this.checkAMatch(vertical)) {
            //game is not over
            this.transposeLeft();
        } else {
            this.transposeLeft();
            this.gameState.over = true;
            this.updateListeners(this.loseListeners, this.gameState)
        }
    }

    checkAMatch(board) {
        let before = 0;
        let after = 1;                                              
        while(before <= (this.gameStartDimenstion**2)-2){
            console.log(`before is ${before} and after is ${after}`)
            if(board[before] == board[after]) {
                console.log(`in check math: ${board[before]} ${board[after]} of: match`)
                this.toString();
                return true;
            }
            if((after+1) % this.gameStartDimenstion == 0) {
                before = before + 2;
                after = after + 2;
            } else {
                before++
                after++; 
            }  
        }
        return false;
    }
        
}

// let MinesweeperModel = class {
//     constructor(width, height, bomb_count) {
//         this.width = width;
//         this.height = height;
//         this.bomb_count = bomb_count;

//         this.state = MinesweeperModel.State.INITIALIZED;

//         let bomb_flags = [];
//         for (let i=0; i<(width*height); i++) {
//             if (i < bomb_count) {
//                 bomb_flags.push(true);
//             } else {
//                 bomb_flags.push(false);
//             }
//         }
//         shuffle(bomb_flags);

//         this.minefield = [];
//         for (let row = 0; row < height; row++) {
//             let cellrow = [];
//             for (let col = 0; col < width; col++) {
//                 cellrow.push(new MinesweeperCell(this, row, col, bomb_flags.pop()));
//             }
//             this.minefield.push(cellrow);
//         }

//         this.listeners = [];
//     }

//     addListener(listener) {
//         let idx = this.listeners.findIndex((l) => l == listener);
//         if (idx == -1) {
//             this.listeners.push(listener);
//         }
//     }

//     removeListener(listener) {
//         let idx = this.listeners.findIndex((l) => l == listener);
//         if (idx != -1) {
//             this.listeners.splice(idx, 1);
//         }
//     }

//     updateListeners(event) {
//         this.listeners.forEach((l) => l(event));
//     }

//     start() {
//         if (this.state != MinesweeperModel.State.INITIALIZED) {
//             // Already started. Ignore.
//             return;
//         }

//         this.start_time = Date.now();
//         this.state = MinesweeperModel.State.IN_PROGRESS;

//         this.updateListeners({
//             game: this,
//             event: MinesweeperModel.Event.START
//         });
//     }

//     win() {
//         if (this.state != MinesweeperModel.State.IN_PROGRESS) {
//             return;
//         }

//         this.end_time = Date.now();
//         this.state = MinesweeperModel.State.WON;

//         this.updateListeners({
//             game: this,
//             event: MinesweeperModel.Event.WIN
//         });
//     }

//     lose() {
//         if (this.state != MinesweeperModel.State.IN_PROGRESS) {
//             return;
//         }

//         this.end_time = Date.now();
//         this.state = MinesweeperModel.State.LOST;

//         this.updateListeners({
//             game: this,
//             event: MinesweeperModel.Event.LOSE
//         });
//     }

//     elapsed() {
//         if (this.state == MinesweeperModel.State.INITIALIZED) {
//             return 0;
//         } else if (this.state == MinesweeperModel.State.IN_PROGRESS) {
//             return Date.now() - this.start_time;
//         } else {
//             return this.end_time - this.start_time;
//         }
//     }

//     gameStarted() {
//         return (this.state == MinesweeperModel.State.IN_PROGRESS);
//     }

//     gameOver() {
//         return ((this.state == MinesweeperModel.State.LOST) ||
//             (this.state == MinesweeperModel.State.WON));
//     }

//     forAllCells(f) {
//         this.minefield.forEach((cellrow) => {
//             cellrow.forEach((c) => f(c));
//         });
//     }

//     toString() {
//         let s = "";

//         s += "   ";
//         for (let c = 0; c<this.width; c++) {
//             if (c < 10) {
//                 s += " ";
//             } else {
//                 s += (Math.floor(c/10));
//             }
//         }
//         s += "\n";

//         s += "   ";
//         for (let c = 0; c<this.width; c++) {
//             s += (c%10);
//         }
//         s += "\n";

//         s += "   ";
//         for (let c = 0; c<this.width; c++) {
//             s += "-";
//         }
//         s += "\n";

//         for (let r = 0; r<this.height; r++) {
//             s += r.toString().padStart(2) + "|";
//             for (let c = 0; c<this.width; c++) {
//                 let cell = this.minefield[r][c];
//                 if (cell.state == MinesweeperCell.State.UNMARKED) {
//                     s += ".";
//                 } else if (cell.state == MinesweeperCell.State.MARKED) {
//                     s += "x";
//                 } else {
//                     // Must be revealed.
//                     if (cell.is_bomb) {
//                         s += "*";
//                     } else {
//                         let nbc = cell.neighborBombCount();
//                         s += (nbc == 0) ? " " : nbc;
//                     }
//                 }
//             }
//             s += "|\n";
//         }

//         s += "   " + "".padStart(this.width, "-");

//         return s;
//     }

// }

// MinesweeperModel.State = {
//     INITIALIZED: 0,
//     IN_PROGRESS: 1,
//     LOST:        2,
//     WON:         3
// };

// MinesweeperModel.Event = {
//     START: 0,
//     WIN:   1,
//     LOSE:  2,
// };

// let MinesweeperCell = class {
//     constructor(model, row, col, is_bomb) {
//         this.model = model;
//         this.row = row;
//         this.col = col;
//         this.is_bomb = is_bomb;
//         this.state = MinesweeperCell.State.UNMARKED;
//         this.listeners = [];
//     }

//     reveal() {
//         if (this.state == MinesweeperCell.State.UNMARKED) {
//             this.state = MinesweeperCell.State.REVEALED;
//             this.updateListeners(this);
//         }
//     }

//     mark() {
//         if (this.state == MinesweeperCell.State.UNMARKED) {
//             this.state = MinesweeperCell.State.MARKED;
//             this.updateListeners(this);
//         }
//     }

//     unmark() {
//         if (this.state == MinesweeperCell.State.MARKED) {
//             this.state = MinesweeperCell.State.UNMARKED;
//             this.updateListeners(this);
//         }
//     }

//     getNeighbors() {
//         if (this.neighbors === undefined) {
//             // First time I'm asked, generate the array of neighbors
//             // and cache the result.
//             this.neighbors = [];
//             for (let dr = -1; dr <= 1; dr++) {
//                 for (let dc = -1; dc <= 1; dc++) {
//                     if (dr != 0 || dc != 0) {
//                         let nrow = this.row + dr;
//                         let ncol = this.col + dc;
//                         if (nrow >= 0 && nrow < this.model.height &&
//                             ncol >= 0 && ncol < this.model.width) {
//                             this.neighbors.push(this.model.minefield[nrow][ncol]);
//                         }
//                     }
//                 }
//             }
//         }
//         return this.neighbors;
//     }

//     neighborBombCount() {
//         if (this.nbc === undefined) {
//             let count = 0;
//             this.getNeighbors().forEach((c) => {
//                 if (c.is_bomb) {
//                     count++;
//                 }
//             });
//             this.nbc = count;
//         }
//         return this.nbc;
//     }
//     addListener(listener) {
//         let idx = this.listeners.findIndex((l) => l == listener);
//         if (idx == -1) {
//             this.listeners.push(listener);
//         }
//     }

//     removeListener(listener) {
//         let idx = this.listeners.findIndex((l) => l == listener);
//         if (idx != -1) {
//             this.listeners.splice(idx, 1);
//         }
//     }

//     updateListeners(event) {
//         this.listeners.forEach((l) => l(event));
//     }

// }

// MinesweeperCell.State = {
//     UNMARKED: 0,
//     MARKED: 1,
//     REVEALED: 2
// }

// /*
// * Randomly shuffle an array
// * https://stackoverflow.com/a/2450976/1293256
// * @param  {Array} array The array to shuffle
// * @return {String}      The first item in the shuffled array
// */
// let shuffle = function (array) {

//     let currentIndex = array.length;
//     let temporaryValue, randomIndex;

//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;

//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;

// };

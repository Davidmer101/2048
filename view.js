

let view2048 = class {
 
    constructor(model) {
        this.model = model;
        this.listeners = [];
        this.haveLost = false;
        this.haveWon = false;
        this.afterLoseOrWon = false;
        this.try = 1;
        this.div = $(`<div> </div>`);
        this.div.append (`<button id = 'score'> Score ${this.model.gameState.score}`)
        this.griedContainer = $('<div class="grid-container"> </div>') 
        for (let r=0; r<this.model.gameStartDimenstion**2; r++) {
                this.griedContainer.append(cell_view(this.model, r));
        }
        this.div.append(this.griedContainer);
        
        document.getElementById('newGame').onclick = () => {
            this.updateListeners({code: 'Restart'})
        }
        // update listener
        document.onkeydown = (e) => {
            if(this.haveLost || this.haveWon) {
            } else {
                this.updateListeners(e)
            }
            
        }

        // get updates from model as a listener
        this.model.onMove((state) => {
            this.updateBoard();
        })

        this.model.onRestart((state) => {
            this.updateBoard();
            this.haveLost = false;
            this.haveWon = false;
            if(this.afterLoseOrWon) {
                this.afterLoseOrWon = false;
            }
     
        })

        this.model.onWin(() => {
            this.winView();
        })

        this.model.onLose(() => {
            this.loseView();
        })
    }

    updateBoard() {
        this.updateContainer = $('<div class="grid-container"> </div>') 
        for (let r=0; r<this.model.gameStartDimenstion**2; r++) {
                this.updateContainer.append(cell_view(this.model, r));
        }
        $( "div.grid-container" ).replaceWith(this.updateContainer);
        $("#score").replaceWith((`<button id = 'score'> Score ${this.model.gameState.score}`))
   
    }

    winView() {
        this.div.append(` Game ${this.try}: congrats! You Won!`)
        this.haveWon = true;
        this.afterLoseOrWon = true;
    }

    loseView() {
        this.div.append(`<div display = 'block' id= 'loseMessage'> <strong>Game ${this.try}: YOU LOST </strong></div>`)
        this.haveLost = true;
        this.afterLoseOrWon = true;
        this.try++;
    }

    addListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx == -1) {
            this.listeners.push(listener);
        }
    }

    removeListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx != -1) {
            this.listeners.splice(idx, 1);
        }
    }

    updateListeners(event) {
        this.listeners.forEach((l) => l(event));
    }
}

let cell_view = (game, num) => {

    switch (game.gameState.board[num]) {
        case 2:
            return $(`<div style="background-color: Bisque;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 4:
            return $(`<div style="background-color: #FAEBD7;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 8:    
            return $(`<div style="background-color: Coral;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 16:
            return $(`<div style="background-color: Crimson;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 32:
            return $(`<div style="background-color: Chocolate;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 64: 
            return $(`<div style="background-color: Khaki;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 128:  
            return $(`<div style="background-color: Yellow;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 256:
            return $(`<div style="background-color: Gold;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 512:
            return $(`<div style="background-color: LightGreen;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 1024:
            return $(`<div style="background-color: GreenYellow;" id = ${num}> ${game.gameState.board[num]} </div>`);
        case 2048:
            return $(`<div style="background-color: Green;" id = ${num}> ${game.gameState.board[num]} </div>`);
        default:
            return $(`<div style = "Bisque";id = ${num}> ${game.gameState.board[num]} </div>`)
    }
    
}


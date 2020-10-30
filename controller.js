class controller2048 {
    constructor (model, view) {
        this.model = model;
        this.view = view;

        view.addListener((event) => {
            if(event.code === "Restart") {
                this.model.setupNewGame();
            } else if (event.code  === 'ArrowRight') {
                this.model.move('right')
            } else if (event.code === 'ArrowLeft') {
                this.model.move('left')
            } else if (event.code === 'ArrowUp') {
                this.model.move('up')
            } else if (event.code === 'ArrowDown') {
                this.model.move('down')
            }
        })
        
    }
}

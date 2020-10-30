

let model = null;
let controller = null;
let view = null;
let started = false;

window.onload = event => {
    model = new Game(4);
    view = new view2048(model);
    controller = new controller2048(model, view);
    $('body').append(view.div);
}
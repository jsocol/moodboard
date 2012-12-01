var imgRegex = /\.(jpg|gif|png)$/i;

function p(e) {
    e.preventDefault();
}

function dragStart(e) {
    p(e);
}

function dragEnter(e) {
    p(e);
    msg.style.display = 'block';
}

function dragDrop(e) {
    p(e);
    msg.style.display = 'none';

    var x = e.pageX;
    var y = e.pageY;
    var dropped = document.createElement('div');
    dropped.style.left = x + 'px';
    dropped.style.top = y + 'px';
    var text = e.dataTransfer.getData('text/plain');
    if (imgRegex.test(text)) {
        var img = new Image();
        img.src = text;
        img.addEventListener('load', function() {
            dropped.style.height = this.height + 'px';
            dropped.style.width = this.width + 'px';
            console.log(this, dropped);
        }, false);
        dropped.appendChild(img);
    }
    else {
        dropped.textContent = text;
    }
    board.appendChild(dropped);
}

function dragEnd(e) {
    p(e);
    msg.style.display = 'none';
}

function $(sel) {
    return document.querySelectorAll(sel);
}

var board = $('#board')[0];

board.addEventListener('dragstart', dragStart, false);
board.addEventListener('dragenter', dragEnter, false);
board.addEventListener('dragover', p, false);
board.addEventListener('drop', dragDrop, false);

var msg = $('#dropMessage')[0];

var x = board.offsetWidth / 2 - msg.offsetWidth / 2;
var y = board.offsetHeight / 2 - msg.offsetHeight / 2;
msg.style.left = x + 'px';
msg.style.top = y + 'px';

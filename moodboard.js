var imgRegex = /\.(jpg|gif|png)$/i;

function p(e) {
    e.preventDefault();
}

var dragCurrent = false;
var selected = false;
var pins = [];

function dragStart(e) {
    p(e);
    var obj = e.target;
    while(obj.parentNode && obj.nodeName.toLowerCase() != 'div') {
        obj = obj.parentNode;
    }
    dragCurrent = obj;
    var offset = {'x': e.layerX, 'y': e.layerY};
    dragCurrent.offset = offset;
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
    var dt = e.dataTransfer;
    dropped.style.left = x + 'px';
    dropped.style.top = y + 'px';
    dropped.draggable = true;
    var text = dt.getData('text/plain');
    if (imgRegex.test(text)) {
        var img = new Image();
        img.src = text;
        img.addEventListener('load', function() {
            dropped.style.height = this.height + 'px';
            dropped.style.width = this.width + 'px';
        }, false);
        dropped.appendChild(img);
    }
    else if (dt.files.length) {
        for (var i = 0; i < dt.files.length; i++) {
            var f = dt.files[i];
            if (!f.type.match(/image.*/)) {
                continue;
            }
            var img = new Image();
            img.file = f;
            dropped.appendChild(img);
            var reader = new FileReader();
            reader.onload = (function(aImg) {
                return function(e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(f);
        }
    }
    else {
        dropped.textContent = text;
    }
    board.appendChild(dropped);
    dropped.style.zIndex = pins.length;
    pins.push(dropped);
}

function mouseDown(e) {
    var obj = e.target;
    if (selected) {
        selected.classList.remove('selected');
        selected = false;
    }
    while(obj.parentNode && obj.nodeName.toLowerCase() != 'div')
        obj = obj.parentNode;
    if (obj.nodeName.toLowerCase() != 'div' && selected) {
        selected.classList.remove('selected');
        selected = false;
        return;
    }
    if (obj.nodeName.toLowerCase() != 'div') return;
    selected = obj;
    selected.classList.add('selected');
    var idx = pins.indexOf(selected);
    pins.splice(idx, 1);
    pins.push(selected);
    pins.forEach(function(el, i) {
        el.style.zIndex = i;
    });
}

function mouseMove(e) {
    p(e);
    if (!dragCurrent) return;
    var s = {
        'x': e.pageX - dragCurrent.offset.x,
        'y': e.pageY - dragCurrent.offset.y
    };
    dragCurrent.style.left = s.x + 'px';
    dragCurrent.style.top = s.y + 'px';
}

function mouseUp(e) {
    if (dragCurrent)
        dragCurrent = false;
}

function dragEnd(e) {
    p(e);
    msg.style.display = 'none';
    dragCurrent = false;
}

function keyDown(e) {
    var LEFT = 37,
        RIGHT = 39,
        DELETE = 46;
    if (!selected) return;
    var k = e.keyCode;
    if (selected.rotate == undefined)
        selected.rotate = 0;
    var handled = true;
    switch(k) {
        case LEFT:
            selected.rotate--;
            break;
        case RIGHT:
            selected.rotate++;
            break;
        case DELETE:
            selected.parentNode.removeChild(selected);
            selected = false;
            break;
        default:
            handled = false;
    }
    if (handled)
        p(e);
    if (selected)
        selected.style.transform = 'rotate(' + selected.rotate + 'deg)';
}

function $(sel) {
    return document.querySelectorAll(sel);
}

var board = $('#board')[0];

board.addEventListener('dragstart', dragStart, false);
board.addEventListener('dragenter', dragEnter, false);
board.addEventListener('dragover', p, false);
board.addEventListener('drop', dragDrop, false);
board.addEventListener('mousedown', mouseDown, false);
board.addEventListener('mousemove', mouseMove, false);
board.addEventListener('mouseup', mouseUp, false);
window.addEventListener('keydown', keyDown, false);

var msg = $('#dropMessage')[0];

var x = board.offsetWidth / 2 - msg.offsetWidth / 2;
var y = board.offsetHeight / 2 - msg.offsetHeight / 2;
msg.style.left = x + 'px';
msg.style.top = y + 'px';

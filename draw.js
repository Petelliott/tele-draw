
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [
        evt.clientX - rect.left,
        evt.clientY - rect.top
    ];
}


function make_drawable(canvas, socket) {
    var ctx = canvas.getContext('2d');

    var isdown = false;
    var last;

    canvas.addEventListener("mousedown", function(e) {
        last = getMousePos(canvas, e);
        isdown = true;
    });

    canvas.addEventListener("mouseup", function(e) {
        socket.send("-");
        isdown = false;
    });

    canvas.addEventListener("mousemove", function(e) {
        if (isdown) {
            var current = getMousePos(canvas, e);

            socket.send(current[0]+"|"+current[1]);

            ctx.beginPath();
            ctx.moveTo(...last);
            ctx.lineTo(...current);
            ctx.stroke();

            last = current;
        }
    });
}

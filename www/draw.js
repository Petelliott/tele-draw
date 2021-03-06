var colour = "000000";

function changeColour(jscolor){
  colour = ''+jscolor;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    if(evt.touches) {
        var touch = evt.touches[0]; // Get the information for finger #1
        return [
            touch.pageX - rect.left,
            touch.pageY - rect.top
        ];
    } else {
        return [
            evt.clientX - rect.left,
            evt.clientY - rect.top
        ];
    }
}


function make_drawable(canvas, socket) {
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    var isdown = false;
    var last;

    socket.onmessage = function() {};

    function start(e) {
        last = getMousePos(canvas, e);
        ctx.strokeStyle = '#'+colour;
        ctx.lineWidth=document.getElementById("size").value;

        socket.send(last[0]+"|"+last[1]+"#"+colour+"#"+document.getElementById("size").value);
        isdown = true;
    }
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("touchstart", start);

    function end(e) {
        socket.send("-");
        isdown = false;
    }
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("touchend", end);

    function draw(e) {
        if (e.touches) {
            e.preventDefault();
        }
        if (isdown) {
            var current = getMousePos(canvas, e);
            ctx.strokeStyle = '#'+colour;
            ctx.lineWidth=document.getElementById("size").value;

            socket.send(current[0]+"|"+current[1]+"#"+colour+"#"+document.getElementById("size").value);

            ctx.beginPath();
            ctx.moveTo(...last);
            ctx.lineTo(...current);
            ctx.stroke();

            last = current;
        }
    }
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", draw);
}

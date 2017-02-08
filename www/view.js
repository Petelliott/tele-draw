function parse_in(str) {
    let nums = str.split('|');
    return [parseInt(nums[0]), parseInt(nums[1])];
}


function read_drawing(canvas, socket) {
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    var new_line = true;
    var last;

    socket.onmessage = function(evt) {
        if (evt.data == '-') {
            new_line = true;
        } else if (new_line) {
            ctx.strokeStyle = '#' + evt.data.split('#')[1];
            ctx.lineWidth = evt.data.split('#')[2];

            last = parse_in(evt.data.split('#')[0]);
            new_line = false;
        } else {
            ctx.strokeStyle = '#' + evt.data.split('#')[1]
            current = parse_in(evt.data.split('#')[0]);

            ctx.beginPath();
            ctx.moveTo(...last);
            ctx.lineTo(...current);
            ctx.stroke();

            last = current;
        }
    };
}

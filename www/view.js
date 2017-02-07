function parse_in(str) {
    let nums = str.split('|');
    return [parseInt(nums[0]), parseInt(nums[1])];
}


function read_drawing(canvas, socket) {
    var ctx = canvas.getContext('2d');

    var new_line = true;
    var last;

    socket.onmessage = function(evt) {
        if (evt.data == '-') {
            new_line = true;
        } else if (new_line) {
            last = parse_in(evt.data);
            new_line = false
        } else {
            current = parse_in(evt.data);

            ctx.beginPath();
            ctx.moveTo(...last);
            ctx.lineTo(...current);
            ctx.stroke();

            last = current;
        }
    };
}

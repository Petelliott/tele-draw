
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [
        evt.clientX - rect.left,
        evt.clientY - rect.top
    ];
}


function Drawable(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.data = [];

    (function(object) {
        var isdown = false;

        canvas.addEventListener("mousedown", function(e) {
            object.data.push([getMousePos(object.canvas, e)]);
            isdown = true;
        });

        canvas.addEventListener("mouseup", function(e) {
            isdown = false;
        });

        canvas.addEventListener("mousemove", function(e) {
            if (isdown) {
                var open_line = object.data[object.data.length - 1];

                var start = open_line[open_line.length - 1];
                var end = getMousePos(object.canvas, e);

                object.ctx.beginPath();
                object.ctx.moveTo(...start);
                object.ctx.lineTo(...end);
                object.ctx.stroke();

                open_line.push(end);
            }
        });

    })(this);

}

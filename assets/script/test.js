let context = document.querySelector("canvas").getContext("2d");

let render = function () {
    context.canvas.width = document.documentElement.clientWidth * 1.0;
    context.canvas.height = document.documentElement.clientHeight * 1.0;

    context.fillStyle = "orange";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);  
};

window.addEventListener("resize", render);
render();
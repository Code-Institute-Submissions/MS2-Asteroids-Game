let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//c variable stands for context
let c = canvas.getContext('2d');

c.fillRect(100, 100, 100, 100)
c.fillRect(10, 10, 10, 100)
c.fillRect(100, 300, 100, 100)
c.fillRect(800, 100, 100, 500)
c.fillRect(100, 900, 400, 100)

console.log(canvas);
let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//c variable stands for context
let c = canvas.getContext('2d');

c.fillStyle = 'rgba(255, 0, 0, .4)';
c.fillRect(100, 100, 100, 100);
c.fillStyle = 'rgba(255, 0, 255, .4)';
c.fillRect(400, 20, 100, 100);
c.fillStyle = 'rgba(0, 255, 0, .4)';
c.fillRect(100, 300, 100, 100);
c.fillRect(800, 100, 100, 500);

//Draw a line
c.beginPath();
c.moveTo(50, 300);
c.lineTo(300, 100);
c.lineTo(400, 300);
c.strokeStyle = 'red';
c.stroke();

c.beginPath();
c.moveTo(100, 300);
c.lineTo(300, 100);
c.lineTo(100, 50);
c.strokeStyle = 'black';
c.stroke();

c.beginPath();
c.moveTo(500, 50);
c.lineTo(40, 100);
c.lineTo(100, 100);
c.strokeStyle = 'orange';
c.stroke();

//Draw a circle
/*c.beginPath();
c.arc(300, 300, 30, 0, Math.PI * 2, false);
c.strokeStyle = 'blue'
c.stroke();*/

for (let i = 0; i < 5; i++) {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    c.beginPath();
    c.arc(x, y, 30, 0, Math.PI * 2, false);
    c.strokeStyle = 'blue'
    c.stroke();
}

console.log(canvas);
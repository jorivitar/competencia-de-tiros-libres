let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

const obtenerEnteroAleatorio = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const img = new Image();
img.src = 'player.png';

const img_enemigo = new Image();
img_enemigo.src = 'enemigo.png';

const img_porteria = new Image();
img_porteria.src = 'porteria.png';

let x = 0;
let y = 400;
let porteria_y = 400
let bola_x = x + 100
let bola_y = y + 50;
let barrera_y = 0
let barrera_x = 1500
let lugar_random = obtenerEnteroAleatorio(2,14) * 50
const ancho = 50;
const alto = 100;
const movimiento = 50;
let tirando = false
let goles = 0
var window_height = window.innerHeight
var window_width = window.innerWidth

canvas.width = window_width
canvas.height = window_height

let mostrar_gool = false
let tiempo_porteria = 0
let tiempo_barrera = 0
let ultimo_tiempo = 0

function actualizar(dt) {
  tiempo_porteria += dt
  tiempo_barrera += dt

  if (tirando == false){
    bola_x = x + 100
    bola_y = y + 50;
  }

  if(tirando){
    bola_x += 15
  }

  if(bola_x + 30 >= barrera_x && bola_x - 30 <= barrera_x + ancho && bola_y + 30 >= barrera_y - 100 && bola_y - 30 <= barrera_y + 200){
    tirando = false
  }

  if(bola_x >= canvas.width){
    tirando = false
    if((porteria_y + 50) == bola_y){
        lugar_random = obtenerEnteroAleatorio(2,14) * 50
        goles += 1
        mostrar_gool = true
    }
  }

  if(tiempo_porteria >= 500){
    tiempo_porteria = 0
    porteria_y -= 50
    if(porteria_y == 0){
        porteria_y = 900
    }
  }

  if(tiempo_barrera >= 100){
    tiempo_barrera = 0
    if (barrera_y != lugar_random){
     barrera_y = barrera_y + movimiento
    }
    if (barrera_y >= 850){
        barrera_y = 0
    }
  }
}

function redibujar(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  ctx.font = '100px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(goles , 900, 100);

  ctx.arc(bola_x, bola_y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.drawImage(img, x, y, ancho, alto);

  ctx.drawImage(img_enemigo, barrera_x, barrera_y, ancho, alto);
  ctx.drawImage(img_enemigo, barrera_x, barrera_y + 100, ancho, alto);
  ctx.drawImage(img_enemigo, barrera_x, barrera_y - 100, ancho, alto);

  ctx.fillStyle = '#ffffff';
  ctx.drawImage(img_porteria, 1870, porteria_y, ancho, alto);

  if(mostrar_gool){
    ctx.font = '100px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText("goool" , 900, 300);
    mostrar_gool = false
  }
}

function gameLoop(tiempo) {
  if (ultimo_tiempo === 0) ultimo_tiempo = tiempo
  let dt = tiempo - ultimo_tiempo
  ultimo_tiempo = tiempo

  actualizar(dt)
  redibujar()
  requestAnimationFrame(gameLoop)
}

function rota_no(){
    ctx.rotate(10 * Math.PI / 180);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function(){
      requestAnimationFrame(gameLoop)
  });
} else {
  requestAnimationFrame(gameLoop)
}

window.addEventListener('keydown', function(evento) {
    if (evento.key === 'ArrowUp') {
        y -= movimiento
        if (y < 0) y = 0;
    }
});

window.addEventListener('keydown', function(evento) {
    if (evento.key === 'ArrowDown') {
        y += movimiento
        if (y + alto > 900) {
            y = 900 - alto;
        }
    }
});

window.addEventListener('keyup', function(evento) {
    if (evento.key === ' ') {
        if(tirando == false){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.rotate(-10 * Math.PI / 180);
       setTimeout(rota_no,100)
        }
        tirando = true
    }
});

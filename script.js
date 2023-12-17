const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0; // puntuacion a 0
const brickRowCount = 9; // recuento de filas
const brickColumnCount = 5; // recuento de columnas
const delay = 500; //delay del reinicio de juego en 0.5s, tiempo en milisegundos

// Creamos Propiedades de Pelota
const ball = 
{
  x: canvas.width / 2,
  y: canvas.height / 2,
  // declaramos la posición en la que aparecera 
  size: 10,
  speed: 4,
  // declaramos el tamaño y velocidad de movimiento en pixeles 
  dx: 4,
  dy: -4,
  // declaramos la velocidad en horizontal y vertical en pixeles
  visible: true
};

// Creamos Propiedades de Paleta
const paddle = 
{
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  // declaramos la posición en la que aparecera
  w: 80,
  h: 10,
  // declaramos el tamaño en pixeles 
  speed: 8,
  dx: 0,
  // declaramos la velocidad en horizontal y el movimiento en pixeles
  visible: true
};

// Creamos Propiedades Ladrillos
const brickInfo = 
{
  w: 70,
  h: 20,
  // declaramos el tamaño en pixeles 
  padding: 10,
  // declaramos el espacio entre ladrillos
  offsetX: 45,
  offsetY: 60,
  // declaramos el posicionamiento del ladrillo dentro del cuadro
  visible: true
};

// Create Ladrillos
const bricks = [];
// declaramos una matriz o un arreglo para los ladrillos
for (let i = 0; i < brickRowCount; i++) 
{
  bricks[i] = [];
  // creamos un ciclo validando las filas de brickRowCount y guardamos en un arreglo vacio la fila del ladrillo
  for (let j = 0; j < brickColumnCount; j++) 
  {
    // creamos un ciclo validando las columnas de brickColumnCount 
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    // se calcula la posicion x - y (horizontal - vertical) dentro del plano
    // en x se multiplica el indece i de la fila por el ancho mas el espaciado del ladrillo y luego sumamos el desplazamiento horizontal
    // en x se multiplica el indece j de la columna por el alto mas el espaciado del ladrillo y luego sumamos el desplazamiento vertical
    bricks[i][j] = { x, y, ...brickInfo };
    // se crea el objeto que se agrega al arreglo en i y j con las coordenas x, y con las propiedades en brickInfo
  }
}

// Dibujamos la Pelota en el Canvas
function drawBall() 
{
  ctx.beginPath(); // creamos un nuevo trazo 
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); 
  // dibujamos un arco con las propiedades de ball (posicion, tamaño) y la creacion del angulo inicial en 0 y final 2π
  ctx.fillStyle = ball.visible ? '#fff' : 'transparent';
  // seteamos estilos, si visible es true, color blanco, si es false sera transparente
  ctx.fill(); // aplicamos los estilos
  ctx.closePath(); // cierra el trazo creado
}

// Dibujamos la Paleta en el Canvas
function drawPaddle() 
{
  ctx.beginPath(); // creamos un nuevo trazo 
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h); 
  // dibujamos un rectangulo con las propiedades de paddle (posicion, tamaño)
  ctx.fillStyle = paddle.visible ? '#e67e22' : 'transparent';
  // seteamos estilos, si visible es true, color azul, si es false sera transparente
  ctx.fill(); // aplicamos los estilos
  ctx.closePath(); // cierra el trazo creado
}

// Dibujamos la Puntuacion en el Canvas
function drawScore() 
{
  ctx.font = '20px Arial'; // Establecemos funte y tamaño
  ctx.fillText(`Punteo: ${score}`, canvas.width - 100, 30);
  // Seteamos los parametros Punteo: ${score} - 0, la posicion en horizontal y vertical 
}

// Dibujamos los ladrillos en el Canvas
function drawBricks() 
{
  bricks.forEach(column => {
    column.forEach(brick => {
      // creamos un ciclo de las columnas de ladrillos
      ctx.beginPath(); // creamos un nuevo trazo
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      // dibujamos los rectangulos con las propiedades de brick (posicionamiento y tamaño)
      ctx.fillStyle = brick.visible ? '#e67e22' : 'transparent';
      // seteamos estilos, si visible es true, color azul, si es false sera transparente 
      ctx.fill(); // aplicamos los estilos
      ctx.closePath(); // cierra el trazo creado
    });
  });
}

// Movemos Paleta en el Canva
function movePaddle() 
{
  paddle.x += paddle.dx;
  // incrementa la posicion en x con la velocidad de dx

  if (paddle.x + paddle.w > canvas.width) 
  // declaramos una condicional verificando si el borde de la paleta a superado el borde del Canva
  {
    paddle.x = canvas.width - paddle.w;
    // mantenemos la paleta dentro de los limites del canvas alineando con el borde derecho del lienzo
  } 

  if (paddle.x < 0) 
  // declaramos una condicional verificando el borde izquierdo de la paleta no supere el del Canva
  {
    paddle.x = 0;
    // si la paleta a superado el borde establecemos la posicion en 0
  }
}

// Mover Pelota en el Canvas
function moveBall() 
{
  ball.x += ball.dx;
  ball.y += ball.dy;
  // incrementamos las cordenadas x - y para el movimiento de la pelota en el Canva

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0)
  // Verificamos si la pelota a chocado con la pared de lado izquierdo o derecho
  {
    ball.dx *= -1;
    // si choca invertimos la direccion 
  }

  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0)
  // Verificamos si la pelota a chocado con la pared de arriba o de abajo
  {
    ball.dy *= -1;
    // si choca invertimos la direccion
  }  
  
  if(ball.y + ball.size > canvas.height - 0){

    alert("Perdiste, Fin del Juego");//alerta de fin del juego
  }

  // Choque con Paleta
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) 
  // verificamos si la pelota a chocado con la paleta, comparando sus coordenadas.
  {
    ball.dy = -ball.speed;
    // si la pelota choca con la parte superior de la paleta se invierte su direccion vertical.
  }

  // Choque con Ladrillos
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) 
      {
        if (
          ball.x - ball.size > brick.x && // verificación del lado izquierdo del ladrillo
          ball.x + ball.size < brick.x + brick.w && // verificación del lado derecho del ladrillo
          ball.y + ball.size > brick.y && // verificacion lateral del ladrillo superior
          ball.y - ball.size < brick.y + brick.h // verificacion lateral del ladrillo inferior
        ) 
        {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
          // verificamos el choque de la pelota con algun ladrillo
          // si choca con un ladrillo invierte la direcion de la pelota y ocultamos el ladrillo
          // incrementamos la puntuacion en increaseScore()
        }
      }
    });
  });

  // Fin del juego - Reinicio
  if (ball.y + ball.size > canvas.height) 
  // verificamos la posicion vertical de la pelota si a superado el lienzo
  {
    showAllBricks();
    score = 0;
    // si se cumple, vuelve a mostrar todos los ladrillos y la puntuacion a 0
  }
}

// Puntuacion
function increaseScore() {
  score++;
  // sumamos 1 a la puntuacion en cada ejecucion

  if (score % (brickRowCount * brickColumnCount) === 0) 
  // verificamos si la puntuacion actual es multiplo del numero total de ladrillos
  {
      ball.visible = false;
      paddle.visible = false;
      // si se destruyen todos los ladrillos ocultamos la pelota y la paleta

      alert("Ganaste, Felicidades!"); // Mensaje de que gano el juego

      setTimeout(function () 
      {
          showAllBricks(); // restauramos los ladrillos
          score = 0; // puntuacion a 0
          paddle.x = canvas.width / 2 - 40;
          paddle.y = canvas.height - 20;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
          // regresamos la paleta y pelota a posicion inicial
          ball.visible = true;
          paddle.visible = true;
          // mostramos la pelota y la paleta
      },delay)
      // reiniciamos todo despues de cumplir el delay
  }
}

// Mostrar ladrillos
function showAllBricks() 
{
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
  // la funcion muestra todos los ladrillos del juego validando cada ladrillo en su columna de la matriz bricks

  
}

// Dibujamos todo
function draw() 
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // reiniciamos el trazo del canva y limpiamos las coordenadas a 0

  drawBall(); // dibujamos Pelota
  drawPaddle(); // dibujamos Paleta
  drawScore(); // dibujamos Puntuacion
  drawBricks(); // dibujamos Ladrillos
}

// Actualizamos dibujo y animacion del lienzo
function update() 
{
  movePaddle(); // Movemos Paleta
  moveBall(); // Movemos Pelota
  draw(); // Dibujamos Todo

  requestAnimationFrame(update);
  // este es un metodo que le dice al navegador que haremos una animacion y que llame a la funcion update para actualizar la animacion.
}

update();

// Pulsacion de tecla (KeyDown)
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') 
  // verificamos que la tecla pulsada sea 'derecha' o 'flecha derecha'
  {
    paddle.dx = paddle.speed;
    // si es asi movemos la paleta cumpliendo las propiedades de direccion (derecha) y velocidad
  } 
  else if (e.key === 'Left' || e.key === 'ArrowLeft') 
  {
    // verificamos que la tecla pulsada sea 'izquierda' o 'flecha izquierda'
    paddle.dx = -paddle.speed;
    // si es asi movemos la paleta cumpliendo las propiedades de direccion (izquierda) y velocidad
  }
}

// Tecla Arriba (KeyUp)
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) 
  // verificamos cual de las teclas izquierda o derecha fue soltada
  {
    paddle.dx = 0;
    // si es soltada la tecla, la velocidad de la paleta sera 0
  }
}

document.addEventListener('keydown', keyDown); // escucha el evento KeyDown
document.addEventListener('keyup', keyUp); // escucha el evento KeyUp

rulesBtn.addEventListener('click', () => rules.classList.add('show')); // Mostramos el panel de reglas
closeBtn.addEventListener('click', () => rules.classList.remove('show')); // Ocultamos el panel de reglas
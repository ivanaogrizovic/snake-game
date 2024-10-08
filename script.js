let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scoreIs = document.getElementById('score');
let hiScoreIs = document.getElementById('hiScore');
let direction = '';
let directionQueue = '';
let fps = 70;
let snake = [];
let snakeLength = 5;
let cellSize = 20;
let snakeColor = '#5c5f82';
let foodColor = '#d9726b';
let foodX = [];
let foodY = [];
let food = {
    x: 0,
    y: 0
};
let score = 0;
let highScore = 0;
let hasStarted = false;
let stopSnake = false;

for (i = 0; i <= canvas.width - cellSize; i += cellSize) {
    foodX.push(i);
    foodY.push(i);
}

canvas.setAttribute('tabindex', 1);
canvas.style.outline = 'none';
canvas.focus();

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
}

function createFood() {
    food.x = foodX[Math.floor(Math.random() * foodX.length)];
    food.y = foodY[Math.floor(Math.random() * foodY.length)];

    for (i = 0; i < snake.length; i++) {
        if (checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
            createFood();
        }
    }
}

function drawFood() {
    drawSquare(food.x, food.y, foodColor);
}

function setBackground(color1, color2) {
    ctx.fillStyle = color1;
    ctx.strokeStyle = color2;

    ctx.fillRect(0, 0, canvas.height, canvas.width);

    for (let x = 0.5; x < canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0.5; y < canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke()
}

function createSnake() {
    snake = [];
    for (let i = snakeLength; i > 0; i--) {
        k = i * cellSize;
        snake.push({ x: k, y: 0 });
    }
}

function drawSnake() {
    for (i = 0; i < snake.length; i++) {
        drawSquare(snake[i].x, snake[i].y, snakeColor);
    }
}

function changeDirection(keycode) {
    if (keycode == 65 && direction != 'right') { directionQueue = 'left'; }
    else if (keycode == 87 && direction != 'down') { directionQueue = 'up'; }
    else if (keycode == 68 && direction != 'left') { directionQueue = 'right'; }
    else if (keycode == 83 && direction != 'up') { directionQueue = 'down' }
}

function moveSnake() {
    if(!stopSnake) {let x = snake[0].x;
    let y = snake[0].y;

    direction = directionQueue;

    if (direction == 'right') {
        x += cellSize;
    }
    else if (direction == 'left') {
        x -= cellSize;
    }
    else if (direction == 'up') {
        y -= cellSize;
    }
    else if (direction == 'down') {
        y += cellSize;
    }
    let tail = snake.pop();
    tail.x = x;
    tail.y = y;
    snake.unshift(tail);}
}

function checkCollision(x1, y1, x2, y2) {
    if (x1 == x2 && y1 == y2) {
        return true;
    }
    else {
        return false;
    }
}

function game() {
    let head = snake[0];

    if (head.x < 0 || head.x > canvas.width - cellSize || head.y < 0 || head.y > canvas.height - cellSize) {
        openModal();
    }
    for (i = 1; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            openModal();
        }
    }
    if (checkCollision(head.x, head.y, food.x, food.y)) {
        snake[snake.length] = { x: head.x, y: head.y };
        createFood();
        drawFood();
        score += 10;
    }
    window.onkeydown = function (evt) {
        evt = evt || window.event;
        changeDirection(evt.keyCode);
    };

    ctx.beginPath();
    setBackground('#efb8cc', '#eaecf1');
    scoreIs.innerHTML = score;
    drawSnake();
    drawFood();
    moveSnake();
}

function newGame() {
    canvas.style.border = "10px solid white";
    direction = 'right';
    directionQueue = 'right';
    ctx.beginPath();
    createSnake();
    createFood();

    if (typeof loop != 'undefined') {
        clearInterval(loop);
    }
    else {
        loop = setInterval(game, fps);
    }
}

function reset() {
    stopSnake = false;
    checkScore(score);
    setBackground();
    createSnake();
    drawSnake();
    createFood();
    drawFood();
    directionQueue = 'right';
    score = 0;
    game();
}

function checkScore(newScore) {
    if (newScore > highScore) {
        highScore = newScore;
        hiScoreIs.innerHTML = highScore;
    } else {
        return;
    }
}

const modalStart = document.querySelector('.modal-start');
const modalEnd = document.querySelector('.modal-end');
const overlay = document.querySelector('.snake-overlay');

const openModal = function () {
    modalEnd.classList.remove('hidden');
    overlay.classList.remove('hidden');
    stopSnake = true;
};

const closeModal = function (modal) {
    if (modal === "start") {
        modalStart.classList.add('hidden');
        overlay.classList.add('hidden');
    } else {
        modalEnd.classList.add('hidden');
        overlay.classList.add('hidden');
        reset();
    }
};

document.addEventListener('keydown', function (keypressed) {
    if (keypressed.key === 'Enter' && !modalStart.classList.contains('hidden')) {
        closeModal("start");
        newGame();
    }
    else if (keypressed.key === 'Enter' && !modalEnd.classList.contains('hidden')) {
        closeModal("end");
    }
});
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scoreIs = document.getElementById('score');
var direction = '';
var directionQueue = '';
var fps = 70;
var snake = [];
var snakeLength = 5;
var cellSize = 20;
var snakeColor = '#5c5f82';
var foodColor = '#d9726b';
var foodX = [];
var foodY = [];
var food = {
    x: 0,
    y: 0
};
var score = 0;

// pushes possible x and y positions to seperate arrays
for (i = 0; i <= canvas.width - cellSize; i += cellSize) {
    foodX.push(i);
    foodY.push(i);
}
// makes canvas interactive upon load
canvas.setAttribute('tabindex', 1);
canvas.style.outline = 'none';
canvas.focus();
// draws a square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
}
// giving the food object its coordinates
function createFood() {
    food.x = foodX[Math.floor(Math.random() * foodX.length)]; // random x position from array
    food.y = foodY[Math.floor(Math.random() * foodY.length)]; // random y position from array
    // looping through the snake and checking if there is a collision
    for (i = 0; i < snake.length; i++) {
        if (checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
            createFood();
        }
    }
}
// drawing food on the canvas
function drawFood() {
    drawSquare(food.x, food.y, foodColor);
}
// setting the colors for the canvas. color1 - the background, color2 - the line color
function setBackground(color1, color2) {
    ctx.fillStyle = color1;
    ctx.strokeStyle = color2;

    ctx.fillRect(0, 0, canvas.height, canvas.width);

    for (var x = 0.5; x < canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (var y = 0.5; y < canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke()
}
// creating the snake and pushing coordinates to the array
function createSnake() {
    snake = [];
    for (var i = snakeLength; i > 0; i--) {
        k = i * cellSize;
        snake.push({ x: k, y: 0 });
    }
}
// loops through the snake array and draws each element
function drawSnake() {
    for (i = 0; i < snake.length; i++) {
        drawSquare(snake[i].x, snake[i].y, snakeColor);
    }
}
// keyboard interactions | direction != '...' doesn't let the snake go backwards
function changeDirection(keycode) {
    if (keycode == 37 && direction != 'right') { directionQueue = 'left'; }
    else if (keycode == 38 && direction != 'down') { directionQueue = 'up'; }
    else if (keycode == 39 && direction != 'left') { directionQueue = 'right'; }
    else if (keycode == 40 && direction != 'top') { directionQueue = 'down' }
}
// changing the snake's movement
function moveSnake() {
    var x = snake[0].x; // getting the head coordinates...hhehehe... getting head..
    // anyway... read on...
    var y = snake[0].y;

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
    // removes the tail and makes it the new head...very delicate, don't touch this
    var tail = snake.pop();
    tail.x = x;
    tail.y = y;
    snake.unshift(tail);
}
// checks if too coordinates match up
function checkCollision(x1, y1, x2, y2) {
    if (x1 == x2 && y1 == y2) {
        return true;
    }
    else {
        return false;
    }
}
// main game loop
function game() {
    var head = snake[0];
    // checking for wall collisions
    if (head.x < 0 || head.x > canvas.width - cellSize || head.y < 0 || head.y > canvas.height - cellSize) {
        setBackground();
        createSnake();
        drawSnake();
        createFood();
        drawFood();
        directionQueue = 'right';
        score = 0;
    }
    // checking for colisions with snake's body
    for (i = 1; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            setBackground();
            createSnake();
            drawSnake();
            createFood();
            drawFood();
            directionQueue = 'right';
            score = 0;
        }
    }
    // checking for collision with food
    if (checkCollision(head.x, head.y, food.x, food.y)) {
        snake[snake.length] = { x: head.x, y: head.y };
        createFood();
        drawFood();
        score += 10;
    }

    canvas.onkeydown = function (evt) {
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
    direction = 'right'; // initial direction
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
newGame();
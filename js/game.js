const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const input = new InputHandler();
const renderer = new Renderer(ctx, canvas.width, canvas.height);

let player;
let platforms = [];
let enemies = [];
let score = 0;
let gameOver = false;
let animationId;

async function initGame() {
    try {
        const res = await fetch('/api/level/1');
        const levelData = await res.json();

        platforms = [];
        enemies = [];

        levelData.layout.forEach(obj => {
            // Mapping types to platform instantiation
            platforms.push(new Platform(obj.x, obj.y, obj.w, obj.h, obj.type));
        });

        levelData.enemies.forEach(e => {
            enemies.push(new Enemy(e.x, e.y, e.type));
        });

        // Spawn player at start (safe spot)
        player = new Player(50, 400);

        startGameLoop();

    } catch (err) {
        console.error("Failed to load level", err);
    }
}

function update() {
    if (gameOver) return;

    // Input Handling
    if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
        player.vx = player.speed;
    } else if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
        player.vx = -player.speed;
    } else {
        player.vx = 0;
    }

    if ((input.isDown('ArrowUp') || input.isDown('KeyW') || input.isDown('Space')) && player.grounded) {
        player.vy = player.jumpForce;
        player.grounded = false;
    }

    // Physics
    Physics.updatePlayer(player, platforms);

    // Enemy Updates
    enemies.forEach(e => e.update());

    // Enemy Collisions
    const collisionResult = Physics.checkEnemyCollision(player, enemies);
    if (collisionResult === 'hit') {
        player.lives--;
        document.getElementById('lives').textContent = player.lives;
        if (player.lives <= 0) {
            endGame();
        } else {
            // Respawn or push back
            player.x = 50;
            player.y = 400;
            player.vx = 0;
            player.vy = 0;
        }
    } else if (collisionResult === 'kill') {
        score += 100;
        document.getElementById('score').textContent = score;
    }

    // Cleanup dead enemies
    enemies = enemies.filter(e => !e.toBeRemoved);

    // Check Death (Fall)
    if (player.isDead) {
        if (player.lives > 0) {
            player.lives--;
            document.getElementById('lives').textContent = player.lives;
            player.isDead = false;
            player.x = 50;
            player.y = 400;
            player.vx = 0;
            player.vy = 0;
        } else {
            endGame();
        }
    }
}

function draw() {
    renderer.clear();
    if (player) {
        renderer.draw(player, platforms, enemies);
    }
}

function loop() {
    update();
    draw();
    if (!gameOver) {
        animationId = requestAnimationFrame(loop);
    }
}

function startGameLoop() {
    if (animationId) cancelAnimationFrame(animationId);
    gameOver = false;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('game-over-screen').classList.add('hidden');
    loop();
}

function endGame() {
    gameOver = true;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

document.getElementById('restart-btn').addEventListener('click', () => {
    // Reset player lives logic inside init or here
    // For simplicity, just reload level
    initGame();
});

// Start
initGame();

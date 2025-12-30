class Entity {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.isDead = false;
        this.toBeRemoved = false;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 40, 40, '#ff0000'); // Red for Mario
        this.speed = 5;
        this.jumpForce = -12;
        this.grounded = false;
        this.lives = 3;
    }
}

class Platform extends Entity {
    constructor(x, y, w, h, type) {
        // Different colors for different types
        let color = '#8B4513'; // Ground brown
        if (type === 'platform') color = '#CD853F'; // Bricks
        if (type === 'tube') color = '#00AA00'; // Green tube
        if (type === 'tube_tall') color = '#00AA00';

        super(x, y, w, h, color);
        this.type = type;
    }
}

class Enemy extends Entity {
    constructor(x, y, type) {
        super(x, y, 40, 40, '#804000'); // Brown Goomba
        this.type = type;
        this.vx = -2; // Move left initially
        this.patrolStart = x - 100;
        this.patrolEnd = x + 100;
    }

    update(deltaTime) {
        super.update(deltaTime);
        // Simple patrol logic
        if (this.x <= this.patrolStart) this.vx = 2;
        if (this.x >= this.patrolEnd) this.vx = -2;
    }
}

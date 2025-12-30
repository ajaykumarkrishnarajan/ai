const GRAVITY = 0.6;
const FRICTION = 0.8;

class Physics {
    static AABB(r1, r2) {
        return r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y;
    }

    static updatePlayer(player, platforms) {
        player.vy += GRAVITY;
        player.x += player.vx;

        // Horizontal collisions
        for (let p of platforms) {
            if (Physics.AABB(player, p)) {
                if (player.vx > 0) {
                    player.x = p.x - player.w;
                } else if (player.vx < 0) {
                    player.x = p.x + p.w;
                }
                player.vx = 0;
            }
        }

        player.y += player.vy;
        player.grounded = false;

        // Vertical collisions
        for (let p of platforms) {
            if (Physics.AABB(player, p)) {
                if (player.vy > 0) { // Falling
                    player.y = p.y - player.h;
                    player.grounded = true;
                    player.vy = 0;
                } else if (player.vy < 0) { // Jumping up
                    player.y = p.y + p.h;
                    player.vy = 0;
                }
            }
        }

        // Screen boundaries
        if (player.y > 800) { // Fallen off
            player.isDead = true;
        }
    }

    static checkEnemyCollision(player, enemies) {
        for (let e of enemies) {
            if (Physics.AABB(player, e)) {
                // If falling on top of enemy
                const hitFromTop = (player.y + player.h - e.y) < 20 && player.vy > 0;

                if (hitFromTop) {
                    e.toBeRemoved = true;
                    player.vy = -6; // Bounce
                    return 'kill';
                } else {
                    return 'hit';
                }
            }
        }
        return null;
    }
}

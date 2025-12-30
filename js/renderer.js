class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.cameraX = 0;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw(player, platforms, enemies) {
        // Camera logic: keep player near center
        this.cameraX = player.x - this.width / 2 + player.w / 2;
        // Clamp camera
        if (this.cameraX < 0) this.cameraX = 0;
        // Ideally clamp to level width, but let's assume valid movement

        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);

        // Draw Background Elements (Stars or mood)
        // (Optional: Paralax stars could go here)

        // Draw Platforms
        for (let p of platforms) {
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, p.w, p.h);
            // Draw border
            this.ctx.strokeStyle = '#000';
            this.ctx.strokeRect(p.x, p.y, p.w, p.h);
        }

        // Draw Enemies
        for (let e of enemies) {
            this.ctx.fillStyle = e.color;
            this.ctx.fillRect(e.x, e.y, e.w, e.h);
            // Angry Eyes
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(e.x + 5, e.y + 10, 10, 10);
            this.ctx.fillRect(e.x + 25, e.y + 10, 10, 10);
        }

        // Draw Player
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(player.x, player.y, player.w, player.h);
        // Player Eyes (direction based)
        this.ctx.fillStyle = 'white';
        let eyeOffset = player.vx >= 0 ? 25 : 5;
        this.ctx.fillRect(player.x + eyeOffset, player.y + 8, 10, 10);

        this.ctx.restore();
    }
}

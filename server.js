const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Level Data
const level1 = {
    id: 1,
    theme: 'night',
    layout: [
        // x, y, type (1: ground, 2: platform, 3: tube)
        { x: 0, y: 500, w: 2000, h: 100, type: 'ground' }, // Base ground
        { x: 300, y: 350, w: 100, h: 20, type: 'platform' },
        { x: 450, y: 300, w: 100, h: 20, type: 'platform' },
        { x: 600, y: 250, w: 100, h: 20, type: 'platform' },
        { x: 800, y: 350, w: 200, h: 20, type: 'platform' },
        { x: 1200, y: 400, w: 50, h: 100, type: 'tube' },
        { x: 1400, y: 500, w: 50, h: 100, type: 'tube_tall' },
    ],
    enemies: [
        { x: 500, y: 450, type: 'goomba' },
        { x: 900, y: 300, type: 'goomba' },
        { x: 1300, y: 450, type: 'goomba' }
    ]
};

app.get('/api/level/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id === 1) {
        res.json(level1);
    } else {
        res.status(404).json({ error: 'Level not found' });
    }
});

let scores = [];

app.post('/api/score', (req, res) => {
    const { name, score } = req.body;
    scores.push({ name, score, date: new Date() });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5); // Keep top 5
    res.json({ success: true, scores });
});

app.get('/api/scores', (req, res) => {
    res.json(scores);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.use(cors());

// Configure body-parser to accept larger JSON payloads (up to 10MB) for base64 photo uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static assets from Vite build in production
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory database for the queue
let queue = [];

// Helper to get local network IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if ((iface.family === 'IPv4' || iface.family === 4) && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// REST API Endpoints
app.get('/api/ip', (req, res) => {
  const ip = getLocalIp();
  res.json({ ip });
});

app.get('/api/queue', (req, res) => {
  res.json(queue.filter(entry => entry.status !== 'done').sort((a, b) => a.position - b.position));
});

app.post('/api/queue', (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Prénom requis' });
  }

  const cleanName = name.trim();
  
  const activeEntries = queue.filter(entry => entry.status !== 'done');
  
  // Reuse existing active entry if one exists with the same name (e.g., reconnecting from sleep mode)
  const existingEntry = activeEntries.find(entry => entry.name.toLowerCase() === cleanName.toLowerCase());
  if (existingEntry) {
    return res.status(200).json(existingEntry);
  }

  const duplicates = activeEntries.filter(entry => entry.name.toLowerCase() === cleanName.toLowerCase());
  const displayName = duplicates.length > 0 ? `${cleanName} #${duplicates.length + 1}` : cleanName;

  const hasActive = activeEntries.some(entry => entry.status === 'active');
  const status = !hasActive ? 'active' : 'waiting';

  const maxPosition = activeEntries.length > 0 ? Math.max(...activeEntries.map(e => e.position)) : 0;

  const newEntry = {
    id: 'entry_' + Math.random().toString(36).substr(2, 9),
    name: cleanName,
    display_name: displayName,
    status: status,
    position: maxPosition + 1,
    frame: null,
    custom_text: '',
    photo_url: null,
    camera_source: 'mobile', // 'mobile' | 'kiosk'
    capture_state: 'idle',   // 'idle' | 'countdown' | 'captured'
    aspect_ratio: '4:3',     // '1:1' | '4:3' | '16:9'
    layout: 'single',        // 'single' | 'strip' | 'grid'
    capture_index: 0,
    capture_total: 1,
    countdown_count: -1,
    captured_photos: [],
    created_at: new Date().toISOString()
  };

  queue.push(newEntry);
  
  io.emit('queue_updated', getActiveQueue());
  
  res.status(201).json(newEntry);
});

app.patch('/api/queue/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const index = queue.findIndex(entry => entry.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Entrée introuvable' });
  }

  // Update entry fields
  queue[index] = { ...queue[index], ...updates };

  // If status changed to "done", shift the next waiting user to "active"
  if (updates.status === 'done') {
    const activeEntries = queue.filter(entry => entry.status !== 'done');
    const hasActive = activeEntries.some(entry => entry.status === 'active');
    
    if (!hasActive) {
      const waiting = activeEntries
        .filter(entry => entry.status === 'waiting')
        .sort((a, b) => a.position - b.position);
      
      if (waiting.length > 0) {
        const nextActiveId = waiting[0].id;
        const nextActiveIndex = queue.findIndex(entry => entry.id === nextActiveId);
        if (nextActiveIndex !== -1) {
          queue[nextActiveIndex].status = 'active';
        }
      }
    }
  }

  // Broadcast update to all connected clients
  io.emit('queue_updated', getActiveQueue());
  
  res.json(queue[index]);
});

app.post('/api/queue/reset', (req, res) => {
  queue = [];
  io.emit('queue_updated', []);
  res.json({ success: true, message: 'Queue reset successfully' });
});

// Fallback for SPA routing: serve index.html for any unknown route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

function getActiveQueue() {
  return queue.filter(entry => entry.status !== 'done').sort((a, b) => a.position - b.position);
}

// Socket.io Connection Logic
io.on('connection', (socket) => {
  socket.emit('queue_updated', getActiveQueue());

  socket.on('subscribe_queue', () => {
    socket.emit('queue_updated', getActiveQueue());
  });

  // Relay live low-resolution PC camera frames to the mobile remote
  socket.on('kiosk_frame_upload', ({ entryId, frameData }) => {
    socket.broadcast.emit('kiosk_frame_broadcast', { entryId, frameData });
  });
});

const PORT = process.env.PORT || 8082;
httpServer.listen(PORT, () => {
  const localIp = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`  SnapSync Backend Server running locally:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Wi-Fi:   http://${localIp}:${PORT}`);
  console.log(`======================================================\n`);
});

const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const classroomHandler = require('./socketHandlers/classroom');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

classroomHandler(io);

server.listen(PORT, () => {
  console.log(`ShikshaNode backend running at http://localhost:${PORT}`);
});

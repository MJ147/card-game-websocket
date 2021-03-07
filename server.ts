import { Socket } from 'socket.io';
import { CardGameStorage } from './storage/card-game.storage';
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});

const cardGameStorage: CardGameStorage = new CardGameStorage();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket: Socket) => {
	// Run when client connects
	socket.emit('message', 'Welcome!');

	// Broadcast when a player connects
	socket.broadcast.emit('message', 'A user has joined the table');

	// Runs when clinet disconnects
	socket.on('disconnect', () => {
		io.emit('message', 'A user has left the table');
	});

	// Listen for chat message
	socket.on('setPlayer', (playerName: string) => {
		const newPlayerId = cardGameStorage.setPlayer(playerName);

		io.emit('PlayerId', newPlayerId);
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

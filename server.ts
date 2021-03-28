import { TableDto } from './storage/card-game-dto.models';
import { ISO_8601 } from 'moment';
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

	// create new player
	socket.on('createPlayer', (request: Request<string>) => {
		const newPlayerId = cardGameStorage.createPlayer(request.data, request.uuid);

		io.emit(`playerId${request.uuid}`, newPlayerId);
	});

	// create new table
	socket.on('createTable', (request: Request<string>) => {
		const newTableId = cardGameStorage.createTable(request.data, request.uuid);

		io.emit(`tableId${request.uuid}`, newTableId);
	});

	// join user to table
	socket.on('joinTable', (request: Request<string>) => {
		const table = cardGameStorage.joinUserToTable(request.uuid, request.data);

		io.emit(`tableId${request.uuid}`, table?.id);
	});

	// get updated table
	socket.on('updateTable', (request: Request<string>) => {
		const table = cardGameStorage.getTable(request.uuid);
		let tableDto: TableDto;

		table?.players.forEach(({ id }) => {
			if (table != null) {
				tableDto = cardGameStorage.getTableDto(table, id);
			}
			io.emit(`table${id}`, tableDto);
		});
	});

	// get all tables
	socket.on('getAllTables', (request: Request<string>) => {
		const allTables = cardGameStorage.getAllTables(request.uuid);

		io.emit(`allTables${request.uuid}`, allTables);
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export interface Request<T> {
	uuid: string;
	data: T;
}

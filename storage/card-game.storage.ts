import { TableDto, PlayerDto, CardDto } from './card-game-dto.models';
import { Player, Lobby, CardGame, Entity, Table, Card } from './card-game.models';
const uuidv4 = require('uuid');

export class CardGameStorage {
	cardGame: CardGame;

	constructor() {
		const lobby: Lobby = { players: [] };
		this.cardGame = { lobby: lobby, tables: [] };
	}

	createPlayer(playerName: string, id: string): string | null {
		if (this.findEntityByName(playerName, this.getAllPlayers())) {
			return null;
		}

		const player: Player = {
			id: id,
			name: playerName,
		};

		this.cardGame.lobby.players.push(player);

		return player.id;
	}

	createTable(tableName: string, playerId: string): string | null {
		const tables = this.cardGame.tables;
		const lobby = this.cardGame.lobby;

		if (this.findEntityByName(tableName, tables)) {
			return null;
		}

		const table: Table = {
			id: uuidv4.v4(),
			name: tableName,
			deck: [],
			cards: [],
			players: [],
		};

		this.moveEntity(playerId, lobby.players, table.players);
		tables.push(table);

		return table.id;
	}

	getAllPlayers(): Player[] {
		const lobbyPlayers = this.cardGame.lobby.players;
		const tablesPlayers = this.cardGame.tables.flatMap((table) => table.players);

		return [...lobbyPlayers, ...tablesPlayers];
	}

	getAllTables(playerId: string): TableDto[] {
		return this.cardGame.tables.map((table: Table) => {
			const playersDto: PlayerDto[] = table.players.map((player: Player) => {
				const playerDto: PlayerDto = { name: player.name, cards: player.cards?.length ?? 0 };

				return playerDto;
			});
			const cardsDto: CardDto[] = table.cards.map((card: Card) => {
				const cardDto: CardDto = { rank: card.rank, suit: card.suit };

				return cardDto;
			});
			const deckDto: number = table.deck.length;

			return { ...table, players: playersDto, deck: deckDto, cards: cardsDto };
		});
	}

	findEntityByName(entityName: string, entityList: Entity[]): any {
		return entityList.find((entity) => entity.name === entityName);
	}

	findEntityById(entityId: string, entityList: Entity[]): any {
		return entityList.find((entity) => entity.id === entityId);
	}

	moveEntity(entityId: string, origin: Entity[], destination: Entity[]): void {
		origin.forEach((entity, index) => {
			if (entity.id === entityId) {
				origin.splice(index, 1);
				destination.push(entity);
			}
		});
	}

	joinUserToTable(playerId: string, tableId: string): string | null {
		const tables = this.cardGame.tables;
		const lobby = this.cardGame.lobby;
		console.log(playerId);

		if (!this.findEntityById(playerId, this.getAllPlayers())) {
			return null;
		}
		console.log(tableId);
		console.log(tables);

		const table: Table = this.findEntityById(tableId, tables);

		if (table == null) {
			return null;
		}
		console.log(3);

		this.moveEntity(playerId, lobby.players, table.players);

		return table.id;
	}
}

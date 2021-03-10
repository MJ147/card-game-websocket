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
		const lobbyPlayers = this.cardGame.lobby.players;
		const tablesPlayers = this.cardGame.tables.flatMap((table) => table.players);

		if (this.isEntityNameExists(playerName, [...lobbyPlayers, ...tablesPlayers])) {
			return null;
		}

		const player: Player = {
			id: id,
			name: playerName,
		};

		lobbyPlayers.push(player);

		return player.id;
	}

	createTable(tableName: string, playerId: string): string | null {
		const tables = this.cardGame.tables;
		const lobby = this.cardGame.lobby;
		console.log(3232);

		if (this.isEntityNameExists(tableName, tables)) {
			console.log(2);

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
		console.log(tables);

		return table.id;
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

			return { name: table.name, players: playersDto, deck: deckDto, cards: cardsDto };
		});
	}

	isEntityNameExists(entityName: string, entityList: Entity[]): boolean {
		return entityList.some((entity) => entity.name === entityName);
	}

	isEntityIdExists(entityId: string, entityList: Entity[]): boolean {
		return entityList.some((entity) => entity.id === entityId);
	}

	moveEntity(entityId: string, origin: Entity[], destination: Entity[]): void {
		origin.forEach((entity, index) => {
			if (entity.id === entityId) {
				origin.splice(index, 1);
				destination.push(entity);
			}
		});
	}
}

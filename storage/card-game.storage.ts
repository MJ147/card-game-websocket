import { Rank, Suit } from './card.enum';
import { table } from 'console';
import { TableDto, PlayerDto, CardDto } from './card-game-dto.models';
import { Player, Lobby, CardGame, Entity, Table, Card } from './card-game.models';
const uuidv4 = require('uuid');

export class CardGameStorage {
	cardGame: CardGame;
	suit: typeof Suit = Suit;
	rank: typeof Rank = Rank;

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

		const player: Player = this.findEntityById(playerId, this.getAllPlayers());
		player.tableId = table.id;

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
			return this.getTableDto(table);
		});
	}

	getTableDto(table: Table, playerId?: string): TableDto {
		const playersDto: PlayerDto[] = table.players.map((player: Player) => {
			let cards: number | Card[] = player.cards?.length ?? 0;

			if (playerId != null && player.id === playerId) {
				cards = player.cards as Card[];
			}

			const playerDto: PlayerDto = {
				id: player.id,
				name: player.name,
				cards: cards,
			};

			return playerDto;
		});
		const cardsDto: CardDto[] = table.cards.map((card: Card) => {
			const cardDto: CardDto = { rank: card.rank, suit: card.suit };

			return cardDto;
		});
		const deckDto: number = table.deck.length;

		return { ...table, players: playersDto, deck: deckDto, cards: cardsDto };
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

	joinUserToTable(playerId: string, tableId: string): TableDto | null {
		const tables = this.cardGame.tables;
		const lobby = this.cardGame.lobby;

		const player: Player = this.findEntityById(playerId, this.getAllPlayers());
		const table: Table = this.findEntityById(tableId, tables);

		if (player == null || table == null) {
			return null;
		}

		if (table.players.length >= 4) {
			return null;
		}

		player.tableId = tableId;
		this.moveEntity(playerId, lobby.players, table.players);

		if (table.players.length === 4) {
			this.prepareTable(table);
		}

		return this.getTableDto(table);
	}

	prepareTable(table: Table): void {
		console.log(1);
		table.deck = this.shuffleCards(this.createDeck());
		console.log(2);
		this.dealCards(20, table.deck, table.players);
		console.log(3);
	}

	createDeck(): Card[] {
		const deck: Card[] = [];
		Object.keys(this.suit)
			.filter((key) => isNaN(Number(key)))
			.forEach((suit) => {
				Object.keys(this.rank)
					.filter((key) => isNaN(Number(key)))
					.forEach((rank) => {
						const card: Card = {
							id: uuidv4.v4(),
							rank,
							suit,
						};
						deck.push(card);
					});
			});
		return deck;
	}

	shuffleCards(cards: Card[]): Card[] {
		console.log(cards.length);

		console.log(1.1);

		for (let i = cards.length - 1; i > 0; i--) {
			console.log(1.2);
			const j = Math.floor(Math.random() * (i + 1));
			[cards[i], cards[j]] = [cards[j], cards[i]];
		}
		console.log(1.3);
		return cards;
	}

	dealCards(numberOfCards: number, cards: Card[], players: Player[]): void {
		console.log(2.1);
		const cardsToDeal: Card[] = cards.splice(cards.length - numberOfCards);
		cardsToDeal.reverse().forEach((card, idx) => {
			const player = players[idx % 4];
			if (player.cards == null) {
				player.cards = [];
			}
			console.log(2.2);
			player.cards?.push(card);
			console.log(players);
		});
		console.log(2.3);
	}

	getTable(playerId: string): Table | null {
		const player: Player = this.findEntityById(playerId, this.getAllPlayers());
		const tables = this.cardGame.tables;

		if (player?.tableId == null) {
			return null;
		}

		const table: Table = this.findEntityById(player.tableId, tables);

		return table;
	}
}

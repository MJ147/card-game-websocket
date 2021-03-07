import { Player, Lobby, CardGame, Entity } from './card-game.models';
const uniqid = require('uniqid');

export class CardGameStorage {
	cardGame: CardGame;

	constructor() {
		const lobby: Lobby = { players: [] };
		this.cardGame = { lobby: lobby, tables: [] };
	}

	setPlayer(playerName: string): number | null {
		const lobbyPlayers = this.cardGame.lobby.players;
		const tablesPlayers = this.cardGame.tables.flatMap((table) => table.players);

		if (this.isNameExists(playerName, [...lobbyPlayers, ...tablesPlayers])) {
			return null;
		}

		const player: Player = {
			id: uniqid(),
			name: playerName,
		};

		lobbyPlayers.push(player);

		return player.id;
	}

	isNameExists(entityName: string, entityList: Entity[]): boolean {
		return entityList.some((player) => player.name === entityName);
	}
}

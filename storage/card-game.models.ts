export interface CardGame {
	lobby: Lobby;
	tables: Table[];
}

export interface Lobby {
	players: Player[];
}

export interface Entity {
	id: number;
	name: string;
}

export interface Table extends Entity {
	deck: Card[];
	players: Player[];
	cards: Card[]; // cards on table
}

export interface Player extends Entity {
	cards?: Card[];
}

export interface Card {
	id: number;
	rank: string;
	suit: string;
}

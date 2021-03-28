import { Card } from './card-game.models';

export interface CardGameDto {
	lobby: LobbyDto;
	tables: TableDto[];
}

export interface LobbyDto {
	players: PlayerDto[];
}

export interface EntityDto {
	id: string;
	name: string;
}

export interface TableDto extends EntityDto {
	deck: number;
	players: PlayerDto[];
	cards: CardDto[]; // cards on table
}

export interface PlayerDto extends EntityDto {
	cards: Card[] | number;
}

export interface CardDto {
	rank: string;
	suit: string;
}

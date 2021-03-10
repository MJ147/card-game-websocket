export interface CardGameDto {
	lobby: LobbyDto;
	tables: TableDto[];
}

export interface LobbyDto {
	players: PlayerDto[];
}

export interface EntityDto {
	name: string;
}

export interface TableDto extends EntityDto {
	deck: number;
	players: PlayerDto[];
	cards: CardDto[]; // cards on table
}

export interface PlayerDto extends EntityDto {
	cards: number;
}

export interface CardDto {
	rank: string;
	suit: string;
}

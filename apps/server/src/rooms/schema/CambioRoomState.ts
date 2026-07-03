import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";
import { Room, Client, CloseCode } from "colyseus";


export class Card extends Schema {
	@type("string") suit: string;
	@type("string") val: string;

	constructor(suit: string, val: string) {
		super();
		this.suit = suit;
		this.val = val;
	}
}

export class CardPile extends Schema {
	@type([Card]) cards = new ArraySchema<Card>();


	constructor(cards?: Card[]) {
		super();
		if (cards) {
			this.cards = this.cards.concat(cards)
		}
	}

	addCards(cards: Card[]) {
		this.cards.concat(cards)
	}

	shuffle() {
		this.cards.shuffle()
	}

	stackFrom(src: CardPile) {
		this.cards.push(src.cards.pop())
	}
	stackTo(dest: CardPile) {
		dest.cards.push(this.cards.pop())
	}
}

const SUITS: string[] = ["h", "c", "s", "d"];
const VALS: string[] = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];

export const freshDeck: Card[] = [];

SUITS.forEach(suit => {
	VALS.forEach(val => {
		freshDeck.push(new Card(suit, val));
	});
});
freshDeck.push(new Card("h", "jo"));
freshDeck.push(new Card("s", "jo"));

export class Player extends Schema {
	@type("string") username: string;
	@type(CardPile) hand = new CardPile();
	@type("boolean") ready: boolean;
	@type("boolean") turn: boolean;

	constructor(client: Client) {
		super();
		this.username = client.auth?.username || "Guest";
		this.ready = false;
		this.turn = false;
	}
}

export class CambioState extends Schema {
	@type(CardPile) deck = new CardPile();
	@type(CardPile) discard = new CardPile();
	@type({ map: Player }) players = new MapSchema<Player>();
	@type("boolean") cambio: boolean;
	@type("boolean") playing: boolean;
	@type("number") playerIndex: number;

	constructor() {
		super();
		this.deck = new CardPile(freshDeck);
		this.cambio = false;
		this.playing = false;
		this.playerIndex = 0;
	}
}


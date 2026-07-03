import * as PIXI from "pixi.js";
import { CardPile, Card } from "../../../server/src/rooms/schema/CambioRoomState.js";
import { CardObject } from "./CardObject.js";

export class DeckObject extends PIXI.Container {
	topCard: CardObject;
	deck: CardPile;
	faceUp: boolean;
	constructor(deck: CardPile, faceUp: boolean) {
		super();
		this.faceUp = faceUp;
		this.deck = deck;
		this.topCard = new CardObject(this.deck.cards.slice(-1)[0], faceUp);
		let area = this.toGlobal({ x: 0, y: 0 });
		let cardSize = this.topCard.getSize()
		let deckArea = new PIXI.Graphics().rect(-cardSize.width / 2, -cardSize.height / 2, cardSize.width, cardSize.height).fill({color: 0x00000050, alpha: 0.5}).stroke({ width: 5, color: 0xFFFFFF }); // 5px Gold outline
		this.addChild(deckArea);
		// this.addChild(this.topCard);
	}

	update() {
		this.removeChild(this.topCard);
		this.topCard = new CardObject(this.deck.cards.slice(-1)[0], this.faceUp);
		this.addChild(this.topCard)
	}

	moveCard(card: CardObject) {
		card.oldParent.deck.stackTo(this.deck)
		this.topCard.destroy();
		this.topCard = card;
		this.addChild(this.topCard);
	}
}


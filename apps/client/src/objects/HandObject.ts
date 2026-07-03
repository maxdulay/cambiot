import * as PIXI from "pixi.js";
import { CardPile, Card} from "../../../server/src/rooms/schema/MyRoomState.ts";

export class DeckObject extends PIXI.Container {
  constructor(hand: CardPile) {
    super();
	hand.cards.forEach((card, index) => {
		const sprite = new PIXI.Sprite(PIXI.Assets.get(card.suit + card.val));
		sprite.anchor.set(index, index)
		this.addChild(sprite)
	});
  }

}


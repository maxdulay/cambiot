import * as PIXI from "pixi.js";
import { Card } from "../../../server/src/rooms/schema/CambioRoomState.js";
import { DeckObject } from "./DeckObject.js";

export class CardObject extends PIXI.Sprite {
	card: Card;
	front: PIXI.Texture;
	back: PIXI.Texture;
	oldParent: DeckObject | null;

	constructor(card: Card, faceUp: boolean) {
		super()
		this.card = card;
		this.front = PIXI.Assets.get(card.val + card.suit);
		this.back = PIXI.Assets.get("cover");

		if (faceUp) {
			this.texture = this.front;
		} else {
			this.texture = this.back;
		}
		this.anchor = 0.5;
		this.scale = 0.5;
		this.oldParent = this.parent;
	}
}

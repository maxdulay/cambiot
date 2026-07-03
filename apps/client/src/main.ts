import * as PIXI from "pixi.js";

import { discordSDK } from './utils/DiscordSDK.js';
import { colyseusSDK } from './utils/Colyseus.js';
import { Player, Card, CardPile } from "../../server/src/rooms/schema/CambioRoomState.js";
import type { CambioRoom } from "../../server/src/rooms/CambioRoom.js";
import { authenticate } from './utils/Auth.js';
import { Callbacks } from "@colyseus/sdk";
import { DeckObject } from "./objects/DeckObject.js";
import { CardObject } from "./objects/CardObject.js";
//

(async () => {
	const app = new PIXI.Application();
	await app.init({
		width: window.innerWidth,
		height: window.innerHeight,
		background: '#1f6d27',
	});


	// Load assets
	const SUITS: string[] = ["h", "c", "s", "d"];
	const VALS: string[] = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
	const asset_names: { "alias": string, "src": string }[] = [];
	SUITS.forEach(suit => {
		VALS.forEach(val => {
			asset_names.push({ "alias": val + suit, "src": "/cards/" + val + suit + ".svg" });
		});
	});
	asset_names.push({ "alias": "joh", "src": "/cards/joh.svg" })
	asset_names.push({ "alias": "jos", "src": "/cards/jos.svg" })
	asset_names.push({ "alias": "cover", "src": "cards/cover.svg" })
	await PIXI.Assets.load(asset_names)

	document.body.appendChild(app.canvas);
	const tableLayer = new PIXI.Container();
	const dragLayer = new PIXI.Container();
	app.stage.addChild(tableLayer, dragLayer);

	// Make things draggable
	function makeDraggable(card: CardObject) {
		card.eventMode = 'static';
		card.cursor = 'pointer';

		let dragging = false;

		card.on('pointerdown', (event) => {
			const globalMouse = event.global

			dragLayer.addChild(card)
			card.position.set(globalMouse.x, globalMouse.y)
		})

		card.on('pointermove', (event) => {
			if (!dragging) return;
			card.position.set(
				event.global.x,
				event.global.y
			);
		})

		card.on('mouseup', stopDrag);
		card.on('mouseupoutside', stopDrag);
	}

	function stopDrag(event: MouseEvent) {

	}


	try {
		/**
		 * Authenticate with Discord and get Colyseus JWT token
		 */
		const authData = await authenticate();

		// Assign the token to authenticate with Colyseus (Room's onAuth)
		colyseusSDK.auth.token = authData.token;

	} catch (e) {
		console.error("Failed to authenticate", e);

		const error = new PIXI.Text({
			anchor: 0.5,
			text: "Failed to authenticate.",
			style: {
				fontSize: 18,
				fill: 0xff0000,
				stroke: 0x000000,
			}
		});
		error.position.x = app.screen.width / 2;
		error.position.y = app.screen.height / 2;

		app.stage.addChild(error);
		return;
	}

	const room = await colyseusSDK.joinOrCreate<CambioRoom>("my_room", {
		channelId: discordSDK.channelId // join by channel ID
	});

	const callbacks = Callbacks.get(room);
	// // TODO: Establish whole table
	// // TODO: Establish deck and discard sprites
	//
	callbacks.onAdd("players", (player, sessionId) => {
		// TODO: Add player to table side
		// 	- Calculate where players should be placed relative to center
		// 	- Create hand objects
		if (sessionId === room.sessionId) {
			// Handle local player hand setup
			let deckObject = new DeckObject(room.state.deck, false);
			deckObject.position.x = app.screen.width / 2 - 100
			deckObject.position.y = app.screen.height / 2
			tableLayer.addChild(deckObject);
			let discardObject = new DeckObject(room.state.discard, true);
			discardObject.position.x = app.screen.width / 2 + 100
			discardObject.position.y = app.screen.height / 2
			tableLayer.addChild(discardObject);


		} else {
			callbacks.onChange(player.hand, () => {
				// Update hand sprites
			})
		}
	})
	//
	callbacks.listen("deck", (deck) => {
		// deckObject.update()
		// deckObject.update()
		// Update deck sprite

	})
	// callbacks.listen("discard", () => {
	// 	// Update discard sprite
	//
	// })
	//
	// callbacks.onRemove("players", (player, sessionId) => {
	// 	// TODO: Remove player from table side
	// })

})();

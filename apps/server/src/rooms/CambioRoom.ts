import { JWT } from "@colyseus/auth";
import { Room, Client, CloseCode } from "colyseus";
import { CambioState, Player, Card } from "./schema/CambioRoomState.js";

const MIN_PLAYERS = 0;


export class CambioRoom extends Room {
	state = new CambioState();
	maxClients = 25;

	static onAuth(token: string) {
		return JWT.verify(token);
	}

	onCreate(options: any): void | Promise<any> {

		this.onMessage("draw", (client, _) => {
			const player = this.state.players.get(client.sessionId);
			if (player) player.hand.stackFrom(this.state.deck);
		});

		this.onMessage("discard", (client, _) => {
			const player = this.state.players.get(client.sessionId);
			if (player) this.state.discard.stackFrom(player.hand);
		});

		this.onMessage("ready", (client, _) => {
			const player = this.state.players.get(client.sessionId);
			if (!player) return;

			player.ready = !player.ready;

			let start = false;
			if (this.state.players.size > MIN_PLAYERS) {
				this.state.players.forEach(p => {
					if (p.ready) start = true;
				});
				this.state.playing = start;
				this.state.deck.shuffle()
			}
		});

		this.onMessage("pass", (client, _) => {
			const player = this.state.players.get(client.sessionId);
			if (!player) return;

			player.turn = false;
			this.state.playerIndex = (this.state.playerIndex + 1) % this.state.players.size;
			const newPlayerKey = [...this.state.players.keys()][this.state.playerIndex];
			const newPlayer = this.state.players.get(newPlayerKey);
			if (newPlayer) newPlayer.turn = true;
		});
	}

	onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {
		const player = new Player(client);
		player.username = client.auth?.username || "Guest";
		this.state.players.set(client.sessionId, player);
		console.log(`Client joined: ${client.sessionId}`);
	}

	onLeave(client: Client, code?: number): void | Promise<any> {
		console.log(`Client left: ${client.sessionId}`);
		this.state.players.delete(client.sessionId);
	}
}

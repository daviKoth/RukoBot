import { EventEmitter } from "events"
import WebSocket from "ws"

import MidiManager from "./MidiManager.js"
import DVDManager from "./DVDManager.js"

export default class ClientManager extends EventEmitter {

	constructor(url, token) {
		super()

		this.url = url
		this.token = token
		this.users = new Map()
		this.midi = new MidiManager(this)
		this.dvd = new DVDManager({})
		this.ws = new WebSocket(this.url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
			}
		})
		
		this.midi.on("end", song => {
			this.sendMessage(`!! ${song} ended.`)
		})
		
		this.midi.on("start", song => {
			this.sendMessage(`!! ${song} started.`)
		})

		this.ws.on("open", () => {
			setInterval(() => {
				this.sendPacket("t", {
					e: Date.now()
				})
			}, 15000)
			
			this.sendPacket("hi", {
				token: this.token,
			})

			this.dvd.on("update", () => {
				if(!this.midi.player.isPlaying()) {
					this.sendPacket("m", {x: this.dvd.pos.x, y: this.dvd.pos.y})
				}
			})
		})

		this.ws.on("message", message => {
			let packet
			try {
				packet = JSON.parse(message.toString())[0]
			} catch {
				return
			}

			const type = packet.m
			

			if(type == "hi") {
				this.user = packet.u
				this.emit("ready")
			} else if(type == "a") {
				this.emit("message", {
					content: packet.a,
					user: packet.p
				})
			} else if(type == "ch") {
				this.users = new Map()
				
				packet.ppl.forEach(u => {
					this.users.set(u._id, u)
				})
			} else if(type == "p") {
				this.users.set(packet._id, packet)
			} else if(type == "bye") {
				this.users.delete(packet.ps)
			}
		})

		this.ws.on("close", (code, reason) => {
			this.emit("end", `${code} - ${reason}`)
		})

		this.ws.on("error", () => {
			this.emit("end", "Experienced error.")
		})
	}

	setUsername(name) {
		this.sendPacket("userset", {
			set: {
				name
			}
		})
	}
	setChannel(_id) {
		this.sendPacket("ch", {
			_id,
			set: {
				visible: true
			}
		})
	}

	sendMessage(message) {
		this.sendPacket("a", {
			message,
		})
	}
	
	sendPacket(m, packet) {
		this.ws.send(JSON.stringify([{
			m,
			...packet
		}]))
	}

}


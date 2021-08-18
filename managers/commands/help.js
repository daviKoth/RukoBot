import fs from "fs"

export default class command {
	constructor(client) {
		this.client = client
		this.commands = fs.readdirSync("managers/commands")
	}

	async run() {
		const text = this.commands.map( async e => {
			const nodecommand = await import("./managers/commands/" + e)

			return `${e.split(".js")[0]}${nodecommand.admin ? " (Admin)" : ""}`
		}).join(", ").match(/.{1,511}/g)

		setTimeout(() => {
			for (let i = 0; i < text.length; i++) {
				setTimeout(() => {
					this.client.sendMessage(text[i])
				}, i * 1000)
			}
		}, 100)
	}
}
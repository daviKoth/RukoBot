import fs from "fs"

export default class command {
	constructor(client) {
		this.client = client
		this.commands = fs.readdirSync("managers/commands")
	}

	async run() {
		const text = this.commands.map(e => 
			`${e.split(".js")[0]}${fs.readFileSync("./managers/commands/" + e).toString().includes("this.admin = true") && e != "help.js" ? " (Admin)" : ""}`
		).join(", ").match(/.{1,511}/g)

		setTimeout(() => {
			for (let i = 0; i < text.length; i++) {
				setTimeout(() => {
					this.client.sendMessage(text[i])
				}, i * 1000)
			}
		}, 100)
	}
}
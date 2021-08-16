import ClientManager from "./managers/ClientManager.js"
import CommandManager from "./managers/CommandManager.js"
import fs from "fs"

const config = JSON.parse(fs.readFileSync("config.json"))

for (let i = 0; i < config.links; i++) {
	setTimeout(() => {
		config.links[i].channels.forEach(chan => {
			startBot(config.links[i], chan)
		})
	}, 1000 * i)
}

function startBot(server, channel) {
	const client = new ClientManager(server.ws, config.token)
	const CManager = new CommandManager(client)

	client.on("ready", () => {
		client.setChannel(channel)
		client.setUsername(config.username)
		
		client.dvd.startLoop()

		console.log("I have connected to " + server.ws + " #" + channel)
	})

	client.on("message", message => {
		CManager.handleMessage(message)
		return 
	})

	client.on("end", (reason) => {
		console.log(`Client closed due to \`${reason}\`. Reconnecting in 2s. (${server.ws})`)

		setTimeout(() => {
			console.log("Attempting to connect.")
			startBot(server)
		}, 2000)
	})
}

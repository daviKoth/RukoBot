import ClientManager from "./managers/ClientManager.js"
import CommandManager from "./managers/CommandManager.js"
import fs from "fs"

const config = JSON.parse(fs.readFileSync("config.json"))

config.links.forEach(server => {
	for (let i = 0; i < server.channels.length; i++) {
		setTimeout(() => {
			startBot(server, server.channels[i])
		},2000*i)
	}
})

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
		console.log(`Bot Client closed due to \`${reason}\`. Reconnecting in 2s. (${server.ws})`)
	
		client.midi.stop()
		delete client.users
		setTimeout(() => {
			console.log("Attempting to connect.")
			startBot(server, channel)
		}, 2000)
	})
}

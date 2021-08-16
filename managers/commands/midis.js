export default class command {
	constructor(client) {
		this.client = client
	}

	async run() {
		const text = `There are ${this.client.midi.midis} available midis. Play them with ??play NAME. ${this.client.midi.midis.join(" ")}.`.match(/.{1,511}/g)
		text.forEach(t => {
			this.client.sendMessage(t)
		})
	}
}
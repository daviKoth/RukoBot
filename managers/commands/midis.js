export default class command {
	constructor(client) {
		this.client = client
	}

	async run() {
		this.client.sendMessage(`There are ${this.client.midi.midis.length} available midis. Play them with ??play NAME.`)
		
		setTimeout(() => {
			const text = `${this.client.midi.midis.join(" ")}`.match(/.{1,511}/g)

			text.forEach(t => {
				setTimeout(() => {
					this.client.sendMessage(t)
				}, 1000)
			})
		}, 1000)
	}
}
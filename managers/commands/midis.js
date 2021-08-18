export default class command {
	constructor(client) {
		this.client = client
	}

	async run() {
		this.client.sendMessage(`There are ${this.client.midi.midis.length} available midis. Play them with ??play NAME.`)
		const text = `${this.client.midi.midis.join(" ")}`.match(/.{1,511}/g)

		setTimeout(() => {
			for (let i = 0; i < text.length; i++) {
				setTimeout(() => {
					this.client.sendMessage(text[i])
				}, i * 1000)
			}
		}, 500)
	}
}
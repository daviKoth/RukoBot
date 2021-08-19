  
export default class command {
	constructor(client) {
		this.client = client
		this.admin = false
	}

	async run(message) {

		if(this.client.friendrequest) {
			this.client.sendPacket("friendrequestsenabled", {
				"id": message.user.id
			})

			this.client.sendMessage("!! You are now a friend")
		} else {
			this.client.sendMessage("!! Can't be friends because the friend requests are disabled.")
		}
	}
}

new Vue({
	el: "#topBody",
	data() {
		return {
			path: `${location.protocol === 'https' ? 'wss' : 'ws'}://${location.host}/websocket`,
			joinUrl: "/lottery/socket/join?name=",
			gaming: false,
			lottery: false,
			lotteried: false,
			player: {
				name: "",
				prizeSign: ""
			},
			lotteriedPlayer: {
				name: ""
			},
			adminLotteryied: false,
			request: {
				"type": "2"
			}
		}
	},
	created() {},
	computed: {
		data() {

		}
	},
	mounted() {},
	methods: {
		open: function() {
			console.log("socket连接成功");
			this.gaming = true;
		},
		error: function() {
			console.log("连接错误")
		},
		getMessage: function(msg) {
			var jsonObj = JSON.parse(msg.data);
			console.log(jsonObj);
			if (jsonObj.sign) {
				this.lottery = true;
			} else if (jsonObj.player) {
				this.player.prizeSign = jsonObj.player.prizeSign;
				this.lottery = false;
				this.lotteried = true;
				console.log(this.player.prizeSign);
			} else if (jsonObj.lotteriedPlayer) {
				this.lotteriedPlayer.name = jsonObj.lotteriedPlayer.name;
				this.adminLotteryied = true;
			} else {
				alert(msg.data);
			}
		},
		send: function(data) {
			this.socket.send(data);
		},
		close: function() {
			console.log("socket已经关闭");
			this.adminLotteryied = false;
			this.lotteried = false;
			this.lottery = false;
			this.gaming = false;
		},
		join() {
			axios({
				method: "post",
				url: this.joinUrl + this.player.name
			}).then((res) => {
				console.log(res.data);
				if (res.data != null && res.data != "") {
					alert(res.data);
					return;
				}
				this.startScoket();
			})
		},
		startScoket() {
			if (typeof(WebSocket) === "undefined") {
				alert("您的浏览器不支持socket")
			} else {
				// 实例化socket
				this.socket = new WebSocket(this.path + this.player.name)
				// 监听socket连接
				this.socket.onopen = this.open
				// 监听socket错误信息
				this.socket.onerror = this.error
				// 监听socket消息
				this.socket.onmessage = this.getMessage
				this.socket.onclose = this.close
			}
		},
		startLottery() {
			let data = {
				type: this.request.type
			}
			this.send(JSON.stringify(data));
		}
	},
	destroyed() {
		// 销毁监听
		this.socket.onclose = this.close
	}
});

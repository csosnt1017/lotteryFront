new Vue({
	el: "#topBody",
	data() {
		return {
			path: "ws://localhost:8081/lottery/socket?name=",
			logined: false,
			lottery: false,
			adminLotteryied: false,
			admin: {
				account: "admin",
				password: ""
			},
			playerList: [],
			lotteriedPlayerList: [],
			lotteriedPlayer: {
				name: "",
				prizeSign: ""
			},
			adminLotteryied: false,
			request: {
				"type": "1"
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
		},
		error: function() {
			console.log("连接错误")
		},
		getMessage: function(msg) {
			var jsonObj = JSON.parse(msg.data);
			console.log(jsonObj);
			if (jsonObj.msg) {
				this.playerList.push(jsonObj.msg);
			} else if (jsonObj.player) {
				this.lotteriedPlayerList.push(jsonObj.player);
				console.log(jsonObj.player.prizeSign);
			} else if (jsonObj.lotteriedPlayer) {
				this.lotteriedPlayer.name = jsonObj.lotteriedPlayer.name;
				this.lotteriedPlayer.prizeSign = jsonObj.lotteriedPlayer.prizeSign;
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
			this.logined = false;
		},
		login() {
			if (this.admin.account == "admin" && this.admin.password == "666666") {
				this.logined = true;
				this.startScoket();
			}
		},
		startScoket() {
			if (typeof(WebSocket) === "undefined") {
				alert("您的浏览器不支持socket")
			} else {
				// 实例化socket
				this.socket = new WebSocket(this.path + this.admin.account)
				// 监听socket连接
				this.socket.onopen = this.open
				// 监听socket错误信息
				this.socket.onerror = this.error
				// 监听socket消息
				this.socket.onmessage = this.getMessage
				this.socket.onclose = this.close
			}
		},
		openLottery() {
			let data = {
				type: 1
			}
			this.send(JSON.stringify(data));
			this.lottery = true;
		},
		startLottery() {
			if(this.adminLotteryied){
				if(this.lotteriedPlayer.prizeSign == 2 || this.lotteriedPlayer.prizeSign == 4){
					this.clearPrize();
				}
			}
			let data = {
				type: 3
			}
			this.send(JSON.stringify(data));
		},
		clearPrize() {
			let data = {
				name: this.lotteriedPlayer.name,
				type: 4
			}
			this.send(JSON.stringify(data));
		}
	},
	destroyed() {
		// 销毁监听
		this.socket.onclose = this.close
	}
});

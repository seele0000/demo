

export default {
	route: {
		path: "/pc",
		meta: {
			title: "房观察微信上墙"
		}
	},
	data () {
    	return {
    		isShowQrcode: false,
    		list: []
    	}
    },
 	beforeMount () {
		this.fetchAllCommentPc();
		this.fetchtest();
		function b() {
			var c = document.documentElement.clientWidth || document.body.clientWidth;
			document.documentElement.style.fontSize = c / 40 + 'px';
		};
		b();
		window.onresize = b;

	},
	beforeUpdate () {
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		document.getElementById('ulBox').style.height = (h-200) + 'px';
		// this.$refs.ulBox.sytle.height = (h-100) + 'px';
	},
	methods: {
  		showQrcode () {
  			this.isShowQrcode = !this.isShowQrcode;
  		},
  		closeLi (id) {
  			for (var i=0; i<this.list.length; i++) {
  				if (this.list[i].id == id) {
  					this.list[i].isShowLi = false;
  				} 
  			}
  		},
		fetchAllCommentPc () {
			let that = this;
			fetch('./data/getAllComments', {
				method: 'POST',
				body: JSON.stringify({
					// message:this.messageContent
				}),
				headers: {'Content-Type': 'application/json'}
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					that.list = that.dataInit(data.data);
				}).catch(()=> {
			});
		},	
        fetchtest() {
        	let that = this;
            let _source = new EventSource('./data/pullComment');
            _source.onmessage = (_event) => {

                let _data = {};
                if (_event.data) {
                    try {
                        _data = JSON.parse(_event.data);
                    } catch (e) {

                    }
                }

                switch (_data.type) {
                    case 'zan':
                        break;
                    case 'comment':

                        if(that.list.length > 10) {
                        	that.list.shift();
                        }

						let _commentData = {
							isShowLi:true,
							nickname:_data.data.nickname,
							uuid:_data.data.uuid,
							headimgurl:_data.data.headimgurl,
							content:_data.data.content,
						}

						that.list.push(_commentData);


						that.$nextTick(()=>{
							that.$refs.ulBox.scrollTop = 9999999;
						});

                        break;
                }
            }
        },
        dataInit(dataObj) {
            for(var i=0; i<dataObj.length; i++) {
            	dataObj[i].isShowLi = true;
            }
			this.$nextTick(()=>{
				this.$refs.ulBox.scrollTop = 9999999;
			});
            return dataObj;
        }
  	}
}




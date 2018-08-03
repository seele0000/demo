
export default {
    route: {
        path: "/mobile",
        meta: {
            title: "房观察 微信互动墙"
        }
    },
    components: {
        // List
    },
    data() {
        return {
            isDialogShow: true,
            showNum: 50,
            isFocus: false,
            messageContent: '',
            wxuid: {},
            list: []
        }
    },
    watch: {
        list() {

        }
    },
    ready() {

    },
    beforeCreat() {

    },
    beforeMount() {
        this.fetchAllCommentMobile();
        this.wx();
        function b() {
            var c = document.documentElement.clientWidth || document.body.clientWidth;
            document.documentElement.style.fontSize = c / 7.5 + 'px';
        };
        b();
        window.onresize = b;
    },
    mounted() {
        this.fetchtest();
    },
    methods: {
        closeDialog() {
            this.isDialogShow = false;
        },
        inputFocus () {
            let that = this;
            this.isFocus = true;
            this.si = setInterval(function () {
                document.body.scrollTop = 9999999;
            },100);
            //this.$nextTick(()=>{
            //    this.$refs.commentBox.scrollTop = 9999999;
            //})
        },
        inputBlur () {
            let that = this;
            this.isFocus = false;
            this.si && clearInterval(this.si);
            //setTimeout(function () {
            //    that.$refs.commentBox.scrollTop = 9999999;
            //},10);
            //this.$refs.commentBox.scrollTop = 9999999;
        },
        zanAdd(_time) {
            let that = this;
            let zanList = [];
            try{
                zanList = JSON.parse(window.localStorage.zanList);
            }catch(e){}
            if (zanList.indexOf(_time) > -1) {
                alert('你已经点过赞了');
                return;
            }

            zanList.push(_time);
            window.localStorage.zanList = JSON.stringify(zanList);

            fetch('data/updateZan', {
                method: 'POST',
                body: JSON.stringify({
                    id:_time
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getMore() {
            let listObj = this.list;
            this.dataInit(listObj);
        },
        refresh() {
            this.showNum = 50;
            this.fetchAllCommentMobile();
        },
        submit() {

            let that = this;

            if (this.messageContent == '' ) {
                alert('请输入内容');
                return;
            }

            let _commentData = {
                content: this.messageContent,
                nickname: this.wxuid.nickname,
                headimgurl: this.wxuid.headimgurl,
                uuid: this.wxuid.uuid,
            };
            fetch('./data/pushComment', {
                method: 'POST',
                body: JSON.stringify(_commentData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.messageContent = '';
        },
        fetchAllCommentMobile() {
            let that = this;
            fetch('./data/getAllComments', {
                method: 'POST',
                body: JSON.stringify({
                    // message:this.messageContent
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    that.list = that.dataInit(data.data);
                    that.$nextTick(()=>{
                        that.$refs.commentBox.scrollTop = 9999999;
                    });

                }).catch(() => {
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
                        this.list.map(one => {
                            if (one.time == _data.data.id) {
                                one.zanNum = _data.data.zanNum;
                            }
                        })
                        break;
                    case 'comment':
                        _data.data.isMe = (that.wxuid.uuid == _data.data.uuid);
                        _data.data.isShowLi = true;
                        this.list.push(_data.data)

                        //this.$nextTick(()=>{
                        //    this.$refs.commentBox.scrollTop = 9999999;
                        //});

                        if(_data.data.isMe ) {
                            this.$nextTick(()=>{
                                this.$refs.commentBox.scrollTop = 9999999;
                            });
                        }
                        break;
                }
            }
        },
        dataInit(dataObj) {

            this.wxuid.isMe = false;
            this.wxuid.isShowLi = true;

            let uidStr = localStorage.getItem('uidStr');
            let uidObj = JSON.parse(uidStr);

            let showNum = this.showNum;


            for(let key in uidObj) {
                this.wxuid[key] = uidObj[key];
            }

            for (var i = 0; i < dataObj.length; i++) {
                if (dataObj[i].uuid == this.wxuid.uuid) {
                    dataObj[i].isMe = true;
                }
                if (i < dataObj.length - showNum) {
                    dataObj[i].isShowLi = false;
                } else {
                    dataObj[i].isShowLi = true;
                }
            }

            this.showNum += 50;

            return dataObj;
        },
        wx() {
            // 微信认证 + 获取用户信息
            let that = this;
            var apiObj = {
                    apihost: 'http://api.chuangjia.me/wx/jssdk',    //分享接口url
                    api_oauth: 'http://api.chuangjia.me/wx/oauth',  //oauth认证接口url
                    o_host: 'http://prj.chuangjia.me/hg005/#/mobile', //当前url
                    prj: 'hg005', //项目
                    //获取opeind
                    getUid: function () {
                        let _uidStr = window.localStorage.uidStr;
                        if(_uidStr && _uidStr != "null"){
                            that.wxuid.nickname=_uidStr.nickname;
                            that.wxuid.headimgurl=_uidStr.headimgurl;
                            that.wxuid.uuid=_uidStr.uuid;
                            return;
                        }


                        var params = apiObj.getRequest();
                        var p = 'prj=' + apiObj.prj;
                        p += '&url=' + apiObj.o_host;
                        if (params['code']) {
                            p += '&code=' + params['code'];
                        }
                        p += '&type=1';


                        fetch(apiObj.api_oauth, {
                            method: 'POST',
                            body: p,
                            //credentials: 'include',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                            .then(_res=> {
                                return _res.json();
                            })
                            .then(_json=> {
                                    var data = _json;
                                    // cuo
                                    if (data.code === 1) {
                                        alert(data.msg);
                                    } else {
                                        if (data.data.type === 2) {
                                            location.href = data.data.url;
                                        } else {
                                            let uid = {};
                                            that.wxuid.uuid = uid.uuid = data.data.uid.openid;
                                            that.wxuid.nickname = uid.nickname = data.data.uid.nickname;
                                            that.wxuid.headimgurl = that.headimgurl = uid.headimgurl = encodeURIComponent(data.data.uid.headimgurl);
                                            let uidStr = JSON.stringify(uid);
                                            window.localStorage.setItem('uidStr', uidStr);

                                        }

                                    }
                                }
                            )
                            .catch(e=>{
                                console.log(e);
                            })
                    },


                    getRequest: function () {
                        var url = location.search;
                        var theRequest = new Object();
                        if (url.indexOf("?") !== -1) {
                            var str = url.substr(1);
                            str = str.split("&");
                            for (var i = 0; i < str.length; i++) {
                                theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
                            }
                        }
                        return theRequest;
                    }
                }
                ;

            var openid;

            function getOI() {
                apiObj.getUid();
                var ps = apiObj.getRequest();
                if (ps['code']) {
                    // location.href = 'http://prj.chuangjia.me/hd014t/indexs.php';
                }
            }

            getOI();
        }
    }
}
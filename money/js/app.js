var app = {
    // baseUrl: 'http://192.168.10.126:8080/',
    baseUrl: 'http://h5api.chuangjia.me',
    api: {
        banknote: '/annualmeeting/banknote',
        banknote2: '/annualmeeting/banknote2',
        winning: '/annualmeeting/winning',
    },
    getUid: function() {
        var _this = this;
        $.ajax({
            type: 'get',
            url: '//prj.chuangjia.me/wxsso//getuser?',
            data: {ssid: window.localStorage.CJSSID || ""},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.ssid) {
                    window.localStorage.CJSSID = data.ssid
                }
                if(data.code == '201') {
                    console.log(data.url)
                    window.location.assign(data.url);
                } else {
                    if (data.user.uid) {
                        window.localStorage.CJUID = data.user.uid;
                    }
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
    getShare: function() {
        var sharedata = {
            title: '',
            desc: '',
            link: 'http://prj.chuangjia.me/hc035/',
            imgUrl: 'http://prj.chuangjia.me/hc035/img/wxface.jpg',
            success: function () {

            },
            cancel: function () {
                
            }
        };

        $.ajax({
            type: 'get',
            url: '//prj.chuangjia.me/wxsso/sign?',
            data: {ssid: window.localStorage.CJSSID || ""},
            dataType: "json",
            success: function (data) {
                if(data.ssid) {
                    window.localStorage.CJSSID = data.ssid
                }
                var _sign = data.sign;
                _sign.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage'];
                wx.config(_sign);
                wx.ready(function () {
                    wx.onMenuShareTimeline(sharedata);
                    wx.onMenuShareAppMessage(sharedata);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
    postScore: function(curScore, roundNum) {
        var _this = this;
        var postApi = _this.api.banknote;
        if(window.localStorage.round == 2) {
            postApi = _this.api.banknote2;
        }
        $.post(_this.baseUrl + postApi,{
                open_id:  window.localStorage.CJUID,
                score: curScore
            }, function(data) {
                if(data.code == -1) {
                    alert(data.message);
                }
            console.log(data);
        });
    },
    event: function() {
        // this.getUid();
    }
};

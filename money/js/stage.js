var W = 750, H = 1280,
    moneyW = 0,
    moneyH = 0,
    moneyBottomPosition = 240,
    moneyTotalNum = 3,
    curMoneyNum = moneyTotalNum,
    followMoneyArr = [],
    followItem = null,
    IS_ANDROID = -1 < navigator.userAgent.indexOf("Android"),
    timeCount = 0,
    scoreCount = 0,
    qp_o = 0,
    qp_d = 5,
    qp_j = 20,
    
    qp_i = [],
    IS_TOUCH, 
	
	SCREEN_SHOW_ALL = !0;

(function(myStage, d) {
	var _cfg = {
        startFunc: startFn,
	    img: {
	        path: "img/",
	        manifest: [{
	            src: "money_bg.png",
	            id: "moneyBg"
	        },{
                src: "img_money.jpg",
                id: "money"
            },{
                src: "arrow.png",
                id: "arrow"
            },{
                src: "conut-bg.png",
                id: "countBg"
            },{
                src: "icon-time.png",
                id: "iconTime"
            }]
	    },
	    audio: {
	        path: "audio/",
	        manifest: [{
	            src: "count.mp3",
	            id: "count"
	        }]
	    }
	};
	var source = null;
	

	stage.init = function(c) {
		source = c;
    };

    stage.init(_cfg);

    window.onload = function() {
        myStage.stage = new createjs.Stage("stage");
        myStage.queue = new createjs.LoadQueue(!1);
        myStage.queue.setMaxConnections(30);
        if (IS_TOUCH = createjs.Touch.isSupported()) {
            createjs.Touch.enable(myStage.stage, !0);
            myStage.stage.mouseEnabled = !1;
        }
        createjs.Ticker.setFPS(60);

        setTimeout(initScreen, 100);
        createjs.Ticker.on("tick", myStage.stage);

        c = new MyProgressBar(W,H);
        myStage.stage.addChild(c);


        // 加载页
        myStage.queue.on("complete", source.startFunc, null, !0);
        source.img && myStage.queue.loadManifest(source.img, !1);

        source.audio && (
            myStage.queue.installPlugin(createjs.Sound),
            myStage.queue.loadManifest(source.audio, !1)
        );

        source.followed || myStage.queue.loadManifest({
            path: "img/",
            manifest: [{
                src: "img_money_01.png",
                id: "followMoney1"
            }]
        }, !1);
        c.forQueue(myStage.queue);
        myStage.queue.load();


        app.event();
    };

    function initScreen() {
        var c = myStage.stage.canvas
          , k = window.innerWidth
          , b = window.innerHeight;
        if (SCREEN_SHOW_ALL) {
            k / b > W / H ? k = W * b / H : b = H * k / W,
            c.style.marginTop = 0;
        } else {
            var d = W * b / H;
            k >= d ? (k = d,
            stage.x = 0) : stage.x = (k - d) / 2
        }
        c.width = W;
        c.height = H;
        c.style.width = k + "px";
        c.style.height = b + "px"
    }
    function startFn() {
        console.log('startFn');
        myStage.stage.splash = new StageIndexInit;
        myStage.stage.addChild(myStage.stage.splash);
    }

    function gamePage() {
        var a = new createjs.Shape;
        a.graphics.drawRect(0, 0, W, H);
        myStage.stage.addChild(a);
        var b = new createjs.Shape;
        b.graphics.beginFill("white").rect(0, 200, W, H);
        a.hitArea = b;

        myStage.stage.player = new GameInit;
        myStage.stage.addChild(myStage.stage.player);

        var c = 0
          , d = 0;
        qp_m = -1;
        qp_k = 0;
        qp_o = 1;
          
        a.on("mousedown", function(a) {
            IS_TOUCH && a.nativeEvent instanceof MouseEvent 
            || 2 != qp_o && 1 != qp_o 
            || (c = a.localY,d = myStage.stage.player.m[curMoneyNum].y);
        });
        
        a.on("pressmove", function(a) {
            IS_TOUCH && a.nativeEvent instanceof MouseEvent 
            || (1 == qp_o && (qp_m = 0,qp_o = 2),
            2 == qp_o && (myStage.stage.player.m[curMoneyNum].visible = !0,
            myStage.stage.player.m[curMoneyNum].y += (a.localY - c) / 1.5))
        });
        var f = 0;
        a.on("pressup", function(a) {
            IS_TOUCH && a.nativeEvent instanceof MouseEvent 
            || 2 != qp_o 
            || (50 < c - a.localY ? 
                (a = (new Date).getTime(),
                0 < qp_i.length && qp_i[qp_i.length - 1] + 50 > a 
                ? qp_a("WARNING: Too fast! maybe engine error.") : (f = qp_y(a),
                f <= qp_j ? (qp_k++,
                scoreCount += 1,
                myStage.stage.player.playAnimation(myStage.stage.player.m[curMoneyNum]),
            createjs.Sound.play("count", !0)) : (qp_i.length--,
            qp_a("WARN: " + f)))) : (qp_z(d),
            myStage.stage.player.m[curMoneyNum].visible = !1))
        });

        // 落钱
        var followTime = setInterval(qp_D, 1000);
        

        // 倒计时 计分
        var curTime = 0;
        var gameFlag = true;
        createjs.Ticker.addEventListener("tick", function(a) {
            if(timeCount >= 0) {
                timeCount += a.delta;
                curTime = 30 - parseInt(timeCount / 1000);
                // curTime = 10 - parseInt(timeCount / 1000);
            }
            if(curTime >= 0) {
                myStage.stage.player.sum.text = scoreCount;
                myStage.stage.player.time.text = curTime;
            } else if(gameFlag){
                // alert('游戏结束！');
                clearInterval(followTime);
                gameFlag = false;
                document.querySelector('.mask').style.display = 'block';

                
                // 提交成绩
                // app.postScore(scoreCount);
            }
        })       
    }


    function StageIndexInit() {
        this.initialize();

        this.moneyBg = new createjs.Bitmap(myStage.queue.getResult("moneyBg"));
        this.moneyBg.x = 0;
        this.moneyBg.y = H - 240;
        this.addChild(this.moneyBg);
        console.log(myStage.queue.getResult("moneyBg"));

        var roundNum = window.localStorage.round;
        this.round = new createjs.Text('第'+ roundNum +'轮',"bold 43px microsoft yahei","#fff");
        this.round.textBaseline = "middle";
        this.round.x = W / 2 - this.round.getBounds().width / 2;
        this.round.y = H / 2 - 100;
        this.addChild(this.round);

        this.title = new createjs.Text('向上滑动开始',"bold 43px microsoft yahei","#fff");
        this.title.textBaseline = "middle";
        this.title.x = W / 2 - this.title.getBounds().width / 2;
        this.title.y = H / 2;
        this.addChild(this.title);

        this.start = new createjs.Bitmap(myStage.queue.getResult("money"));
        this.start.y = H - moneyBottomPosition;
        this.start.x = W/2 - this.start.getBounds().width / 2 + 30;
        this.addChild(this.start);

        this.arrow = new createjs.Bitmap(myStage.queue.getResult("arrow"));
        this.arrow.y = H - 400;
        this.arrow.x = (W - this.arrow.getBounds().width) / 2;
        this.addChild(this.arrow);

        var touchArea = new createjs.Shape;
        touchArea.graphics.drawRect(0, 0, W, H);
        myStage.stage.addChild(touchArea);
        var block = new createjs.Shape;
        block.graphics.beginFill("white").rect(0, 200, W, H);
        touchArea.hitArea = block;


        var tmpLocalY, tmpStartY;
        var _this = this;
        touchArea.on("mousedown", function(e) {
            if(qp_o == 0) {
                tmpLocalY = e.localY;
                tmpStartY = _this.start.y;
            }
        });
        touchArea.on("pressmove", function(e) {
            if(qp_o == 0) {
                if(myStage.stage.splash.start.y + e.localY - tmpLocalY < tmpStartY) {
                    myStage.stage.splash.start.y += e.localY - tmpLocalY;
                }
            }
        });
        touchArea.on("pressup", function(b) {
            myStage.stage.splash.arrow.visible = !1;
            myStage.stage.splash.visible = !1;
            gamePage();
        })
    }
    StageIndexInit.prototype = new createjs.Container;

    function qp_y(a) {
        var b = 0;
        if (0 != qp_i.length) {
            var c;
            for (c = 0; c < qp_i.length && !(qp_i[c] > a - 1E3); c++)
                ;
            for (var b = qp_i.length - c, d = c; d < qp_i.length; d++)
                qp_i[d - c] = qp_i[d];
            qp_i.length -= c
        }
        qp_i.push(a);
        return parseInt(b)
    }
    function qp_z(a) {
        var b = Math.abs(myStage.stage.player.m[curMoneyNum] - a);
        createjs.Tween.get(myStage.stage.player.m[curMoneyNum]).to({
            y: a
        }, 20 * b)
    }

    var qp_F = 0;
    function qp_D() {
        for (var a = 0; a < qp_d; a++)
            followMoneyArr[qp_F][a].visible = !0,
            createjs.Tween.get(followMoneyArr[qp_F][a]).to({
                y: H + followMoneyArr[qp_F][a].getBounds().height / 2 + 100,
                rotation: 720 + genRandom(400),
                x: genRandom(W)
            }, 1E3 + genRandom(800)).to({
                visible: !1
            }, 10).to({
                x: genRandom(W),
                y: -H / 2 + genRandom(H / 2),
                rotation: 0
            }, 10);
        qp_F < moneyTotalNum ? qp_F++ : qp_F = 0
    }
    function genRandom(a) {
        return parseInt(Math.random() * a)
    }

    function GameInit() {
        this.initialize();

        // 钱(底部)
        this.moneyBg = new createjs.Bitmap(myStage.queue.getResult("moneyBg"));
        this.moneyBg.x = 0;
        this.moneyBg.y = H - 240;
        this.addChild(this.moneyBg);
        // 钱(滑动)
        this.mb = new createjs.Bitmap(myStage.queue.getResult("money"));
        this.mb.y = H - moneyBottomPosition;
        this.mb.x = W/2 - this.mb.getBounds().width / 2 + 30;
        this.addChild(this.mb);

        this.countbg = new createjs.Bitmap(myStage.queue.getResult("countBg"));
        this.countbg.x = 35;
        this.countbg.y = 30;
        this.addChild(this.countbg);   

        this.sum = new createjs.Text(scoreCount,"bold 43px Arial","#be1310");
        this.sum.textBaseline = "middle";
        // this.sum.textAlign = "right";
        this.sum.x = this.countbg.x + this.countbg.getBounds().width / 2;
        this.sum.y = this.countbg.y + this.countbg.getBounds().height / 2;
        this.addChild(this.sum);
    
        this.iconTime = new createjs.Bitmap(myStage.queue.getResult("iconTime"));
        this.iconTime.x = (W - this.iconTime.getBounds().width - 90);
        this.iconTime.y = 35;
        this.addChild(this.iconTime);
    
        this.time = new createjs.Text(timeCount,"bold 43px Arial","black");
        this.time.x = this.iconTime.x + this.iconTime.getBounds().width + 10;
        this.time.y = 35;
        this.addChild(this.time);

        moneyW = this.mb.getBounds().width;
        moneyH = this.mb.getBounds().height;

        // 划钱
        this.m = [];
        for (var i = 0; i<4; ++i){
            this.m[i] = new createjs.Bitmap(myStage.queue.getResult("money"));
            this.m[i].image = myStage.queue.getResult("money");
            this.m[i].regX = -W/2 + this.m[i].getBounds().width / 2 - 30;
            this.m[i].regY = 0;
            this.m[i].y = H - moneyBottomPosition;
            this.m[i].visible = !1;
            this.addChild(this.m[i]);
        }

        // 落钱
        for (var i = 0; i <= moneyTotalNum; ++i){
            followMoneyArr[i] = [];
            for (var j = 0; j < qp_d; ++j) {
                var e = new createjs.Bitmap(myStage.queue.getResult("followMoney1"));
                e.regX = e.getBounds().width / 2;
                e.regY = e.getBounds().height / 2;
                e.x = genRandom(W);
                e.y = -H / 2 + genRandom(H);
                e.visible = !1;
                followMoneyArr[i].push(e);
                myStage.stage.addChild(followMoneyArr[i][j]);
                
            }
        }
    };
    GameInit.prototype = new createjs.Container;
    GameInit.prototype.playAnimation = function(ele) {
        ele.visible = !0;
        createjs.Tween.get(ele).to({
            scaleX: 0.5,
            scaleY: 0.5,
            regX: -W + moneyW - 15,
            y: -H
        }, 300).to({
            visible: !1,
            y: H - moneyBottomPosition,
            regX: -W/2 + moneyW/2 - 30,
            scaleX: 1,
            scaleY: 1
        }, 0);
        0 < curMoneyNum ? curMoneyNum-- : curMoneyNum = moneyTotalNum;
    };

    // 加载
    function MyProgressBar(w, h) {
        this.initialize();
        this.w = w;
        this.h = h;

        // var a = new createjs.Shape;
        // a.graphics.beginFill("#ccc").drawRect(0, 0, W, H);
        // this.addChild(a);
        
        // this.progressText = new createjs.Text("0%","bold 24px Arial","black");
        // this.progressText.x = w / 2;
        // this.progressText.y = h / 2;
        // this.progressText.textAlign = "center";
        // this.progressText.textBaseline = "middle";
        // this.addChild(this.progressText);
        
    }
    MyProgressBar.prototype = new createjs.Container;
    MyProgressBar.prototype.completeCallback = function(a) {
        this.parent.removeChild(this);
        $('.loading').css('display', 'none');
    };
    MyProgressBar.prototype.progressCallback = function(a) {
        // this.progressText.text = "" + parseInt(100 * a.progress) + "%";
        $('.loading p').html(parseInt(100 * a.progress) + "%");
    };
    MyProgressBar.prototype.forQueue = function(a) {
        this.errorList = [];
        a.on("complete", this.completeCallback, this, !0);
        a.on("progress", this.progressCallback, this);
        a.on("error", function(a) {}, null, !0);
        a.on("error", function(a) {
            this.errorList.push(a.item.src)
        }, this)
    };


})(window.stage = window.stage || {});

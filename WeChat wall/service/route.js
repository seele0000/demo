import express from 'express';
import querystring from 'querystring';
import EventEmitter from 'events';
const router = express.Router();

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
/**
 * 获取评论接口
 * @type {String}
 */
let commentsCache = [];
let id = 0;

myEmitter.on("pushComment", function (msg) {
	if (commentsCache.length >= 1000) {
		commentsCache.shift();
	}
	commentsCache.push(msg);
})



// 长连接
router.get("/pullComment", function (req, res, next) {
	//点赞推送
	myEmitter.on("zanComment", function (_zanObj) {
		let _data = {
			type: "zan",
			data: _zanObj
		}
		res.write(`data: ${JSON.stringify(_data)}\n\n`);
	})

	//评论推送
	myEmitter.on("pushComment", function (msg) {
		let _data = {
			type: "comment",
			data: msg
		}
		res.write(`data: ${JSON.stringify(_data)}\n\n`);
	})
	res.set({
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	});

	res.write(`data: {}\n\n`);
});

//post comment 提交评论
router.post("/pushComment", function (req, res, next) {
	let _body = req.body;
	let time = Date.now();
	_body.id = ++id;
	_body.time = time;
	_body.zanNum = 0;
	myEmitter.emit('pushComment', _body);
	res.json({
		code: 200
	});
})

// 获取所有评论
router.post("/getAllComments", function (req, res, next) {
	res.json({
		code: 200,
		data: commentsCache
	});
})

// 点赞更新
router.post("/updateZan", function (req, res, next) {
	let _body = req.body;
	let _zanObj = {};
	commentsCache.map(one => {
		if (one.time == _body.id) {
			one.zanNum++;
			_zanObj.id= one.time;
			_zanObj.zanNum = one.zanNum;
		}
	})
	myEmitter.emit("zanComment", _zanObj);
	res.json({
		code: 200
	});
})

export default router;
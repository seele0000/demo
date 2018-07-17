'use strict';
const db = require('./db');
const Koa = require('koa');
const cors = require('koa2-cors');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(bodyParser());

router.get('/index', async (ctx, next) => {
    ctx.body = 'Hello World';
    console.log('000')
});

router.post('/message/insert', async (ctx, next) => {
  let paramO = ctx.request.body.params;
  ctx.body = {
    state: 500
  }
  await db.message.create({
		movieId: paramO.movieId,
    title: paramO.title,
    msg: paramO.msg
	})
	.then(_data => {
    console.log('_data',_data.dataValues)
    ctx.body = {
      state: 200
    }
	})
	.catch(e => {
    console.log('error',e)
    ctx.body = {
      state: 500
    }
	});
});

router.post('/message/list', async (ctx, next) => {
  let paramO = ctx.request.body.params;
  let list = [];
  await db.message.findAll({
    attributes: ['id', 'movieId', 'title','msg'],
    where: {
      movieId: paramO.movieId
    }
  }).then(_data => {
    for(let i=0; i<_data.length; i++) {
      list.push(_data[i].dataValues)
    }
    console.log(list)
    ctx.body = {
      state: 200,
      data: list
    }
  }).catch(reject => {
    console.log(reject);
    ctx.body = {
      state: _data[0].dataValues
    }
  });
})

app.use(router.routes());
app.listen(3000);
console.log('start 3000');
'use strict';
const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');   // 解析post接收参数

app.use(bodyParser());
app.use(router.routes());


// app.use
/* 
app.use(async (ctx, next) => {
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello, koa2!</h1>';
  console.log('ctx.request.url',ctx.request.url)
  console.log('ctx.request.path',ctx.request.path)
});
 */

// await next
/* 
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
  await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
  const start = new Date().getTime(); // 当前时间
  await next(); // 调用下一个middleware
  const ms = new Date().getTime() - start; // 耗费时间
  console.log(`Time: ${ms}ms`); // 打印耗费时间
});

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
  await next();
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello, koa2!</h1>';
});

app.use(async (ctx, next) => {
  await next();
  console.log('next')
})

// GET /insert
// next
// Time: 2ms
*/

// koa-router
router.get('/hello/:name', async (ctx, next) => {
  var name = ctx.params.name;
  ctx.response.body = `<h1>Hello, ${name}!</h1>`;
  console.log(ctx.request.body);
});

router.get('/', async (ctx, next) => {
  ctx.response.body = '<h1>Index</h1>';
});

router.post('/name', async (ctx, next) => {
  console.log(ctx.request.body);
  ctx.response.body = 'ok';
});



app.listen(3000);
console.log('start 3000');
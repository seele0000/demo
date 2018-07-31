[TOC]
# 概述
- Koa 是一个新的 web 框架
- 通过利用 async 函数，处理异步函数
- 书写服务端应用程序
- Koa 依赖 node v7.6.0 或 ES2015及更高版本和 async 方法支持.
## Hello World
```
const Koa = require('koa');
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');
```
# 中间件
## 参数
### ctx
- 参数ctx是由koa传入的封装了request和response的变量  
- ctx简写：ctx.url == ctx.request.url，ctx.type == ctx.response.type。

属性名 | 值 | 描述
-- | -- | --
ctx.request.method | GET,POST... | 请求方式
ctx.request.url | '/' + String | 请求url
ctx.request.path | '/' + String | 请求url
ctx.request.body | Object | POST请求body参数（bodyParser解析后）
ctx.params | Object | 匹配路由<br>'/hello/:name'<br>'/hello/tom'<br>=><br>{ name: 'tom' }

属性名 | 值 | 描述
-- | -- | --
ctx.response.type | 'text/html' | 响应类型
ctx.response.body | 标签/String/Object... | 响应主体


### next
- next是koa传入的将要处理的下一个异步函数
- await next()来调用下一个async函数（middleware）
## use
- 调用app.use()的顺序决定了middleware的顺序
- await next()会一直执行，直到没有下一个app.use()
```
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

// =>
// GET /insert
// next
// Time: 2ms
```
## koa-router
处理URL映射，续挂载到use
```
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();

app.use(router.routes());       // 挂载到use

router.get('/hello/:name', async (ctx, next) => {
  var name = ctx.params.name;
  ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {
  ctx.response.body = '<h1>Index</h1>';
});
```
## koa-bodyparser
- 解析POST的request中body参数  
- koa-bodyparser必须在router之前被注册到app对象上
```
app.use(bodyParser());  // 挂载到use
```
## koa2-cors
解决接口跨域
```
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
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
```

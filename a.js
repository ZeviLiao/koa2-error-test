const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

const Router = require("koa-router");

let home = new Router();

// 子路由1
home.get("/", async ctx => {
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `;
  ctx.body = html;
});

// 子路由2
let page = new Router();
page
  .get("/404", async ctx => {
    ctx.body = "404 page!";
  })
  .get("/helloworld", async ctx => {
    ctx.body = "helloworld page!";
  })
  .get("/error", async (ctx, next) => {
    // console.log("hello");
    // throw Error("some error");
    // ctx.throw(500,'Error Message');
    try {
      // await next();
      ctx.throw(400,"Error Message");
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  });

// 装载所有子路由
let router = new Router();
router.use("/", home.routes(), home.allowedMethods());
router.use("/page", page.routes(), page.allowedMethods());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log(
    `[demo] route-use-middleware is starting at port 3000
    http://localhost:3000`
  );
});

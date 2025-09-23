// Codigo basado en:
// https://github.com/IIC2513-2021-2/soundify
// https://github.com/IIC2513-2021-2/project
// https://dev.to/kachiic/koa-js-part-1-how-to-make-a-koa-server-in-10-minutes-3og9
// https://www.digitalocean.com/community/tutorials/how-to-build-a-hello-world-application-with-koa#step-2-creating-a-koa-server
// https://medium.com/@ahmedcharef/sequelize-orm-with-node-js-koa-mysql-foreign-keys-a3097ab91a8

require('dotenv').config();

const Koa = require('koa');
const koaBody = require('koa-body').default;
const router = require('./routes');
const cors = require('@koa/cors');

const PORT = process.env.PORT || 3000;

const app = new Koa();

// CORS must be the first middleware
app.use(cors({
  origin: function (ctx) {
    // Allow all origins for now, but you can restrict this later
    return ctx.request.header.origin || '*';
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: [
    'Content-Type', 
    'Content-Length', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'User-Agent',
    'DNT',
    'Cache-Control',
    'X-Mx-ReqToken',
    'Keep-Alive',
    'X-Requested-With',
    'If-Modified-Since',
    'Pragma',
    'X-Forwarded-For'
  ],
  exposeHeaders: [
    'Content-Length',
    'Content-Type',
    'Authorization'
  ],
  maxAge: 86400, // 24 hours
}));

// Handle OPTIONS requests explicitly
app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
    ctx.body = '';
    return;
  }
  await next();
});

app.use(
  koaBody({
    multipart: true,
    keepExtensions: true,
    formidable: {
      maxFileSize: 20 * 1024 * 1024, // 20MB como límite de archivo
    },
  }),
);

app.use(router.routes());

const server = app.listen(PORT);

module.exports = { app, server };

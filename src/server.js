const fastify = require('fastify');

const server = fastify();

server.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: { tittle: 'fastify-api' }
  }
});
server.register(require('./resources/user/user.router'), { prefix: '/users' });

module.exports = server;



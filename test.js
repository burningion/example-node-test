const tracer = require('dd-trace').init({
  hostname: 'datadog-agent',
  // hostname: `${process.env.DATADOG_AGENT_HOST || 'localhost'}`,
  service: `${process.env.KUBE_DEPLOYMENT || 'local'}`,
  tags: [
    `kube_namespace:${process.env.KUBE_NAMESPACE || 'local'}`,
    `kube_deployment:${process.env.KUBE_DEPLOYMENT || 'local'}`,
    `pod_name:${process.env.KUBE_POD_NAME || 'local'}`,
    `docker_image:${process.env.DOCKER_IMAGE || 'local'}`,
  ],
  debug: true,
  logger: {
    debug: message => console.log(message),
    error: err => console.log(err)
  }
});

const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const ddog = require('koa-datadog-middleware')

//import loadConfig from '@uc/load-proxy-config';


const app = new Koa();
//const port = loadConfig().port;
const router = new Router();

// Datadog
// TODO: make this a separate package and allow maybe developers to add
// additional tags and/or configure the agent differently
var dd_config = {
  'host': `${process.env.DATADOG_AGENT_HOST || 'localhost'}`,
  'globalTags': [
    `kube_namespace:${process.env.KUBE_NAMESPACE || 'local'}`,
    `kube_deployment:${process.env.KUBE_DEPLOYMENT || 'local'}`,
    `pod_name:${process.env.KUBE_POD_NAME || 'local'}`,
    `docker_image:${process.env.DOCKER_IMAGE || 'local'}`,
  ],
}
app.use(ddog(dd_config))

// Logging
app.use(async (ctx, next) => {
  console.log(ctx.path)
  await next()
})

// Routes
router.get('/hello', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
})

router.get('/goodbye', async (ctx) => {
  //await msleep(Math.random() * 1000 | 0)
  ctx.body = {
    status: 'success',
    message: 'goodbye!'
  };
})

router.get('/heartbeat', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'healthy'
  };
})

app.use(router.routes());
let port = 9001
app.listen(port);
console.log(`App '${path.basename(__dirname)}' listening on port: ${port}`);
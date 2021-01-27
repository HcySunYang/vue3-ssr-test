process.env.NODE_ENV='production';
const heapdump = require('heapdump')

const vueServerRenderer = require('@vue/server-renderer');
const bundle = require('./bundle_error').default;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loop = async () => {
    const startMem = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
    console.log("start memory", startMem, 'MB')

    await vueServerRenderer.renderToString(bundle({}), {})

    heapdump.writeSnapshot('./' + 'leak.start' + '.heapsnapshot')

    for (let i = 0; i < 10000; i++) {
        await vueServerRenderer.renderToString(bundle({}), {})
    }

    const endMem = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
    console.log("end memory", endMem, 'MB');

    console.log("sleep");
    await sleep(10000);

    gc()

    const endMemCleaned = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
    console.log("ending memory", endMemCleaned, 'MB');
}

async function run() {
    await loop()

    heapdump.writeSnapshot('./' + 'leak.end' + '.heapsnapshot')
}


run()

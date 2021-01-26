process.env.NODE_ENV='production';

const vueServerRenderer = require('@vue/server-renderer');
const bundle = require('./bundle_success').default;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loop = async () => {
    const startMem = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
    console.log("start memory", startMem, 'MB')

    for (let i = 0; i < 10000; i++) {
        await vueServerRenderer.renderToString(bundle({}), {});
    }

    const endMem = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
    console.log("end memory", endMem, 'MB');

    console.log("sleep");
    await sleep(20000);

    const endMemCleaned = Math.round((process.memoryUsage().rss / 1048576) * 100) / 100;
    console.log("ending memory", endMemCleaned, 'MB');
}

loop();
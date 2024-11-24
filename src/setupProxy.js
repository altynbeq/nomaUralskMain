const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Proxy for 1C API
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://212.46.56.10:84',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // remove /api from the request path
            },
        }),
    );

    // Proxy for Bitrix24 API
    // app.use(
    //     '/bitrix',
    //     createProxyMiddleware({
    //     target: 'https://zhezkazgan-romantic.bitrix24.kz', // Bitrix24 API URL
    //     changeOrigin: true,
    //     pathRewrite: {
    //         '^/bitrix': '', // Remove '/api/bitrix' from the request path
    //     },
    //     })
    // );
};

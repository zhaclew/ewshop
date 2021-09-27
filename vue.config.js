module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                img:'@/assets/images',
                components:'@/components',
                network:'@/network',
                utils:'@/utils',
                views:'@/views',
            },
        },
    },
};

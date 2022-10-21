const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/",
  transpileDependencies: true,
  chainWebpack: (config) => {
    // config.devtool("eval-source-map");
    config.plugin("html").tap((args) => {
      args[0].title = "圈组";
      return args;
    });
    // todo: webpack 5 的工程，在 NIMSDK 引入  crypto js 时，需要不使用 node 模式。
    // 拟后续使用别的算法替代 crypto。
    config.resolve.alias.set("crypto", false);
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");
  },
  devServer: {
    host: "localhost",
    port: 8080,
    https: false,
    open: true,
    hot: true,
    proxy: {
      "/api": {
        target: `http://120.25.155.238:9878`,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "border-radius-base": "4px",
            "btn-default-color": "#fff",
            "btn-default-bg": "#3C3E45",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
});

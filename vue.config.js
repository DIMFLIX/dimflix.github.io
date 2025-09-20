const webpack = require('webpack');
const { defineConfig } = require("@vue/cli-service")
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: "/",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: 'raw-loader'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'], // Инъекция Buffer глобально:cite[5]:cite[10]
      }),
      ...(process.env.NODE_ENV === 'production' ? [
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/', '/en', '/ru', '/en/about', '/ru/about', '/en/portfolio', '/ru/portfolio', '/en/articles', '/ru/articles'],
          maxConcurrentRoutes: 4,
          renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
            renderAfterDocumentEvent: 'render-event',
            // Флаги для стабильного запуска Chromium в CI/контейнерах
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          })
        })
      ] : [])
    ],
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm-bundler.js'
      },
      fallback: {
        buffer: require.resolve('buffer/'), // Указание fallback для модуля:cite[4]
      }
    },
  },
  chainWebpack(config) {
    // Merge both previous chainWebpack customizations into one
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          isCustomElement: tag => /^inkscape:|^sodipodi:/.test(tag)
        }
      }))
  }
})

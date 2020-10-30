export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  server: {
    port: 3001, // default: 3000
    host: '0.0.0.0' // default: localhost,
  },
  head: {
    title: 'Unizon Timelock Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    // vendor: ['vue-i18n'],
  },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/theme-antd.less'
  ],
  /**
   * global scss
   */
  styleResources: {
    scss: './assets/css/theme.scss',
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/polyfill.ts',
    '@/plugins/antd-ui.js',
    '@/plugins/filter.ts',
    '@/plugins/app.ts',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    analyze: false,
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js');
    },
    maxChunkSize: 30000,
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#ddbd31'
          }
        }
      }
    },
    extend (config, { isDev, isClient }) {
      if (isClient && !isDev) {
         config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      }
    }
  },
  loading: false,
  resourceHints: false
}

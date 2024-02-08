import { hopeTheme } from 'vuepress-theme-hope'
import navbar from './navbar.js'
import sidebar from './sidebar.js'

export default hopeTheme({
  hostname: 'https://qt911025.github.io',

  author: {
    name: 'QuenTine',
    url: 'https://qt911025.github.io'
  },

  iconAssets: 'fontawesome-with-brands',

  logo: '/thumb.png',

  repo: 'qt911025',

  docsDir: 'src',

  // navbar
  navbar,

  // sidebar
  sidebar,

  // footer: "默认页脚",

  displayFooter: true,

  blog: {
    description: '一个前端开发者',
    intro: '/intro.html'
    // medias: {
    // BiliBili: "https://example.com",
    // Email: "mailto:info@example.com",
    // Facebook: "https://example.com",
    // GitHub: "https://example.com",
    // Pocket: "https://example.com",
    // QQ: "https://example.com",
    // Rss: "https://example.com",
    // Steam: "https://example.com",
    // Wechat: "https://example.com",
    // Weibo: "https://example.com",
    // Zhihu: "https://example.com",
    // },
  },

  // encrypt: {
  //   config: {
  //     "/demo/encrypt.html": ["1234"],
  //   },
  // },

  editLink: false,

  plugins: {
    blog: true,

    comment: {
      // You should generate and use your own comment service
      provider: 'Waline',
      serverURL: 'https://quentine-walline-blog-comments.vercel.app'
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      // chart: true,
      codetabs: true,
      // component: true,
      demo: true,
      // echarts: true,
      figure: true,
      // flowchart: true,
      // gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      // katex: true,
      // mathjax: true,
      mark: true,
      // mermaid: true,
      playground: {
        presets: ['ts', 'vue']
      },
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em') {
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended'
              }
            }
          }
        }
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true
      // vuePlayground: true,
    }
  }
})

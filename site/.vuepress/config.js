module.exports = {
  title: 'Expressing Kandinsky',
  description: 'An interactive website to understand Wassily Kandinsky\'s "science of art"',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.png' } ],
    ['link', { rel: 'stylesheet', href: '/styles/vueperslides.css' } ],
    ['link', { rel: 'stylesheet', href: 'https://use.typekit.net/uuw3qkz.css' }]
  ],
  themeConfig: {
    logo: '/images/favicon.png',
    repo: 'jonobr1/expressing-k',
    repoLabel: 'Github',
    docsDirs: 'site',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'See a typo? Help me improve it.',
    smoothScroll: true,
    nav: [
      { text: 'About', link: '/about/' },
      { text: 'Thesis Abstract', link: '/thesis-abstract/' }
    ],
    lastUpdated: 'Last Updated',
    displayAllHeaders: true,
    activeHeaderLinks: false,
    searchPlaceholder: 'Search...'
  },
  markdown: {
    lineNumbers: true,
    extendMarkdown: (md) => {
      md.use(require('markdown-it-footnote'));
    }
  },
  plugins: [
    '@vuepress/medium-zoom',
    '@vuepress/nprogress'
  ]
};

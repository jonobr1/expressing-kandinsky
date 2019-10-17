module.exports = {
  title: 'Expressing Kandinsky',
  description: 'An interactive website to understand Wassily Kandinsky\'s "science of art"',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.png' } ]
  ],
  themeConfig: {
    repo: 'jonobr1/expressing-k',
    repoLabel: 'Project Source Code',
    docsDirs: 'site',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'See a typo? Help us improve it.',
    smoothScroll: true,
    nav: [],
    lastUpdated: 'Last Updated',
    displayAllHeaders: true,
    activeHeaderLinks: false,
    searchPlaceholder: 'Search...'
  },
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/medium-zoom', '@vuepress/nprogress']
};

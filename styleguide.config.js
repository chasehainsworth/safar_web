module.exports = {
  sections: [
    {
      name: "Introduction",
      content: "docs/introduction.md"
    },
    {
      name: "Documentation",
      sections: [
        {
          name: "Database",
          content: "docs/database.md"
        },
        {
          name: "Configuration",
          content: "docs/configuration.md"
        },
        {
          name: "Live Version",
          external: true,
          href: "http://portal.safarapp.org"
        }
      ]
    },
    {
      name: "Components",
      // content: 'docs/ui.md',
      components: "src/components/**/*.{js,jsx}"
      //   exampleMode: "expand", // 'hide' | 'collapse' | 'expand'
      //   usageMode: "expand" // 'hide' | 'collapse' | 'expand'
    },
    {
      name: "Pages",
      components: "src/pages/*.jsx"
    },
    {
      name: "Known Issues",
      content: "docs/knownissues.md"
    }
  ]
};

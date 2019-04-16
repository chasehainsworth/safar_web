module.exports = {
  pagePerSection: true,
  sections: [
    {
      name: "Safar Web Portal Documentation",
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
          name: "Known Issues",
          content: "docs/knownissues.md"
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
      components: "src/components/**/*.{js,jsx}"
    },
    {
      name: "Pages",
      components: "src/pages/*.jsx"
    }
  ],
  ignore: ["**/components/Firebase/index.js"],
  styleguideDir: "./docs/build"
};

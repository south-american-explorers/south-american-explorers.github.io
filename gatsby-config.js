/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'South American Explorers Archive',
    siteUrl: 'https://south-american-explorers.github.io',
    description: 'Home of the SAE Archives',
  },
  plugins: [{
    resolve: 'gatsby-plugin-root-import'
  }]
};

module.exports = {
  siteMetadata: {
    title: "Collection of React Hooks",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-128821753-1",
        // Puts tracking script in the head instead of the body
        head: false,
        anonymize: true,
        cookieExpires: 0,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/images/react-hooks.png`,
      },
    },
  ],
  pathPrefix: "/react-hooks",
};

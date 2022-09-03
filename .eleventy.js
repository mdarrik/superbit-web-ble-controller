/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
module.exports = function (eleventyConfig) {
  const siteTitle = "Superbit-rs Bluetooth Control";
  // add the site title to global data
  eleventyConfig.addGlobalData("siteTitle", siteTitle);
  // set a default for the page title to be the site title.
  // can be overridden using 11ty's data cascade
  eleventyConfig.addGlobalData("pageTitle", siteTitle);

  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/js");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });
  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};

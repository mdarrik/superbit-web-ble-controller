const fs = require("node:fs/promises");
const path = require("node:path");
const postCss = require("postcss");
const postCssOpenProps = require("postcss-jit-props");
const openProps = require("open-props");
const postCssImport = require("postcss-import");

module.exports = async function () {
  try {
    const cssFilePath = path.join("./src/css/index.css");
    const rawCss = await fs.readFile(cssFilePath, "utf-8");
    return await postCss([postCssImport, postCssOpenProps(openProps)]).process(
      rawCss,
      {
        from: cssFilePath,
      }
    );
  } catch (e) {
    console.error(e);
  }
};

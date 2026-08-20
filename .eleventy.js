import htmlmin from "html-minifier-terser"
import path from 'node:path';
import * as sass from 'sass';
import { RenderPlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
	
  // Set directories to pass through to the dist folder
  eleventyConfig.addPassthroughCopy("content/images");
  eleventyConfig.addPassthroughCopy("content/lisences");
  eleventyConfig.addPassthroughCopy("css/fonts");

  
  return {
  // This makes sure HTML files use Nunjucks
    htmlTemplateEngine: "njk",
    dir: {
    input: "content",
    output: "public",
    },
  };

  eleventyConfig.addExtension('scss', {
	outputFileExtension: 'css',
	useLayouts: false,
	compile: async function (inputContent, inputPath) {
		let parsed = path.parse(inputPath);
		// Don’t compile file names that start with an underscore
		if (parsed.name.startsWith('_')) {
			return;
		}

		const compiled = sass.compileString(inputContent, {
			loadPaths: [parsed.dir || '.', this.config.dir.includes]
		});

		// Map dependencies for incremental builds
		this.addDependencies(inputPath, compiled.loadedUrls);

		return async (data) => {
			return compiled.css;
		};
	},
    
  });
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addTemplateFormats('scss');

  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });
      return minified;
    }
    return content;
  });

}

export const config = {
	markdownTemplateEngine: 'njk',
	htmlTemplateEngine: 'njk',
};
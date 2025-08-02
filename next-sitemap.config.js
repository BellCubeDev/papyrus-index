/* eslint-disable require-unicode-regexp */
/**
 * Returns the type of path for sitemap generation.
 * @param {string} path - The path to check. Formatted similarly to /mods/abcdef-ghi-jklmnop.
 */
function getPathType(path) {
	if (path.match(/^\/[^/]+\/script\/[^/]+\/(?:function|event|struct|property)\/[^/]+\/$/)) return 'data-piece';

	if (path.match(/^\/[^/]+\/script\/[^/]+\/$/)) return 'script';

	if (path.match(/^\/[^/]+\/$/)) return 'game';

	if (path.match(/^\/$/)) return 'home';

	return 'unknown';
}

/** @type {import('next-sitemap').IConfig} */
export default {
	siteUrl: 'https://papyrus.bellcube.dev',
	output: 'export',
	changefreq: 'monthly',
	sitemapSize: 5000,
	outDir: 'out',
	generateIndexSitemap: true,
	generateRobotsTxt: true,
	exclude: [
		'/404/',
	],
	transform: (config, path) => {
		/** @type {number} */
		let priority;
		switch (getPathType(path)) {
			case 'data-piece':
				priority = 0.9;
				break;
			case 'script':
				priority = 0.5;
				break;
			case 'game':
				priority = 0.3;
				break;
			case 'home':
				priority = 0.1;
				break;
			case 'unknown':
				priority = 0.1;
				break;
			default:
				throw new Error(`Unknown path type for ${path}: "${getPathType(path)}"`);
		}

		return {
			loc: path,
			changefreq: config.changefreq,
			priority,
			lastmod: new Date().toISOString(),
			trailingSlash: true,
		};
	}
};

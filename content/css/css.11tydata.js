export default {
	permalink: function (data) {
		// Don't write our critical included styles to the output directory
		const criticalStyles = [ "critical" ];
		if (criticalStyles.includes(data.page.fileSlug)) {
			return false;
		}
	},
};
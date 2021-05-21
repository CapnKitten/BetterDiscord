window.onload = function () {
	if (!window.location.search)
		document.write('No parameters selected');
	else {
		const urlParams = new URLSearchParams(window.location.search);
		const theme = urlParams.get('theme'),
			plugin = urlParams.get('plugin'),
			addon = urlParams.get('addon');
		var url;

		if (!urlParams) {
			document.write('No file selected');
		} else {
			if (theme) {
				if (addon)
					url = `https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Themes/${theme}/css/addons/${theme}_addon-${addon}.theme.css`;
				else
					url = `https://raw.githubusercontent.com/CapnKitten/${theme}/master/${theme}.theme.css`;

			} else if (plugin)
				url = `https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/${plugin}/${plugin}.plugin.js`;

			const xhttp = new XMLHttpRequest();
			xhttp.onload = function() {
				if (this.status == 200) {
					const link = document.createElement('a');
					link.href = window.URL.createObjectURL(
						new Blob(
							[this.response],
							{type: `text/${url.split('.').pop()}`}
						)
					);
					link.download = url.split('/').pop();
					link.click();
				}

				if (this.status == 404)
					document.write(`The file you are requesting does not exist.`);
			};

			xhttp.open('GET', url, false);
			xhttp.send();
		}
	}
};
window.onload = function () {
	if (!window.location.search)
		error('No parameters');
	else {
		const urlParams = new URLSearchParams(window.location.search);
		const theme = urlParams.get('theme');
		const addon = urlParams.get('addon');
		var url;

		if (!theme) {
			document.write('No theme selected');
		} else {
			if (addon)
				url = `https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Themes/${theme}/css/addons/${addon}.theme.css`;
			else
				url = `https://raw.githubusercontent.com/CapnKitten/${theme}/master/${theme}.theme.css`;

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
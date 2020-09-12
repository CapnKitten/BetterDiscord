/**
 * @name HideChannels
 * @displayName HideChannels
 * @authorId 405126960902176768
 * @website https://github.com/CapnKitten
 * @source https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/HideChannels/HideChannels.plugin.js
 * @donate https://paypal.me/capnkitten
 */

var HideChannels = (_ => {
	const buttonName = 'toggleChannels',
		buttonHideName = 'channelsVisible',
		buttonShowName = 'channelsHidden',
		hideElementsName = 'hideElement',
		targetElement = '.children-19S4PO',
		sidebarName = '.sidebar-2K8pFh';

	const settingsVersion = '1.0.3';

	const pluginCSS = `
		#toggleChannels { position: absolute; width: 24px; height: 24px; top: 0; left: 8px; bottom: 0; margin: auto 0; background-position: center; background-size: 100%; opacity: 0.8; z-index: 2; cursor: pointer; }

		#toggleChannels.channelsVisible { background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiIgd2lkdGg9IjE4cHgiIGhlaWdodD0iMThweCI+PHBhdGggZD0iTTE4LjQxIDE2LjU5TDEzLjgyIDEybDQuNTktNC41OUwxNyA2bC02IDYgNiA2ek02IDZoMnYxMkg2eiIvPjxwYXRoIGQ9Ik0yNCAyNEgwVjBoMjR2MjR6IiBmaWxsPSJub25lIi8+PC9zdmc+); }

		#toggleChannels.channelsHidden { background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiIgd2lkdGg9IjE4cHgiIGhlaWdodD0iMThweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTUuNTkgNy40MUwxMC4xOCAxMmwtNC41OSA0LjU5TDcgMThsNi02LTYtNnpNMTYgNmgydjEyaC0yeiIvPjwvc3ZnPg==); }

		.hideElement { width: 0 !important; }

		.sidebar-2K8pFh .container-3baos1 { transition: 400ms ease all; }

		.sidebar-2K8pFh.hideElement .container-3baos1 { position: absolute; width: 240px; height: 68px; bottom: 0; margin-bottom: 0; z-index: 2; }

		.sidebar-2K8pFh.hideElement .container-3baos1 { background-color: var(--background-primary); }

		.sidebar-2K8pFh + .chat-3bRxxu .messagesWrapper-1sRNjr + .form-2fGMdU { margin-left: 0; transition: 400ms ease margin-left; }

		.sidebar-2K8pFh.hideElement + .chat-3bRxxu .messagesWrapper-1sRNjr + .form-2fGMdU { margin-left: 240px; }

		.sidebar-2K8pFh, .hideElement { transition: width 400ms ease; }

		.children-19S4PO { padding-left: 24px; }`;

	return class HideChannels {
		getName() {return "HideChannels";}
		getVersion() {return "1.0.3";}
		getAuthor() {return "CapnKitten";}
		getDescription() {return "Allows you to hide the channels list in servers and DMs";}

		constructor() {
			this.initialized = false;
		}

		load() {}

		start() {
			if (!global.ZeresPluginLibrary)
				return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);

			ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/HideChannels/HideChannels.plugin.js");

			let libraryScript=document.getElementById('ZLibraryScript');

			if (typeof window.ZLibrary==="object")
				this.initialize();
			else 
				libraryScript.addEventListener('load',()=> this.initialize());
		}

		initialize () {
			this.loadSettings();
			this.addToggleButton();
			this.addExtras();
			this.initialized = true;
		}

		onSwitch() {
			this.addToggleButton();
		}

		stop() {
			this.removeSettings();
			this.initialized = false;
		}

		addToggleButton() {
			const target = document.querySelector(targetElement),
				button = document.createElement('div'),
				settings = this.loadSettings();

			button.setAttribute('id', buttonName);

			if (settings.channels_hidden == 'true')
				button.classList.add(buttonShowName);
			else if (settings.channels_hidden == 'false')
				button.classList.add(buttonHideName);
			else
				button.classList.add(buttonHideName);

			target.parentNode.insertBefore(button, target.nextSibling);

			let buttonAction = document.getElementById(buttonName);
			buttonAction.addEventListener('click', ()=> this.toggleChannels());
		}

		addExtras() {
			let style = document.createElement('style');
			style.id = this.getName() + 'CSS';
			style.innerHTML = pluginCSS;

			document.head.appendChild(style);

			const settings = this.loadSettings(),
				sidebar = document.querySelector(sidebarName);
			if (settings.channels_hidden == 'true') {
				setTimeout(function() {
					sidebar.classList.add(hideElementsName);
				}, 2500);
			}
		}

		toggleChannels() {
			var button = document.querySelector('#' + buttonName),
				sidebar = document.querySelector(sidebarName);

			if (button.classList.contains(buttonHideName)) {
				button.classList.add(buttonShowName);
				button.classList.remove(buttonHideName);

				sidebar.classList.add(hideElementsName);

				this.saveSettings('true');
			} else if (button.classList.contains(buttonShowName)) {
				button.classList.add(buttonHideName);
				button.classList.remove(buttonShowName);

				sidebar.classList.remove(hideElementsName);

				this.saveSettings('false');
			}
		}

		loadSettings() {
			BdApi.loadData(this.getName(), 'config')
			var settings = (BdApi.loadData(this.getName(), 'config')) ? JSON.parse(BdApi.loadData(this.getName(), 'config')) : {version:'0'};
			if (settings.version != this.settingsVersion) {
				console.log('['+this.getName()+'] Settings were outdated/invalid/nonexistent. Using default settings.');
				settings = this.defaultSettings();
				BdApi.saveData(this.getName(), 'config', JSON.stringify(settings));
			}

			return settings;
		}

		saveSettings(status) {
			const settings = this.loadSettings();

			settings.channels_hidden = status;
			BdApi.saveData(this.getName(), 'config', JSON.stringify(settings));
		}

		defaultSettings() {
			return {
				version: this.settingsVersion,
				channels_hidden: 'false'
			};
		}

		removeSettings() {
			document.getElementById(buttonName).remove();

			const sidebar = document.querySelector(targetElement);

			if (sidebar.classList.contains(hideElementsName))
				sidebar.classList.remove(hideElementsName);

			if (document.getElementById(this.getName() + 'CSS'))
				document.head.removeChild(document.getElementById(this.getName() + 'CSS'));
		}
	}

})();

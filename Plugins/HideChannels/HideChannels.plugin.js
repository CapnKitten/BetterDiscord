/**
 * @name HideChannels
 * @displayName HideChannels
 * @authorId 405126960902176768
 * @website https://github.com/CapnKitten
 * @source https://raw.githubusercontent.com/CapnKitten/BetterDiscord/tree/master/Plugins/HideChannels/HideChannels.plugin.js
 * @donate https://paypal.me/capnkitten
 */

var HideChannels = (_ => {
	var buttonName = 'toggleChannels', buttonHideName = 'channelsVisible', buttonShowName = 'channelsHidden', hideElementsName = 'hideElement';
	var targetElement = '.children-19S4PO';
	var settingsVersion = '1.0.1';

	var pluginCSS = `
		#toggleChannels {
			position: absolute;
			width: 24px;
			height: 24px;
			top: 0;
			left: 8px;
			bottom: 0;
			margin: auto 0;
			background-position: center;
			background-size: 100%;
			opacity: 0.8;
			z-index: 2;
			cursor: pointer;
		}

		#toggleChannels.channelsVisible {
			background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiIgd2lkdGg9IjE4cHgiIGhlaWdodD0iMThweCI+PHBhdGggZD0iTTE4LjQxIDE2LjU5TDEzLjgyIDEybDQuNTktNC41OUwxNyA2bC02IDYgNiA2ek02IDZoMnYxMkg2eiIvPjxwYXRoIGQ9Ik0yNCAyNEgwVjBoMjR2MjR6IiBmaWxsPSJub25lIi8+PC9zdmc+);
		}

		#toggleChannels.channelsHidden {
			background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiIgd2lkdGg9IjE4cHgiIGhlaWdodD0iMThweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTUuNTkgNy40MUwxMC4xOCAxMmwtNC41OSA0LjU5TDcgMThsNi02LTYtNnpNMTYgNmgydjEyaC0yeiIvPjwvc3ZnPg==);
		}

		.hideElement {
			width: 0 !important;
		}

		.sidebar-2K8pFh .container-3baos1 {
			transition: 400ms ease all;
		}

		.sidebar-2K8pFh.hideElement .container-3baos1 {
			position: absolute;
			width: 240px;
			height: 68px;
			bottom: 0;
			margin-bottom: 0;
			z-index: 2;
		}

		.sidebar-2K8pFh.hideElement .container-3baos1,
		.form-2fGMdU {
			background-color: var(--background-primary);
		}

		.sidebar-2K8pFh + .chat-3bRxxu .messagesWrapper-1sRNjr + .form-2fGMdU {
			margin-left: 0;
			transition: 400ms ease margin-left;
		}

		.sidebar-2K8pFh.hideElement + .chat-3bRxxu .messagesWrapper-1sRNjr + .form-2fGMdU {
			margin-left: 240px;
		}

		.sidebar-2K8pFh,
		.hideElement {
			transition: width 400ms ease;
		}

		.children-19S4PO {
			padding-left: 24px;
		}`;

	return class HideChannels {
		getName() {return "HideChannels";}
		getVersion() {return "1.0.1";}
		getAuthor() {return "CapnKitten";}
		getDescription() {return "Allows you to hide the channels list in servers and DMs";}

		constructor() {
			this.initialized = false;
		}

		load() {}

		start() {
			if (!global.ZeresPluginLibrary)
				return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);

			ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/CapnKitten/BetterDiscord/tree/master/Plugins/HideChannels/HideChannels.plugin.js");

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
			this.initialized = false;
			this.removeSettings();
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
			var settings = this.loadSettings();

			settings.channels_hidden = status;

			BdApi.saveData(this.getName(), 'config', JSON.stringify(settings));
		}

		defaultSettings() {
			return {
				version: this.settingsVersion,
				channels_hidden: 'false'
			};
		}

		addToggleButton() {
			const target = document.querySelector(targetElement);
			const elem = document.createElement('div');

			elem.setAttribute('id', buttonName);

			var settings = this.loadSettings();
			if (settings.channels_hidden == 'true')
				elem.classList.add(buttonShowName);
			else if (settings.channels_hidden == 'false')
				elem.classList.add(buttonHideName);
			else
				elem.classList.add(buttonHideName);

			target.parentNode.insertBefore(elem, target.nextSibling);

			let buttonAction = document.getElementById(buttonName);
			buttonAction.addEventListener('click', ()=> this.toggleChannels());
		}

		addExtras() {
			let style = document.createElement('style');
			style.id = 'HideChannelsCSS';
			style.innerHTML = pluginCSS;

			document.head.appendChild(style);

			var settings = this.loadSettings(),
				sidebar = document.querySelector('.sidebar-2K8pFh');
			if (settings.channels_hidden == 'true') {
				setTimeout(function() {
					sidebar.classList.add(hideElementsName);
				}, 2500);
			}
		}

		toggleChannels() {
			var element = document.querySelector('#'+buttonName),
				sidebar = document.querySelector('.sidebar-2K8pFh'),
				panels = document.querySelector('.panels-j1Uci_'); 

			if (element.classList.contains(buttonHideName)) {
				element.classList.add(buttonShowName);
				element.classList.remove(buttonHideName);

				sidebar.classList.add(hideElementsName);

				this.saveSettings('true');
			} else if (element.classList.contains(buttonShowName)) {
				element.classList.add(buttonHideName);
				element.classList.remove(buttonShowName);

				sidebar.classList.remove(hideElementsName);

				this.saveSettings('false');
			}
		}

		removeSettings() {
			document.getElementById(buttonName).remove();

			var sidebar = document.querySelector(targetElement);

			if (sidebar.classList.contains(hideElementsName))
				sidebar.classList.remove(hideElementsName);

			if (document.getElementById('HideChannelsCSS'))
				document.head.removeChild(document.getElementById('HideChannelsCSS'));
		}
	}

})();

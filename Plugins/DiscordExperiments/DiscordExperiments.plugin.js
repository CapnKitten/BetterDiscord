/**
 * @name DiscordExperiments
 * @displayName DiscordExperiments
 * @authorId 405126960902176768
 * @website https://github.com/CapnKitten
 * @source https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/DiscordExperiments/DiscordExperiments.plugin.js
 * @donate https://paypal.me/capnkitten
 * @invite jzJkA6Z
 */

/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else@*/

module.exports = (() => {
	const config = {
		info: {
			name: "DiscordExperiments",
			authors: [
				{
					name: "CapnKitten",
					discord_id: "405126960902176768",
					github_username: "CapnKitten"
				}
			],
			version: "1.0.3",
			description: "Enables Discord experiments",
			github: "https://github.com/CapnKitten/BetterDiscord/blob/master/Plugins/DiscordExperiments/DiscordExperiments.plugin.js",
			github_raw: "https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/DiscordExperiments/DiscordExperiments.plugin.js"
		}
	};

	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
		getName() { return config.info.name; }
		getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
		getDescription() { return config.info.description; }
		getVersion() { return config.info.version; }
		load() {
			BdApi.showConfirmationModal("Library plugin is needed",
				[`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
				confirmText: "Download",
				cancelText: "Cancel",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
					if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			return class DiscordExperiments extends Plugin {
				onStart() {
					let c; webpackChunkdiscord_app.push([[Symbol()],{},r=>c=r.c]); webpackChunkdiscord_app.pop();
					let u = Object.values(c).find(x=>!x?.exports?.messagesLoader && x?.exports?.default?.getUsers && x?.exports?.default?.getCurrentUser).exports.default;
					let m = Object.values(u._dispatcher._actionHandlers._dependencyGraph.nodes);

					u.getCurrentUser().flags |= 1;
					m.find((x)=>x.name === "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
					try {m.find((x)=>x.name === "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user:{flags: 1}})} catch {};
					m.find((x)=>x.name === "ExperimentStore").storeDidChange();
				}

				stop() {
					BdApi.showConfirmationModal("Refresh Required", "In order to disable Discord Experiments, you must refresh your client.", {
						confirmText: "Refresh",
		                cancelText: "Cancel",
						onConfirm: () => location.reload()
					});
				}
			};
		};

		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();

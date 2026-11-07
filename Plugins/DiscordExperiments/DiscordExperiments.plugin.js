/**
* @name DiscordExperiments
* @author CapnKitten
* @version 1.0.1
* @description Enables Discord Experiments.
* @authorId 124276233478471680
* @website https://github.com/CapnKitten
* @source https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/DiscordExperiments/DiscordExperiments.plugin.js
* @donate https://paypal.me/capnkitten
* @invite jzJkA6Z
*/

const config = {
    info: {
        name: "DiscordExperiments",
        version: "1.0.1",
        description: "Enables Discord Experiments."
    },
    changelog: [
        {
            type: "fixed",
            title: "Plugin Working Again",
            items: [
                "Discord Experiments is working once again after the Discord update."
            ]
        }
    ]
};

module.exports = class DiscordExperiments {
	getStores() {
        let c = webpackChunkdiscord_app.push([[Symbol()],{},r=>r.c]);
        webpackChunkdiscord_app.pop();

        let u = Object.values(c).find(x => x?.exports?.default?.__proto__?.getUsers && x?.exports?.default?.getCurrentUser)?.exports?.default;
        let handlers = u._dispatcher._actionHandlers;
        let m = handlers._dependencyGraph ? Object.values(handlers._dependencyGraph.nodes) : Array.from(handlers._nodes.values());

        return { u, m };
    }

	start() {
		const { u, m } = this.getStores();

        this.originalFlags = u.getCurrentUser().flags;
        u.getCurrentUser().flags |= 1;

        m.find(x => x.name === "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
        try { m.find(x => x.name === "ExperimentStore").actionHandler?.["OVERLAY_INITIALIZE"]?.({ user: { flags: 1 } }) } catch {}
        m.find(x => x.name === "ExperimentStore")?.storeDidChange();
    }

    stop() {
		const { u, m } = this.getStores();

        if (this.originalFlags !== undefined) {
            u.getCurrentUser().flags = this.originalFlags;
        } else {
            u.getCurrentUser().flags &= ~1;
        }

        m.find(x => x.name === "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
        try { m.find(x => x.name === "ExperimentStore").actionHandler?.["OVERLAY_INITIALIZE"]?.({ user: { flags: u.getCurrentUser().flags } }) } catch {}
        m.find(x => x.name === "ExperimentStore")?.storeDidChange();
		if (typeof Patcher !== "undefined") Patcher.unpatchAll();
    }
}

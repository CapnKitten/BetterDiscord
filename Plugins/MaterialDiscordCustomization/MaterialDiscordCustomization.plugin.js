/**
 * @name MaterialDiscordCustomization
 * @author CapnKitten
 * @version 1.0.3
 * @description Implements easy customization of the Material Discord theme.
 * @authorId 124276233478471680
 * @website https://github.com/CapnKitten
 * @source https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Plugins/MaterialDiscordCustomization/MaterialDiscordCustomization.plugin.js
 * @donate https://paypal.me/capnkitten
 * @invite jzJkA6Z
 */

const config = {
    info: {
        name: "MaterialDiscordCustomization",
        version: "1.0.3",
        description: "Implements easy customization of the Material Discord theme."
    },
    changelog: [
        {
            type: "added",
            title: "Slider Legends",
            items: [
                "Added the unit type to the slider legends."
            ]
        },
        {
            type: "added",
            title: "Missing Variable",
            items: [
                "Due to the accent text color variable not being customizable with Material You enabled, it was mistakenly left out. It has now been added for those that use just the base theme."
            ]
        }
    ]
};

const { DOM, Webpack, UI, React, Patcher, Utils, Data } = new BdApi(config.info.name);
const { Filters } = Webpack;

const Slider = Webpack.getModule(m => Filters.byKeys("stickToMarkers", "initialValue")(m?.defaultProps), { searchExports: true });
const Button = Webpack.getModule(Filters.byKeys("Link", "Sizes"), { searchExports: true });
const Flex = Webpack.getModule(Filters.byKeys("Child", "Justify", "Align"), { searchExports: true });

const SETTINGS_CLASSNAME = `${config.info.name}-settings`;

module.exports = class MaterialDiscordCustomization {
    hexToHsl(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        let r = parseInt(result[1], 16),
            g = parseInt(result[2], 16),
            b = parseInt(result[3], 16);

        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min)
            h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return { h, s, l };
    }

    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const k = (n) => (n + h / 30) % 12,
            a = s * Math.min(l, 1 - l),
            f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));

        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        const r = toHex(f(0)),
            g = toHex(f(8)),
            b = toHex(f(4));

        return `#${r}${g}${b}`;
    }

    start() {
        this.injectCss();
    }

    stop() {
        Patcher.unpatchAll();
        this.clearCss();
    }

    getSettingsPanel() {
        const ACCENT_HEX_DEFAULT = this.hslToHex(this.defaultSettings.accent.h, this.defaultSettings.accent.s, this.defaultSettings.accent.l);
        const ACCENT_HEX_LOADED = this.hslToHex(this.settings.accent.h, this.settings.accent.s, this.settings.accent.l);

        const markers = (start, stop, step = 1) => Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);
        const confirm = (title, content, options = {}) => BdApi.UI.showConfirmationModal(title, content, options);

        const element = UI.buildSettingsPanel({
            onChange: () => {
                this.saveSettings.bind(this)
            },
            settings: [
                {
                    type: "color",
                    id: "accent",
                    name: "Accent color",
                    note: "The accent color controls the color scheme of the entire UI. Everything will be a variation of this color.",
                    value: ACCENT_HEX_LOADED,
                    defaultValue: ACCENT_HEX_DEFAULT,
                    inline: true,
                    onChange: e => {
                        this.settings["accent"].h = this.hexToHsl(e).h,
                        this.settings["accent"].s = this.hexToHsl(e).s,
                        this.settings["accent"].l = this.hexToHsl(e).l,
                        this.saveAndRefresh()
                    }
                },
                {
                    type: "color",
                    id: "accent",
                    name: "Accent text color",
                    note: "The color of text in elements such as accent filled buttons. Note: this does not do anything with Material You enabled.",
                    value: this.settings["accent"].textColor,
                    defaultValue: this.defaultSettings["accent"].textColor,
                    inline: true,
                    onChange: e => {
                        this.settings["accent"].textColor = e,
                        this.saveAndRefresh()
                    }
                },
                {
                    type: "category",
                    id: "dark",
                    name: "Dark theme",
                    collapsible: true,
                    shown: false,
                    settings: [
                        {
                            type: "custom",
                            id: "saturationModifier",
                            name: "Saturation modifier",
                            note: "The modifier number used to calculate the overall saturation of the UI. Default: 0.3",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 100,
                                maxValue: 1000,
                                markers: markers(25, 1001, 25),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 200 === 0 || v === 25 ? (v / 1000).toFixed(2) : "",
                                initialValue: this.settings["dark"].saturationModifier,
                                onValueChange: e => {
                                    this.settings["dark"].saturationModifier = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "lightnessModifier",
                            name: "Lightness modifier",
                            note: "The modifier number used to calculate the overall lightness of the UI. Default: 0.225",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 200,
                                maxValue: 1000,
                                markers: markers(200, 1001, 25),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 200 === 0 || v === 25 ? (v / 1000).toFixed(2) : "",
                                initialValue: this.settings["dark"].lightnessModifier,
                                onValueChange: e => {
                                    this.settings["dark"].lightnessModifier = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "textLightnessModifier",
                            name: "Text lightness modifier",
                            note: "The modifier number used to calculate the lightness of text. Default: 1.0",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 500,
                                maxValue: 2000,
                                markers: markers(500, 2001, 100),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 250 === 0 || v === 100 ? (v / 1000).toFixed(1) : "",
                                initialValue: this.settings["dark"].textLightnessModifier,
                                onValueChange: e => {
                                    this.settings["dark"].textLightnessModifier = e,
                                    this.saveAndRefresh()
                                }
                            })
                        }
                    ]
                },
                {
                    type: "category",
                    id: "light",
                    name: "Light theme",
                    collapsible: true,
                    shown: false,
                    settings: [
                        {
                            type: "custom",
                            id: "saturationModifier",
                            name: "Saturation modifier",
                            note: "The modifier number used to calculate the overall saturation of the UI. Default: 0.75",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 100,
                                maxValue: 1000,
                                markers: markers(25, 1001, 25),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 200 === 0 || v === 25 ? (v / 1000).toFixed(2) : "",
                                initialValue: this.settings["light"].saturationModifier,
                                onValueChange: e => {
                                    this.settings["light"].saturationModifier = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "lightnessModifier",
                            name: "Lightness modifier",
                            note: "The modifier number used to calculate the overall lightness of the UI. Default: 2.125",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 1500,
                                maxValue: 2500,
                                markers: markers(1500, 2501, 25),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 100 === 0 || v === 25 ? (v / 1000).toFixed(2) : "",
                                initialValue: this.settings["light"].lightnessModifier,
                                onValueChange: e => {
                                    this.settings["light"].lightnessModifier = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                    ]
                },
                {
                    type: "category",
                    id: "button",
                    name: "Buttons",
                    collapsible: true,
                    shown: false,
                    settings: [
                        {
                            type: "custom",
                            id: "height",
                            name: "Button height",
                            note: "The height of buttons. Default: 40px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 24,
                                maxValue: 48,
                                markers: [24, 32, 40, 48],
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["button"].height,
                                onValueChange: e => {
                                    this.settings["button"].height = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "radius",
                            name: "Button radius",
                            note: "The radius of buttons. Default: 20px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 4,
                                maxValue: 24,
                                markers: [4, 8, 12, 16, 20, 24],
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["button"].radius,
                                onValueChange: e => {
                                    this.settings["button"].radius = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "padding",
                            name: "Button padding",
                            note: "The side padding of buttons. Default: 16px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 8,
                                maxValue: 32,
                                markers: [8, 12, 16, 20, 24, 28, 32],
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["button"].padding,
                                onValueChange: e => {
                                    this.settings["button"].padding = e,
                                    this.saveAndRefresh()
                                }
                            })
                        }
                    ]
                },
                {
                    type: "category",
                    id: "message",
                    name: "Messages",
                    collapsible: true,
                    shown: false,
                    settings: [
                        {
                            type: "custom",
                            id: "radius",
                            name: "Message radius",
                            note: "The radius of message bubbles. Default: 18px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 32,
                                markers: markers(0, 33, 2),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["message"].radius,
                                onValueChange: e => {
                                    this.settings["message"].radius = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "paddingTop",
                            name: "Message top padding",
                            note: "The padding for the top and bottom of messages bubbles. Default: 8px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 24,
                                markers: markers(0, 25, 2),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["message"].paddingTop,
                                onValueChange: e => {
                                    this.settings["message"].paddingTop = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "paddingSide",
                            name: "Message side padding",
                            note: "The padding for the sides of messages bubbles. Default: 12px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 24,
                                markers: markers(0, 25, 2),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["message"].paddingSide,
                                onValueChange: e => {
                                    this.settings["message"].paddingSide = e,
                                    this.saveAndRefresh()
                                }
                            })
                        }
                    ]
                },
                {
                    type: "category",
                    id: "card",
                    name: "Cards",
                    collapsible: true,
                    shown: false,
                    settings: [
                        {
                            type: "custom",
                            id: "radiusSmall",
                            name: "Card small radius",
                            note: "The radius for cards that use the smaller radius. Default: 8px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 32,
                                markers: markers(0, 33, 2),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["card"].radiusSmall,
                                onValueChange: e => {
                                    this.settings["card"].radiusSmall = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "radiusBig",
                            name: "Card big radius",
                            note: "The radius for cards that use the larger radius. This is what you'll see used on most cards. Default: 18px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 48,
                                markers: markers(0, 49, 3),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["card"].radiusBig,
                                onValueChange: e => {
                                    this.settings["card"].radiusBig = e,
                                    this.saveAndRefresh()
                                }
                            })
                        }
                    ]
                },
                {
                    type: "category",
                    id: "popout",
                    name: "Popouts",
                    collapsible: true,
                    shown: false,
                    settings: [
                        {
                            type: "custom",
                            id: "radiusSmall",
                            name: "Popout small radius",
                            note: "The radius for popouts that use the smaller radius. Default: 8px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 32,
                                markers: markers(0, 33, 1),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 4 === 0 || v === 4 ? v + "px" : "",
                                initialValue: this.settings["popout"].radiusSmall,
                                onValueChange: e => {
                                    this.settings["popout"].radiusSmall = e,
                                    this.saveAndRefresh()
                                }
                            })
                        },
                        {
                            type: "custom",
                            id: "radiusBig",
                            name: "Popout big radius",
                            note: "The radius for popouts and modals that use the larger radius. Default: 18px",
                            inline: false,
                            children: React.createElement(Slider, {
                                minValue: 0,
                                maxValue: 48,
                                markers: markers(0, 49, 2),
                                stickToMarkers: true,
                                onMarkerRender: v => v % 6 === 0 || v === 6 ? v + "px" : "",
                                initialValue: this.settings["popout"].radiusBig,
                                onValueChange: e => {
                                    this.settings["popout"].radiusBig = e,
                                    this.saveAndRefresh()
                                }
                            })
                        }
                    ]
                }
            ]
        });

        const resetButton = React.createElement(Flex, { justify: Flex.Justify.END },
            React.createElement(Button, {
                size: Button.Sizes.SMALL,
                onClick: () => confirm("Reset Settings?", "This will reset your Material Discord customizations back to their default settings.", {
                    onConfirm: () => {
                        this.settings = this.defaultSettings,
                        this.saveAndRefresh()
                    }
                })
            }, "Reset settings"));

        return (React.createElement(
            "div",
            { className: SETTINGS_CLASSNAME },
            element,
            resetButton
        ))
    }

    saveAndRefresh() {
        this.saveSettings();
        this.injectCss();
    }

    injectCss() {
        this.PLUGIN_STYLE_ID = `${config.info.name}CSS`;
        DOM.addStyle(this.PLUGIN_STYLE_ID, `
            :root {
                --accent-hue: ${this.settings.accent.h} !important;
                --accent-saturation: ${this.settings.accent.s}% !important;
                --accent-lightness: ${this.settings.accent.l}% !important;
                --accent-text-color: ${this.settings.accent.textColor} !important;

                --button-height: ${this.settings.button.height}px !important;
                --button-radius: ${this.settings.button.radius}px !important;
                --button-padding: ${this.settings.button.padding}px !important;

                --message-radius: ${this.settings.message.radius}px !important;
                --message-padding-top: ${this.settings.message.paddingTop}px !important;
                --message-padding-top: ${this.settings.message.paddingSide}px !important;

                --card-radius-small: ${this.settings.card.radiusSmall}px !important;
                --card-radius-big: ${this.settings.card.radiusBig}px !important;

                --popout-radius-small: ${this.settings.popout.radiusSmall}px !important;
                --popout-radius-big: ${this.settings.popout.radiusBig}px !important;
            }

            .theme-dark {
                --saturation-modifier: ${this.settings.dark.saturationModifier / 1000} !important;
                --lightness-modifier: ${this.settings.dark.lightnessModifier / 1000} !important;
                --text-lightness-modifier: ${this.settings.dark.textLightnessModifier / 1000} !important;
            }

            .theme-dark.theme-darker {
                --text-lightness-modifier: 1.75 !important;
                --ui-darkness-modifier: 0.55 !important;
            }

            .theme-dark.theme-midnight {
                --text-lightness-modifier: 9.8 !important;
                --ui-darkness-modifier: 0.10 !important;
            }

            .theme-light {
                --saturation-modifier: ${this.settings.light.saturationModifier / 1000} !important;
                --lightness-modifier: ${this.settings.light.lightnessModifier / 1000} !important;
            }
        `);
    }

    clearCss() {
        DOM.removeStyle(this.PLUGIN_STYLE_ID);
    }

    constructor() {
        this.defaultSettings = {
            accent: {
                h: 224,
                s: 71,
                l: 61,
                textColor: "#ffffff"
            },
            dark: {
                saturationModifier: 300,
                lightnessModifier: 225,
                textLightnessModifier: 1000
            },
            light: {
                saturationModifier: 750,
                lightnessModifier: 2125,
            },
            button: {
                height: 40,
                radius: 20,
                padding: 16
            },
            message: {
                radius: 18,
                paddingTop: 8,
                paddingSide: 12
            },
            card: {
                radiusSmall: 8,
                radiusBig: 18
            },
            popout: {
                radiusSmall: 8,
                radiusBig: 18
            }
        }

        this.settings = this.loadSettings(this.defaultSettings);
    }

    loadSettings(defaults = {}) {
        return Utils.extend({}, defaults, Data.load("settings"));
    }

    saveSettings(settings = this.settings) {
        return Data.save("settings", settings);
    }
}

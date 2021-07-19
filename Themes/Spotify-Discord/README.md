# Spotify Discord Theme - [![Paypal][paypal-logo]][paypal-url] [![GitHub][github-logo]][github-url] [![Discord][discord-logo]][discord-url] [![Download][download-logo]][download-url] 
#### Combine Discord and Spotify into one
<hr>

Current version: v1.4.2 (26/02/2021)

[View add-on themes](https://github.com/CapnKitten/BetterDiscord/tree/master/Themes/Spotify-Discord/css/addons)

<hr>

This theme works best with the plugin called [SpotifyControls](https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/SpotifyControls) by DevilBro. To get it up and working, make sure your Spotify account is linked to your Discord account then download the plugin [here](https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/SpotifyControls) or from the plugin repo.

## Previews

(Previews are subject to be out of date)

#### Main chat area

![discord_101](https://user-images.githubusercontent.com/4013216/120567756-77818680-c3e0-11eb-91d4-20709163ee69.png)

#### User server info

![discord_102](https://user-images.githubusercontent.com/4013216/120567773-7f412b00-c3e0-11eb-8cb6-6dad10b145c5.png)

#### User info popout

![discord_103](https://user-images.githubusercontent.com/4013216/120567785-85cfa280-c3e0-11eb-85f7-0bdf5cad90b1.png)

#### User settings

![discord_104](https://user-images.githubusercontent.com/4013216/120567799-89fbc000-c3e0-11eb-9c17-126747382c7f.png)

![discord_105](https://user-images.githubusercontent.com/4013216/120567808-8f590a80-c3e0-11eb-8053-dc9f63e8471c.png)

#### Friends list

![discord_106](https://user-images.githubusercontent.com/4013216/120567817-954eeb80-c3e0-11eb-8965-a4ee9fa83537.png)

&nbsp;

## Custom server title bar colors
To change the title bar color for specific servers, you must download the redesign add-on theme file [here](https://github.com/CapnKitten/BetterDiscord/tree/master/Themes/Spotify-Discord/css/addons/redesign), and place the code below in the add-on theme file or your custom CSS and change the server name and hex color code to your liking.
```css
.container-3w7J-x[aria-label*="SERVER_NAME"]:before {
  --title-custom: #3b77c4;
}
```

## Variables

 - `--input-color` - The background color for the input and textarea elements
 - `--input-text-color` - The text color for the input and textarea elements
 - `--input-placeholder-color` - The placeholder text color for the input and textarea elements

&nbsp;

## Changelog

#### v1.4.0 (03/01/2021)
* UI colors slightly updated to match Spotify's colors
* User avatar and status in the bottom bar moved to the left to take up dead space
* Chat box buttons fixed
* New radio buttons styled
* Other various elements fixed


[View previous changelogs](https://github.com/CapnKitten/BetterDiscord/blob/master/Themes/Spotify-Discord/changelog.md)

[paypal-logo]: https://img.shields.io/static/v1?label=PayPal&message=Donate&style=flat&logo=paypal&color=blue
[paypal-url]: https://paypal.me/capnkitten

[github-logo]: https://img.shields.io/static/v1?label=GitHub&message=Sponsor&style=flat&logo=github&color=black
[github-url]: https://github.com/sponsors/CapnKitten

[download-logo]: https://img.shields.io/static/v1?label=Download&message=Theme&style=flat&color=blue
[download-url]: https://capnkitten.github.io/BetterDiscord/Download/?theme=Spotify-Discord

[discord-logo]: https://img.shields.io/static/v1?label=Discord&message=Server&style=flat&logo=discord&color=blue
[discord-url]: https://discord.gg/jzJkA6Z

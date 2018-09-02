//META{"name":"MaterialDiscordRipple"}*//

class MaterialDiscordRipple {
	getName() {return "Material Discord Ripple";}
	getDescription() {return "Adds the Material Design ripple effect to buttons";}
	getVersion() {return "1.0";}
	getAuthor() {return "CapnKitten";}
	getLink() {
		return 'https://raw.githubusercontent.com/CapnKitten/BetterDiscord/master/Material-Discord-Ripple/MaterialDiscordRipple.plugin.js?v=1.0'
    }

	constructor() {
		this.initialized = false;
		this.buttons = '.lookFilled-1Gx00P, .lookOutlined-3sRXeN, .closeButton-1tv5uR, .iconButtonDefault-2cKx7-, .lookBlank-3eh9lL, .iconMargin-2YXk4F';
	}

	load() {}

	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (!libraryScript) {
			libraryScript = document.createElement('script');
			libraryScript.setAttribute('type', 'text/javascript');
			libraryScript.setAttribute('src', 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js');
			libraryScript.setAttribute('id', 'zeresLibraryScript');
			document.head.appendChild(libraryScript);
		}

		if (typeof window.ZeresLibrary !== 'undefined') 
			this.initialize();
		else libraryScript.addEventListener('load', () => {
			this.initialize();
		});
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), this.getLink());
		this.addRipple();
		this.initialized = true;
	}

	addRipple() {
		$('<div class="md-ripple"></div>').appendTo(this.buttons);

		$(this.buttons).mousedown(function(e) {
			$(this).children('.md-ripple').addClass('is-visible');

			var x = e.pageX - $(this).offset().left;
			var y = e.pageY - $(this).offset().top;
			var size;

			size = Math.sqrt(Math.pow($(this).outerHeight(), 2) + Math.pow($(this).outerWidth(), 2)); 

			$('.md-ripple').css({
				width: size * 2,
				height: size * 2,
				marginLeft: '-' + size + 'px',
				marginTop: '-' + size + 'px',
				left: x,
				top: y
			}).addClass('animate');
		});

		$('html, body').mouseup(function() {
			$('.md-ripple').removeClass('is-visible');

			setTimeout(function() { 
				$('.md-ripple').removeClass('animate');
			}, 400);

			return false;
		});

		/*$(this.buttons).on('click', function() {
			return false;
		});*/
	}

	stop() {
		this.initialized = false;
		$('.md-ripple').remove();
	}

	observer(changes) {}
}

PhotoTab = function() {

	this.CLIENT_ID = 'e93cb714fd35495691271c8230693731';
	// this.EXTENSION_URL = chrome.extension.getURL( '/' );
	this.REDIRECT_URL = chrome.identity.getRedirectURL( '/' );

	this.ACCESS_TOKEN = false;


	/**
	 * Initialize the extension
	 * @return null
	 */
	this.init = function() {

		this.ACCESS_TOKEN = this.get_token();

		if( this.ACCESS_TOKEN ) {

			this.bind_events();

		}

	};

	this.bind_events = function() {

		var _this = this;

		document.getElementById( 'auth-button' ).onclick = function() {

			chrome.identity.launchWebAuthFlow( {
				url: 'https://instagram.com/oauth/authorize/?client_id=' + _this.CLIENT_ID + '&redirect_uri=' + encodeURIComponent( _this.REDIRECT_URL ) + '&response_type=token',
				interactive: true
			}, function( response_url ) {

				var access_token = response_url.substring( response_url.indexOf( '=' ) + 1 );

				_this.save( { access_token : access_token } );

			});

		};

	};



	/**
	 * Attempt to load the Instagram Access Token from chrome storage
	 * @return mixed
	 */
	this.get_token = function() {

		var _this = this;

		chrome.storage.sync.get( 'access_token', function( items ) {

			if( items.acces_token ) {

				return items.access_token;

			}

		} );

		return false;

	};


	/**
	 * Save objects to chrome storage
	 * @param  {object} obj    key: val pairs to save to storage
	 * @return null
	 */
	this.save = function( obj ) {

		chrome.storage.sync.set( obj , function() {
			// Notify that we saved.
			console.log( 'saved' );
		});

	};



	this.init();

	return this;

};


new PhotoTab();
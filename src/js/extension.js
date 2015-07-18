/*global chrome */
var PhotoTab = function() {

	this.CLIENT_ID = 'e93cb714fd35495691271c8230693731';

	this.REDIRECT_URL = chrome.identity.getRedirectURL( '/' );

	this.ACCESS_TOKEN = false;

	/**
	 * Initialize the extension
	 * @return null
	 */
	this.init = function() {

		var _this = this;

		this.get_token( function( token ) {

			_this.ACCESS_TOKEN = token;

			_this.bind_events();

			// add an authorized class to the body
			var body_classes = document.body.className,
				auth_class = ( _this.ACCESS_TOKEN ) ? 'authorized' : 'not-authorized';
			document.body.className = body_classes + ' ' + auth_class;

			// console.log( 'Instagram Access Token: ', _this.ACCESS_TOKEN );
			// console.log( 'Extension REDIRECT_URL: ', _this.REDIRECT_URL );


			if( _this.ACCESS_TOKEN ) {

				_this.get_photos();

			}

		});



	};



	this.ajax = {

		// get a new request object
		x: function() {
			return new XMLHttpRequest();
		},

		// format data
		data: function( data ) {
			var query = [],
				key;
			for(key in data) {
				if( data.hasOwnProperty( key ) ) {

					query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));

				}
			}
    		return query;
		},

		// execute an ajax request
		send: function( url, callback, method, data, sync ) {
			sync = ( sync ) ? sync : true;

    		var x = this.x();
    		x.open( method, url, sync );

    		x.onreadystatechange = function() {
    			if( x.readyState === 4 ) {

    				callback( JSON.parse( x.responseText ), x.status, x );

    			}
    		};

			if (method === 'POST') {
				x.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
			}

		    x.send( data );

		},

		// send a get request
		get: function( url, callback, data, sync ) {
			data = this.data( data );
			this.send( url + ( data.length ? '?' + data.join( '&' ) : ''), callback, 'GET', null, sync );
		},

		// send a post request
		post: function( url, callback, data, sync ) {
			data = this.data( data );
			this.send( url, callback, 'POST', data.join('&'), sync );
		}

	};




	this.bind_events = function() {

		var _this = this;

		document.getElementById( 'auth-button' ).onclick = function() {

			chrome.identity.launchWebAuthFlow( {
				url: 'https://instagram.com/oauth/authorize/?client_id=' + _this.CLIENT_ID + '&redirect_uri=' + _this.REDIRECT_URL + '&response_type=token',
				interactive: true
			}, function( response_url ) {

				var access_token = response_url.substring( response_url.indexOf( '=' ) + 1 );

				_this.save( { access_token : access_token } );

			});

		};

	};


	this.get_photos = function() {

		var _this = this;

		this.ajax.get( 'https://api.instagram.com/v1/users/self/feed', function( r, status ){

			console.log( status );
			if( status === 200 ) {

				console.log( r );

				_this.get_template( 'photos', r, function( html ) {

					document.getElementById( 'photo-grid' ).innerHTML += html;

				} );

			}

		}, { access_token: _this.ACCESS_TOKEN } );

	};


	this.get_template = function( template, context, cb ) {

		var iframe = document.getElementById( 'templates' ),
			message = {
				command: 'render',
				template: template,
				context: context
			};

		// send a message to the iframe to trigger template compilation
		iframe.contentWindow.postMessage( message, '*' );

		// when compiled template is returned, pass it back to the callback
		window.addEventListener( 'message', function ( e ) {

			cb( e.data.html );

		} );

	};


	/**
	 * Attempt to load the Instagram Access Token from chrome storage
	 * @return mixed
	 */
	this.get_token = function( cb ) {

		chrome.storage.sync.get( 'access_token', function( items ) {

			if( items.access_token ) {

				cb( items.access_token );
				return;
			}

			cb( false );

		} );

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
/*global Handlebars */

/**
 * Handle Handlebars template compiling
 *
 * @source https://developer.chrome.com/apps/sandboxingEval
 */


//=require vendor/handlebars.js

var
	// setup an object of compiled templates to
	templates = {},

	// get all templates in the iframe
	sources = document.querySelectorAll( 'script[type="text/x-handlebars-template"]' ),
	source;

// loop through templates
for( source in sources ) {

	if( sources.hasOwnProperty( source ) ) {

		// only process objects
		if( typeof sources[source] !== 'object' ) {
			continue;
		}

		// compile the templates
		templates[ sources[source].id ] = Handlebars.compile( sources[source].innerHTML );

	}

}

window.addEventListener('message', function( event ) {

	console.log( event );

	var cmd = event.data.command,
		template = event.data.template;

	switch( cmd ) {

		case 'render':

			event.source.postMessage( {

				template: event.data.template,
				html: templates[ template ]( event.data.context )

			}, event.origin );

		break;

	}

});
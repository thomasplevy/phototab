var
	// GULP
	gulp = require('gulp'),

	// PLUGINS
	autoprefixer = require('gulp-autoprefixer'),
	gutil = require('gulp-util'),
	include = require('gulp-include'),
	jshint = require('gulp-jshint'),
	minifyhtml = require('gulp-minify-html'),
	notify = require('gulp-notify'),
	sass = require('gulp-sass'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify'),

	// ENVIRONMENT VARIABLES
	environment_vars = {

		dev: {
			sass: {
				outputStyle: 'expanded'
			}

		},


		prod: {
			sass: {
				outputStyle: 'compressed'
			}

		}

	},


	dirs = {
		assets: './dist/assets/',
		dist: './dist/',
		src: './src/'
	},


	ENV = environment_vars.prod
;

/**
 * Error Report handling
 *
 * @source https://github.com/mikaelbr/gulp-notify/issues/81#issuecomment-100422179
 */
var reportError = function( error ) {

	var lineNumber = ( error.lineNumber ) ? 'LINE ' + error.lineNumber + ' -- ' : '',
		report = '',
		chalk = gutil.colors.white.bgRed;

	notify( {
		title: 'Task Failed [' + error.plugin + ']',
		message: lineNumber + 'See console.',
		sound: 'Frog' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	} ).write( error );

	// Inspect the error object
	//console.log(error);

	// Easy error reporting
	//console.log(error.toString());

	// Pretty error reporting
	report += chalk( 'TASK:' ) + ' [' + error.plugin + ']\n';
	report += chalk( 'PROB:' ) + ' ' + error.message + '\n';
	if ( error.lineNumber ) { report += chalk( 'LINE:' ) + ' ' + error.lineNumber + '\n'; }
	if ( error.fileName )   { report += chalk( 'FILE:' ) + ' ' + error.fileName + '\n'; }
	console.error( report );

	// Prevent the 'watch' task from stopping
	this.emit( 'end' );

};


gulp.task( 'html', function() {

	return gulp.src( dirs.src + '*.html' )
		.pipe( minifyhtml( ) )
		.pipe( gulp.dest( dirs.dist ) )
	;

} );




gulp.task( 'js', function() {

	return gulp.src([
			dirs.src + 'js/*.js',
			'!' + dirs.src + 'js/lib/*.js'
		])

		.pipe( jshint('.jshintrc') )
		.pipe( jshint.reporter( stylish ) )
		.pipe( jshint.reporter('fail') )
			.on( 'error', reportError )

		.pipe( include() )

		.pipe( uglify() )

		.pipe( gulp.dest( dirs.assets + 'js' ) )

	;

});





/**
 * Compile SCSS
 */
gulp.task( 'scss', function() {

	return gulp.src( [
			dirs.src + 'scss/*.scss',
			'!' + dirs.src + 'scss/_*.scss'
		] )

		.pipe( sass( ENV.sass ) )
			.on( 'error', reportError )

		.pipe( autoprefixer( { browsers: [ 'last 2 Chrome versions' ] } ) )

		.pipe( gulp.dest( dirs.assets + 'css' ) )
	;

} );


// watch
gulp.task( 'watch', function () {

	gulp.watch( dirs.src + '*.html', ['html'] );
	gulp.watch( dirs.src + 'js/*.js', ['js'] );
	gulp.watch( dirs.src + 'scss/*.scss', ['scss'] );

} );
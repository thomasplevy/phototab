var
	gulp = require('gulp')
	sass = require('gulp-sass');



	dirs = {
		assets: './dist/assets/',
		src: './src/'
	}
;



/**
 * Compile SCSS
 */
gulp.task( 'scss', function() {

	return gulp.src( [
			dirs.src + 'scss/*.scss',
			'!' + dirs.src + 'scss/_*.scss'
		] )

		.pipe( sass( {
			outputStyle: 'compressed',
		} ).on( 'error', sass.logError ) )

		.pipe( gulp.dest( dirs.assets + 'css' ) );
});




// watch
gulp.task( 'watch', function () {

	gulp.watch( dirs.src + 'scss/*.scss', ['scss'] );

} );
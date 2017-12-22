var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('minimize', function() {
    return gulp.src('mutate.js')
        .pipe(uglify())
        .pipe(concat('mutate.min.js'))
        .pipe(gulp.dest(''));
});

gulp.task('default', ['minimize']);
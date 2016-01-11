import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import nodeunit from 'gulp-nodeunit';
import runSequence from 'run-sequence';

const srcFolder = './src';
const distFolder = './dist';
const HTMLCSFolder = './node_modules/HTML_CodeSniffer';

gulp.task('lint', () =>
  gulp
    .src([
      `${srcFolder}/*.js`,
      '!node_modules/**'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('babel', () =>
  gulp
    .src(`${srcFolder}/**/*.js`)
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest(distFolder))
);

gulp.task('compressHTMLCS', () =>
  gulp
    .src([
      `${HTMLCSFolder}/Standards/**/*.js`,
      `${HTMLCSFolder}/HTMLCS.js`,
      `${distFolder}/runner.js`
    ])
    .pipe(concat('HTMLCS.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distFolder))
);

gulp.task('nodeunit', () =>
  gulp
    .src(`test/**/*.test.js`)
    .pipe(nodeunit({
      reporter: 'junit',
      reporterOptions: {
        output: 'test'
      }
    }))
);

gulp.task('babel:watch', () =>
  gulp
    .watch(`${srcFolder}/**/*.js`, ['lint', 'babel'])
);

gulp.task('compress:watch', () =>
  gulp
    .watch(`${distFolder}/runner.js`, ['compressHTMLCS'])
);

gulp.task('test:watch', () =>
  gulp
    .watch(`test/*.js`, ['nodeunit'])
);

gulp.task('watch', ['babel:watch', 'compress:watch', 'test:watch']);

// Actual tasks
gulp.task('test', () => runSequence('lint', 'babel', 'compressHTMLCS', 'nodeunit'));
gulp.task('default', [
  'lint',
  'compressHTMLCS',
  'babel',
  'watch'
]);
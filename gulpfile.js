'use strict'

const gulp = require('gulp')

const globals = {
  dirname: __dirname
}

const { clean } = require('kth-node-build-commons').tasks(globals)

const { moveHandlebarPages } = require('kth-node-web-common/gulp')

gulp.task('moveHandlebarPages', moveHandlebarPages)

/**
 * Usage:
 *
 *  One-time build of browser dependencies for development
 *
 *    $ gulp build:dev
 *
 *  Continuous re-build during development
 *
 *    $ gulp watch
 *
 *  One-time build for Deployment (Gulp tasks will check NODE_ENV if no option is passed)
 *
 *    $ gulp build [--production | --reference]
 *
 *  Remove the generated files
 *
 *    $ gulp clean
 *
 ** /
// *** JavaScript helper tasks ***
gulp.task('webpack', webpack)
gulp.task('vendor', vendor)
gulp.task('transpileSass', () => sass())
/* Put any additional helper tasks here */

/**
 *
 *  Public tasks used by developer:
 *
 */

gulp.task('clean', clean)

gulp.task('build', ['moveHandlebarPages'])

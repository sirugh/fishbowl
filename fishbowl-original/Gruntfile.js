module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  var cordovaTasks = require('./cordova/grunt/cordova')
  var path = require('path');
  grunt.initConfig(grunt.util._.extend(cordovaTasks, {
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: ['www/']
    },
    browserSync : {
      bsFiles: {
        src : 'www/**.*'
      },
      options: {
        server : {
          baseDir: './www'
        }
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'www/js',
          src: ['*.js', 'util/*.js', 'models/*.js', 'views/*.js', 'lib/*.js'],
          dest: 'dist/js'
        }]
      }
    },
    cssmin : {
      sitecss: {
        options: {
          banner: '/* Fishbowl | Stephen Rugh (@too_root) */',
        },
        files: [{
        // {
        //  // 'dist/css/main.min.css': ['www/css/**/*.css']
        // }
          expand: true,
          cwd: 'www/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          // ext: '.min.css'
        }]
      }
    },
    clean: {
      dist: ["dist/"],
      cordova: ["cordova/www/"]
    },
    copy : {
      dist : {
        files : [
          {
            expand : true,
            cwd: 'www/',
            // copy all but js (uglified)
            src: ['index.html', 'js/lib/**', 'css/**', 'font/**', 'img/**', 'media/**', 'templates/**'],
            dest: 'dist/',
            filter: 'isFile'
          }
        ]
      },
      distToCordova : {
        files : [
          {
            expand : true,
            cwd: 'dist/',
            src: ['**'],
            dest: 'cordova/www',
            filter: 'isFile'
          }
        ]
      }
    }
  }));

  grunt.loadTasks('./cordova/grunt'); //loads shell scripts

  // requires cordova tasks
  grunt.registerTask('build-cordova-release', [
    'dist',
    'clean:cordova',
    'copy:distToCordova',
    'shell:buildApk',
    'shell:copyApk',
    'shell:replaceApk',
    'shell:jarsigner',
    'shell:zipalign'
  ]);

  grunt.registerTask('build-cordova-debug', [
    'dist',
    'clean:cordova',
    'copy:distToCordova'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'uglify:dist',
    'cssmin',
    'copy:dist'
  ]);

  grunt.registerTask('serve', [
    'browserSync'
  ]);
  grunt.registerTask('default', ['dist']);
};

var config;
var matchdep = require('matchdep');
var module;
var path = require('path');
var unwrap = require('unwrap');

config = {
    files: {
        build: 'lib/handlebars.partialsWithParameters.js',
        check: [
            'src/handlebars.partialsWithParameters.js',
            'Gruntfile.js'
        ],
        dist: 'dist/handlebars.partialsWithParameters.min.js',
        docs: 'docs',
        tmp: 'tmp/handlebars.partialsWithParameters.js',
        src: [
            'src/handlebars.partialsWithParameters.js'
        ]
    }
};

module.exports = function(grunt) {

    var bower = grunt.file.readJSON('bower.json');
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        semver: require('semver'),
        meta: {
            bundleBanner:
                '// handlebars.partialsWithParameters\n' +
                '// ----------------------------\n' +
                '// v<%= semver.inc(pkg.version, grunt.config("bump.increment")) %>\n' +
                '//\n' +
                '// Annotated source code can be found here: http://useallfive.github.io/handlebars.partialsWithParameters/handlebars.partialsWithParameters.html\n' +
                '//\n' +
                '// Brought to you by [Use All Five, Inc.](http://www.useallfive.com)\n' +
                '// ```\n' +
                '// Author: Justin Anastos <janastos@useallfive.com>\n' +
                '// Author URI: [http://www.useallfive.com](http://www.useallfive.com)\n' +
                '// Repository: https://github.com/UseAllFive/handlebars.partialsWithParameters\n' +
                '// ```\n' +
                '// Use Handlebars helper to allow passing of parameters into partials.\n' +
                '\n\n'
        },

        bowerRelease: {
            options: {
                endpoint: bower.repository.url
            },
            deploy: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: [
                        'lib/**/*',
                        'dist/**/*',
                        '.*'
                    ]
                }]
            }
        },

        bump: {
            options: {
                commitFiles: [
                    'package.json',
                    'bower.json',
                    config.files.build,
                    config.files.dist
                ],
                files: [
                    'package.json',
                    'bower.json'
                ],
                push: true,
                pushTo: 'origin',
                updateConfigs: ['pkg']
            }
        },

        clean: {
            dist: 'dist',
            docs: 'docs',
            lib: 'lib',
            tmp: 'tmp'
        },

        concat: {
            options: {
                banner: '<%= meta.bundleBanner %>'
            },
            bundle: {
                src: '<%= preprocess.bundle.dest %>',
                dest: config.files.build
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                files: {
                    src: config.files.check
                }
            }
        },

        jscs: {
            all: {
                files: {
                    src: config.files.check
                }
            }
        },

        groc: {
            options: {
                github: false,
                out: config.files.docs,
                silent: true,
                strip: 'src/'
            },
            local: {
                src: config.files.src
            },
            github: {
                options: {
                    github: true
                },
                src: config.files.src
            }
        },

        preprocess: {
            bundle: {
                src: config.files.src,
                dest: config.files.tmp
            }
        },

        prompt: {
            bump: {
                options: {
                    questions: [
                        {
                            config: 'bump.increment',
                            type: 'list',
                            message: 'Bump version from ' + pkg.version.cyan + ' to:',
                            choices: [
                                {
                                    value: 'patch',
                                    name: 'Patch:  '.yellow +
                                        '<%= semver.inc(pkg.version, "patch") %>'.yellow +
                                        '   Backwards-compatible bug fixes.'
                                },
                                {
                                    value: 'minor',
                                    name: 'Minor:  '.yellow +
                                        '<%= semver.inc(pkg.version, "minor") %>'.yellow +
                                        '   Add functionality in a backwards-compatible manner.'
                                },
                                {
                                    value: 'major',
                                    name: 'Major:  '.yellow +
                                        '<%= semver.inc(pkg.version, "major") %>'.yellow +
                                        '   Incompatible API changes.'
                                }
                            ]
                        }
                    ]
                }
            }
        },

        template: {
            options: {
                data: {
                    version: '<%= pkg.version %>'
                }
            },
            bundle: {
                src: '<%= preprocess.bundle.dest %>',
                dest: '<%= preprocess.bundle.dest %>'
            }
        },

        unwrap: {

        },

        uglify: {
            all: {
                src: config.files.build,
                dest: config.files.dist
            }
        },

        watch: {
            options: {
                interrupt: true
            },
            js: {
                files: config.files.check,
                tasks: 'local:publish'
            }
        }
    });

    // Load all npm dependencies.
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Taken from https://github.com/marionettejs/backbone.marionette/blob/v2.0.3/Gruntfile.js#L247
    grunt.registerMultiTask('unwrap', 'Unwrap UMD', function() {
        /*global __dirname: true */
        var done = this.async();
        var timesLeft = 0;

        this.files.forEach(function(file) {
            file.src.forEach(function(src) {
                timesLeft += 1;
                unwrap(path.resolve(__dirname, src), function(err, content) {
                    if (err) {
                        return grunt.log.error(err);
                    }
                    grunt.file.write(path.resolve(__dirname, file.dest), content);
                    grunt.log.ok(file.dest + ' created.');
                    timesLeft -= 1;
                    if (timesLeft <= 0) {
                        done();
                    }
                });
            });
        });
    });

     /**
     * Internal task to use the prompt settings to create a tag
     */
    grunt.registerTask('bump:prompt', function() {
        var increment = grunt.config('bump.increment');

        if (!increment) {
            grunt.fatal('bump.increment config not set!');
        }

        grunt.task.run('bump:' + increment);
    });

    grunt.registerTask('default', 'local:publish');
    grunt.registerTask('dev', ['local:publish', 'watch']);
    grunt.registerTask('publish', 'Pack up all the files into a single file, minify, and publish to bower.', [
        'jshint',
        'jscs',
        'prompt:bump',
        'clean:lib',
        'clean:tmp',
        // 'unwrap',
        'preprocess',
        'concat',
        'uglify',
        'bump:prompt',
        'bowerRelease',
        'groc:github'
    ]);
    grunt.registerTask('local:publish', 'Pack files up into a locally testable version. Same as publish, but without the actual bumping and publishing.', [
        'jshint',
        'jscs',
        'clean:lib',
        'clean:tmp',
        // 'unwrap',
        'preprocess',
        'concat',
        'uglify',
        'clean:tmp'
    ]);
};

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 8000
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/js/**/*.js']
        },
        watch: {
            files: ['<%=jshint.files %>'],
            tasks: ['jshint']
        }
    });

};

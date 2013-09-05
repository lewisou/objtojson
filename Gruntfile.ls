livescript = require('LiveScript')

module.exports = (grunt) ->
  grunt.initConfig do
    pkg: grunt.file.readJSON('package.json')

    ls:
      build:
        expand: true
        cwd: 'src'
        src: ['**/*.ls', 'Gruntfile.ls', '!node_modules/**/*.ls']
        dest: 'lib'
        ext: '.js'

    watch:
      ls:
        files: ['**/*.ls']
        tasks: ['ls']

  do
    <-! grunt.registerMultiTask \ls 'Livescript Task to compile ls codes.'
    f <-! @files.forEach
    ls_files = f.src.filter (path) -> grunt.file.exists(path)
    file <- ls_files.forEach
    compiled = livescript.compile grunt.file.read file
    grunt.file.write f.dest, compiled
    grunt.log.writeln "Javascipt: #{f.dest} generated."
    

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask \default ['ls']
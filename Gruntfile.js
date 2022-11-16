module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-screeps");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    screeps: {
      options: {
        email: "cwwjcw5@outlook.com",
        token: "74159d79-4cfb-4973-8e18-a91a25236b79",
        branch: "default",
        //server: 'season'
      },
      dist: {
        src: ["./*.js"],
      },
    },
    watch: {
      files: "*.js",
      tasks: ["screeps"],
    },
  });
};

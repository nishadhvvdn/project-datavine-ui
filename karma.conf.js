module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'public/js/lib/jquery.min.js',
      'public/js/lib/angular.min.js',
      'public/js/lib/angular-mocks.js',
      'public/js/lib/angular-file-model.js',
      'public/js/lib/angular-ui-router.min.js',
      'public/js/lib/angular-animate.min.js',
      'public/js/lib/ui-bootstrap-tpls.min.js',
      'public/js/lib/ui-grid.min.js',
      'public/js/lib/angular-touch.min.js',
      'public/js/lib/angular-multiselect-dropdown.js',
      'public/js/lib/angular-country-timezone-picker.js',
      'public/js/lib/angular-idle.min.js',
      'public/js/lib/angular-breadcrumb.min.js',
      'public/js/lib/angular-sessionStorage.js',
      'public/js/lib/sweetalert.min.js',
      'public/js/lib/breadcurmb.min.js',
      'public/js/lib/ng-file-upload.min.js',
      'public/js/lib/ng-file-upload-shim.min.js',
      'public/js/lib/jxml2json.js',
      'js/lib/downloadify.min.js',
      'public/js/lib/jspdf.js',
      'public/js/lib/moment.js',
      'public/js/lib/loadash.min.js',
      'public/js/lib/moment.min.js',
      'public/js/lib/bootstrap.min.js',
      'public/js/lib/moment-timezone-with-data.min.js',
      'public/js/lib/chosen.jquery.js',
      'public/js/lib/jstz.min.js',
      'public/js/lib/angular-timezone-selector.js',
      'public/js/lib/ngMessage.js',
      'public/js/lib/csvparser.js',
      'public/js/lib/mqtt.min.js',
      'public/js/controllers/dataVINEController.js',
      'public/online_Help/onlineHelpModule.js',
      'public/online_Help/*.js',
      'public/js/controllers/*.js',
      'public/js/services/*.js',
      'public/js/model/*.js',
      'public/js/directives/*.js',
      'public/js/filters/*.js',
      /*For running all test cases*/
      'public/test/*.js'
      /*For running single test cases*/
      //'public/test/csvparserSpec.js',
      
      
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,
    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Code coverage report
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'public/js/controllers/*.js': ['coverage'],
      'public/js/services/*.js': ['coverage'],
    },
    coverageReporter: {
      type:'lcov',
      dir: 'public/coverage'
    },

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      // 'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor'
      // required for coverage
    ],
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
  });
};
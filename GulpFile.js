'use strict';

//const jshint = require('gulp-jshint');
var gulp = require('gulp');
//var clean = require('gulp-clean');
const terser = require('gulp-terser');

const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
//var uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');
var jsonminify = require('gulp-jsonminify');

var devMode = false;

// gulp.task('build', gulp.series(
//   clean
// ));

/**
 * Run test once and exit
*/
gulp.task('css', function() {
  return gulp.src('./public/stylesheets/css/**/*.css')
   .pipe(concat('styles.css'))
   .pipe(cssmin())
   .pipe(gulp.dest('./build/stylesheets/css'));
 });

 gulp.task('configJson', function() {
  return gulp.src('./public/configuration.json')
  .pipe(jsonminify())
   .pipe(gulp.dest('./build'));
 });


gulp.task('controllers', function() {
  //return gulp.src('./public/js/controllers**/*.js')
  return gulp.src(['./public/js/controllers/dataVINEController.js',
    './public/js/controllers/loginCtrl.js',
    './public/js/controllers/dateCommonCtrl.js',
    './public/js/controllers/homeCtrl.js',
    './public/js/controllers/configurationsCtrl.js',
    './public/js/controllers/importConfigurationCtrl.js',
    './public/js/controllers/configurationManagementCtrl.js', 
    './public/js/controllers/configurationManagement_meterCtrl.js',
    './public/js/controllers/tagsCtrl.js', 
    './public/js/controllers/jobStatusCtrl.js',
    './public/js/controllers/newConfigurationCtrl.js', 
    './public/js/controllers/hyperSproutDownloadsCtrl.js',	
    './public/js/controllers/downloadConfigurationCtrl.js',
    './public/js/controllers/deviceManagementCtrl.js', 
    './public/js/controllers/registrationCtrl.js',	
    './public/js/controllers/dataVineHealthCtrl.js',
    './public/js/controllers/configurations_meterCtrl.js', 
    './public/js/controllers/editHyperSproutOrMeterCtrl.js', 
    './public/js/controllers/meterDownloadsCtrl.js',
    './public/js/controllers/downloadConfiguration_meterCtrl.js', 
    './public/js/controllers/metersCtrl.js', 
    './public/js/controllers/relaysCtrl.js',
    './public/js/controllers/deviceLogsCtrl.js',	
    './public/js/controllers/editLogsVerbosityCtrl.js', 
    './public/js/controllers/addRelaytoSystemCtrl.js',
    './public/js/controllers/relayDetailsCtrl.js', 
    './public/js/controllers/lockUnLockUICtrl.js', 
    './public/js/controllers/deviceRebootCtrl.js',
    './public/js/controllers/serverDetailsCtrl.js', 
    './public/js/controllers/manuallyDeregisterCtrl.js', 
    './public/js/controllers/groupConfigurationDetailsCtrl.js',
    './public/js/controllers/defineUsersCtrl.js', 
    './public/js/controllers/securityCtrl.js', 
    './public/js/controllers/userSettingsCtrl.js',
    './public/js/controllers/communicationStatisticsCtrl.js', 
    './public/js/controllers/dataVineHealth_reportsCtrl.js', 
    './public/js/controllers/deviceFirmwareVersionsCtrl.js',
    './public/js/controllers/systemAuditLogCtrl.js',	
    './public/js/controllers/systemUpdatesCtrl.js', 
    './public/js/controllers/nodeHyperSproutDetailCtrl.js',
    './public/js/controllers/dataVineHealthCtrl.js',	
    './public/js/controllers/dataVINEServerHealthDetailsCtrl.js', 
    './public/js/controllers/groupManagementCtrl.js',
    './public/js/controllers/groupConfigurationDetails_groupManagementCtrl.js', 
    './public/js/controllers/assignEndpointCtrl.js', 
    './public/js/controllers/createApplicationGroupCtrl.js',
    './public/js/controllers/groupManagement_meterCtrl.js', 
    './public/js/controllers/cellEndpoints_DataVINEHealthCtrl.js',
    './public/js/controllers/dataVINENetworkStatisticsCtrl.js', 
    './public/js/controllers/importFirmwareCtrl.js', 
    './public/js/controllers/enterFirmwareDownloadCtrl.js',
    './public/js/controllers/productionFirmwareCtrl.js',	
    './public/js/controllers/addOrEditSecurityGroupCtrl.js',	
    './public/js/controllers/passwordSettingsCtrl.js',
    './public/js/controllers/systemSettingsCtrl.js',	
    './public/js/controllers/addUserCtrl.js', 
    './public/js/controllers/configProgramCtrl.js',	
    './public/js/controllers/endpointDetailsCtrl.js',
    './public/js/controllers/systemLogsCtrl.js',	
    './public/js/controllers/uploadConfigProgramCtrl.js', 
    './public/js/controllers/saveAsConfigPrgmCtrl.js', 
    './public/js/controllers/saveAsConfigPrgmCtrl_meter.js',
    './public/js/controllers/editConfigGroupCtrl.js', 
    './public/js/controllers/changePasswordCtrl.js', 
    './public/js/controllers/circuitRegistrationCtrl.js',
    './public/js/controllers/endpointRegistrationCtrl.js', 
    './public/js/controllers/addOrEditEndpointCtrl.js', 
    './public/js/controllers/cktUploadCtrl.js', 
    './public/js/controllers/groupingCtrl.js',
    './public/js/controllers/viewCircuitEntryCtrl.js', 
    './public/js/controllers/circuitGroupingCtrl.js',
    './public/js/controllers/circuitInfoGroupingCtrl.js', 
    './public/js/controllers/transformerGroupingCtrl.js', 
    './public/js/controllers/unassignedTransformerListCtrl.js',
    './public/js/controllers/transformerMeterGroupingCtrl.js', 
    './public/js/controllers/viewMeterEntryCtrl.js', 
    './public/js/controllers/newCircuitConfigurationCtrl.js', 
    './public/js/controllers/transformerRegistrationCtrl.js',
    './public/js/controllers/messageCtrl.js',
    './public/js/controllers/viewTransformerEntryCtrl.js', 
    './public/js/controllers/hyperHubRegistrationCtrl.js', 
    './public/js/controllers/addOrEditHyperHubCtrl.js', 
    './public/js/controllers/hyperHupGroupingCtrl.js',
    './public/js/controllers/unassignedHyperHubListCtrl.js',	
    './public/js/controllers/meterRegistrationCtrl.js', 
    './public/js/controllers/newMeterConfigurationCtrl.js', 
    './public/js/controllers/unassignedMeterListCtrl.js',
    './public/js/controllers/hypersproutCommCtrl.js', 
    './public/js/controllers/firmwareManagementCtrl.js', 
    './public/js/controllers/newXfmerConfigurationCtrl.js',
    './public/js/controllers/newAccounts_ReportCtrl.js',
    './public/js/controllers/deltaLinkRegistrationCtrl.js', 
    './public/js/controllers/addOrEditDeltaLinkCtrl.js', 
    './public/js/controllers/viewDeltaLinkCtrl.js', 
    './public/js/controllers/deltaLinkCtrl.js',
    './public/js/controllers/deltaLinkDetailsCtrl.js',
    './public/js/controllers/groupManagement_DeltaLinkCtrl.js', 
    './public/js/controllers/deltaLinkFirmwareManagementCtrl.js', 
    './public/js/controllers/deltaLinkGroupConfigurationDetailsCtrl.js',
     './public/js/controllers/meterBulkOperationCtrl.js', 
     './public/js/controllers/bulkOperationsCtrl.js',
     './public/js/controllers/deltaLinkJobStatusCtrl.js',
     './public/js/controllers/unassignedDeltaLinkCtrl.js',
     './public/js/controllers/deviceFactoryResetCtrl.js',
     './public/js/controllers/technicalLossEntryCtrl.js',
     './public/js/controllers/newTechnicalLossConfigurationCtrl.js', 
     './public/js/controllers/technicalLossItemCtrl.js',
     './public/js/controllers/deviceHypersproutConfigurationManagementCtrl.js',
     './public/js/controllers/hypersproutdeviceconfigCtrl.js',
     './public/js/controllers/meterDeviceConfigCtrl.js',
     './public/js/controllers/deviceMeterConfigurationManagementCtrl.js',
     './public/js/controllers/metertoDeltalinkCtrl.js',
     './public/js/controllers/dashboardCtrl.js',
     './public/js/controllers/hypersproutDeviceFirmwareCtrl.js'
  ])
    .pipe(ngAnnotate())
  .pipe(concat('app.js'))
 .pipe(terser())
 
  .pipe(gulp.dest('./build/js'));
});

gulp.task('directives', function() {
  return gulp.src('./public/js/directives**/*.js')
  .pipe(ngAnnotate())
  .pipe(concat('directives.js'))
  .pipe(terser())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('filters', function() {
  return gulp.src('./public/js/filters**/*.js')
  .pipe(ngAnnotate())
  .pipe(concat('filters.js'))
  .pipe(terser())  
  .pipe(gulp.dest('./build/js'));
});

gulp.task('models', function() {
  return gulp.src('./public/js/model**/*.js')
   .pipe(terser())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('services', function() {
  return gulp.src('./public/js/services**/*.js')  
   .pipe(ngAnnotate())
   .pipe(concat('services.js'))
   .pipe(terser())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('templates', function() {
  return gulp.src('./public/templates/**/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('./build/templates'));
});

gulp.task('pagesHtml', function() {
  return gulp.src('./public/pages/**/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('./build/pages'));
});

gulp.task('pagesJs', function() {
  return gulp.src('./public/pages/online_Help/**/*.js')
  .pipe(terser())
  .pipe(gulp.dest('./build/pages/online_Help'));
});


gulp.task('onlineHelpHtml', function() {
  return gulp.src('./public/online_Help/**/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('./build/online_Help'));
});

gulp.task('onlineHelpJs', function() {
  return gulp.src('./public/online_Help/**/*.js')
  .pipe(ngAnnotate())
  .pipe(concat('onlineHelp.js'))
  .pipe(terser())
  .pipe(gulp.dest('./build/online_Help'));
});

gulp.task('tabsHtml', function() {
  return gulp.src('./public/tabs/**/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('./build/tabs'));
});


/* ==================== COPY FILES AND FOLDERS ================*/
gulp.task('copyAssets', function() {
  return gulp.src('./public/assets/**/*')
  .pipe(gulp.dest('./build/assets'));
});


gulp.task('copyJsLib', function() {
  return gulp.src('./public/js/lib/**/*')
  .pipe(gulp.dest('./build/js/lib'));
});

gulp.task('copyTest', function() {
  return gulp.src('./public/test/**/*')
  .pipe(gulp.dest('./build/test'));
});


gulp.task('copyStylesheetsFonts', function() {
  return gulp.src('./public/stylesheets/fonts/**/*')
  .pipe(gulp.dest('./build/stylesheets/fonts'));
});


gulp.task('copyStylesheetsFontAwesome', function() {
  return gulp.src('./public/stylesheets/font-awesome/**/*')
  .pipe(gulp.dest('./build/stylesheets/font-awesome'));
});


gulp.task('copyStylesheets:style.styl', function() {
  return gulp.src('./public/stylesheets/style.styl')
  .pipe(gulp.dest('./build/stylesheets'));
});


gulp.task('copyStylesheetsLib', function() {
  return gulp.src('./public/stylesheets/lib/**/*')
  .pipe(gulp.dest('./build/stylesheets/lib'));
});

gulp.task('copy', function(){
  gulp.start(['copyAssets', 'copyJsLib', 'copyTest', 'copyStylesheetsFonts', 'copyStylesheetsFontAwesome',
    'copyStylesheetsLib', 'copyStylesheets:style.styl']);  
});

gulp.task('build', function(){ 
  devMode = true;   
  gulp.start(['copy', 'css', 'services', 'configJson', 'directives', 'filters', 'models', 'controllers', 'templates', 'pagesJs', 'pagesHtml', 'onlineHelpHtml', 'onlineHelpJs', 'tabsHtml']);  
});


// gulp.task('test', function (done) {
//   new Server({
//     configFile: __dirname + '/karma.conf.js',
//     singleRun: true
//   }, done).start();
// });

// gulp.task('default', () =>
//     gulp.src('DataVINE CE/**/*')
//         .pipe(zip('archive.zip'))
//         .pipe(gulp.dest('./dist'))
// );

var config;

function configFail() {
  console.log('FAILED TO LOAD CONFIG!');
}

function parseConfig(config_json) {
  config =  config_json;
  console.log(config_json.sitetitle);
  //$('h1').text(config_json.sitetitle);
  document.title = config_json.sitetitle;

  console.log(config_json.theme);
  parseTheme(config_json.theme);

  //alert('parseConfig');
  // load config.json
  //var config = JSON.parse(config_json);
  //alert(config.sitetitle);
  // parseTheme(config.theme);

}
function getConfigJSON() {
  return $.ajax({
    type: 'GET',
    url: "config.json"
  });
}

function themeHTMLFail() {
  console.log('FAILED TO THEME HTML!');
}
function getThemeHTML(theme) {
  return $.ajax({
    type: 'GET',
    url: "/theme/"+theme+"/template.html"
  });
}
function parseThemeHTML(themeHTML) {
  console.log(themeHTML);
  $(document.body).html(themeHTML);
    console.log(config.sitetitle);
  $('#sitetitle').text(config.sitetitle);

  // TO DO: parseMenu
  // TO DO: parse default content (first page?)
}

function parseTheme(theme) {
  getThemeHTML(theme).done(parseThemeHTML).fail(themeHTMLFail);

  // load theme CSS
  $("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "/theme/"+theme+"/style.css"
  }).appendTo("head");
}
/*
function parseMenu(menu_data) {
//
}

function loadModules(modules_data) {
  //
}

function parseModule(module_data) {
  // $.getScript( "ajax/test.js", function( data, textStatus, jqxhr ) {
  // console.log( data ); // Data returned
  // console.log( textStatus ); // Success
  // console.log( jqxhr.status ); // 200
  // console.log( "Load was performed." );
  //});
} */

$(document).ready(function() {
  console.log('ready');
  getConfigJSON().done(parseConfig).fail(configFail);
});

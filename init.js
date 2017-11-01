function parseConfig(config_json) {
  document.title = "success";
  //alert('parseConfig');
  // load config.json
  var config = JSON.parse(config_json);
  //alert(config.sitetitle);
  // parseTheme(config.theme);

}
/*
function parseTheme(theme) {
//
}

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
  var data ='';
  $.ajax({
    dataType: "json",
    url: "config.json",
    data: data,
    success: parseConfig
  });


  //$.getJSON( , function( data ) { parseConfig(data); });
});

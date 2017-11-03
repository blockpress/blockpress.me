var config;

function configFail() {
  console.log('FAILED TO LOAD CONFIG!');
}
function parseConfig(config_json) {
  config =  config_json;
console.log("config type: "+typeof config);
  parseModules(config_json.modules);
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
  //console.log(themeHTML);
  $(document.body).html(themeHTML);

  console.log("Updating site title to: "+config.sitetitle);
  $('#sitetitle').text(config.sitetitle);
  document.title = config.sitetitle;

  // TO DO: parseMenu
  parseMenu();
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

function parseMenu() {
  var list = $('<ul/>').appendTo('#menuArea');
  var list, href_funct, href, label, menuitem, menu = config.menu;
  console.log(menu);


  var arrayLength = menu.length;
  for (var i = 0; i < arrayLength; i++) {
      console.log(menu[i]);
      //Do something
      label = menu[i].label;
      type = menu[i].type;
      args = menu[i].args;
      href_funct = type+"_menuitem";

      console.log(href_funct);
      href = window[href_funct](args);

      list.append('<li><a href="'+href+'">'+label+'</a></li>');
  }
}


function parseModules(modules_data) {
  console.log(modules_data);
  var moduleItem, arrayLength = modules_data.length;
  for (var i = 0; i < arrayLength; i++) {
      moduleItem = modules_data[i];
      parseModule(moduleItem);
  }
  parseTheme(config.theme);
}

function parseModule(module_name) {
    console.log(module_name);
    $.getScript( "module/"+module_name+"/"+module_name+".js", function( data, textStatus, jqxhr ) {
  console.log( data ); // Data returned
  console.log( textStatus ); // Success
  console.log( jqxhr.status ); // 200
  console.log( "Load was performed." );
  });
}

$(document).ready(function() {
  console.log('ready');
  getConfigJSON().done(parseConfig).fail(configFail);
});

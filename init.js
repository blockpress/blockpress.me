var config;

function configFail() {
  console.log('FAILED TO LOAD CONFIG!');
}
function parseConfig(config_json) {
  if(typeof config_json ==='string') config_json = JSON.parse(config_json);
  console.log(config_json);
  config = config_json;
  console.log(config);
  parseModules(config_json.modules);
}
function getConfigJSON() {
  return $.ajax({
    type: 'GET',
    url: "config.json"
  });
}

function themeHTMLFail() {
  console.log('FAILED TO LOAD THEME HTML!');
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
  //console.log(config.sitetitle);
  $('#sitetitle').text(config.sitetitle);
  $('#tagline').text(config.tagline);
  document.title = config.sitetitle;

  parseMenu();
	parseFirstPage();
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

function getFirstContentModuleFromMenu(menu) {
		// Look for first content module in menu
		var arrayLength = menu.length;
		for (var i = 0; i < arrayLength; i++) {
			if(menu[i].type != 'link') {
				return menu[i];
			}
		}
		return false;
}

function parseFirstPage() {
	var type, args;
	if('firstpage' in config) {
		type = config.firstpage.type;
		args = config.firstpage.args;
	} else {
		var menuItem = getFirstContentModuleFromMenu(content.menu);
		type = menuItem.type;
		args = menuItem.args;
	}
	load_funct = type+"_load";

	window[load_funct](args);
}

function parseMenu() {
	var list = $('<ul/>').appendTo('#menuArea');
	var href_funct, href, label, menuitem, menu = config.menu;
	// console.log(menu);

	var arrayLength = menu.length;
	for (var i = 0; i < arrayLength; i++) {
		//console.log(menu[i]);
		//Do something
		label = menu[i].label;
		type = menu[i].type;
		args = menu[i].args;
		href_funct = type+"_menuitem";

		//console.log(href_funct);
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
	$.getScript( "module/"+module_name+"/"+module_name+".js", function( data, textStatus, jqxhr ) {
		//console.log( data ); // Data returned
		//console.log( textStatus ); // Success
		//console.log( jqxhr.status ); // 200
		console.log( "Load was performed for "+module_name+"." );
	});
}

$(document).ready(function() {
	getConfigJSON().done(parseConfig).fail(configFail);
});

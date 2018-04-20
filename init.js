var config, modules_to_load;

/*** Functions for handling config.json ***/
// Parse config.json once loaded...
function parseConfig(config_json) {
  if(typeof config_json ==='string') config_json = JSON.parse(config_json);
  config = config_json;
  parseModules(config_json.modules);
}
// Failed to load config.json
function configFail() {
  console.log('FAILED TO LOAD CONFIG!');
	// Load default theme and display error page.
	config={"sitetitle": "Error loading config","palette":"vanilla","theme":"metaverse","modules":["static"],"firstpage":{"type":"static","args":["content/default/config_load_error.html"]},"menu":[]};
  parseModules(config.modules);
}

/*** Functions for loading the content modules ***/
// Parse the module json data from the config object
function parseModules(modules_data) {
	modules_to_load=modules_data;
	var moduleItem, arrayLength = modules_to_load.length;
	for (var i = 0; i < arrayLength; i++) {
		moduleItem = modules_data[i];
		parseModule(moduleItem);
	}
	parseTheme(config.theme);
	parsePalette(config.palette);
}
// Parse an individual module item, load the script...
function parseModule(module_name) {
	$.getScript( "module/"+module_name+"/"+module_name+".js", function( data, textStatus, jqxhr ) {
		//console.log( data ); // Data returned
		//console.log( textStatus ); // Success
		//console.log( jqxhr.status ); // 200
		console.log( "Load was performed for "+module_name+"." );

		var index = modules_to_load.indexOf(module_name);
		modules_to_load.splice(index, 1);
	});
}

/*** Functions for parsing themes ***/
// Parse the theme
function parsePalette(palette) {
  // load theme CSS
  $("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "./palette/"+palette+".css"
  }).appendTo("head");
}
/*** Functions for parsing themes ***/
// Parse the theme
function parseTheme(theme) {
  getThemeHTML(theme).done(parseThemeHTML).fail(themeHTMLFail);

  // load theme CSS
  $("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "./theme/"+theme+"/style.css"
  }).appendTo("head");
}
// Load the theme template
function getThemeHTML(theme) {
  return $.ajax({
    type: 'GET',
    url: "./theme/"+theme+"/template.html"
  });
}
// Theme template failed to load...
function themeHTMLFail() {
  console.log('FAILED TO LOAD THEME HTML!');
}
// Parse the theme template
function parseThemeHTML(themeHTML) {
  var banner_image = "";
  if(typeof config.themeoptions == "object") {
    if(typeof config.themeoptions.banner_image == "string" && config.themeoptions.banner_image != "") {
      banner_image = config.themeoptions.banner_image;
    }
    if(typeof config.themeoptions.site_image == "string" && config.themeoptions.site_image != "") {
      themeHTML = themeHTML.replace(/{site-img}/g,config.themeoptions.site_image);
    }
  }
	themeHTML = themeHTML.replace(/{sitetitle}/g,config.sitetitle);
  $(document.body).html(themeHTML);
  if(banner_image != "") {
  		$('.banner_image').css("background-image",banner_image);
      console.log('banner_image: '+banner_image);
	}
  $('#sitetitle').text(config.sitetitle);
  $('#tagline').text(config.tagline);
  document.title = config.sitetitle;

  parseMenu();
	parseFirstPage();
	parseSocialMenu();
}

// Create the Menu
function parseMenu() {
	if(modules_to_load.length > 0) {
		// Try to call menu again in 1/10 of a second.
		setTimeout(function () {
			parseMenu();
		}, 100);
		return null;
	}

	var list = $('<div/>').appendTo('#menuArea');
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

		list.append('<span><a href="'+href+'">'+label+'</a></span>');
	}
}

/*** Functions for loading the default content ***/
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
function getFirstContentModuleFromMenu(menu) {
		// Look for first content module in menu
		var arrayLength = config.menu.length;
		for (var i = 0; i < arrayLength; i++) {
			if(config.menu[i].type != 'link') {
				return config.menu[i];
			}
		}
		return false;
}

function parseSocialMenu() {
	if(config.socialmenu !== null && typeof config.socialmenu === 'object') {
		var smenu = config.socialmenu;
		if(typeof smenu.steemit == "string" && smenu.steemit != "") $(".socialmenu .steemit").prop("href",smenu.steemit);
		else $(".socialmenu .steemit").hide();

		if(typeof smenu.github == "string" && smenu.github != "") $(".socialmenu .github").prop("href",smenu.github);
		else $(".socialmenu .github").hide();

		if(typeof smenu.facebook == "string" && smenu.facebook != "") $(".socialmenu .facebook").prop("href",smenu.facebook);
		else $(".socialmenu .facebook").hide();

		if(typeof smenu.twitter == "string" && smenu.twitter != "") $(".socialmenu .twitter").prop("href",smenu.twitter);
		else $(".socialmenu .twitter").hide();

		if(typeof smenu.reddit == "string" && smenu.reddit != "") $(".socialmenu .reddit").prop("href",smenu.reddit);
		else $(".socialmenu .reddit").hide();

		if(typeof smenu.gplus == "string" && smenu.gplus != "") $(".socialmenu .gplus").prop("href",smenu.gplus);
		else $(".socialmenu .gplus").hide();

		if(typeof smenu.linkedin == "string" && smenu.linkedin != "") $(".socialmenu .linkedin").prop("href",smenu.linkedin);
		else $(".socialmenu .linkedin").hide();

		if(typeof smenu.stackoverflow == "string" && smenu.stackoverflow != "") $(".socialmenu .stackoverflow").prop("href",smenu.stackoverflow);
		else $(".socialmenu .stackoverflow").hide();

		if(typeof smenu.link_url == "string" && smenu.link_url != "") {
			$(".socialmenu a.link_url").prop("href",smenu.link_url);
			var link_url = smenu.link_url.replace(/https\:\/\//g,'');
			console.log(link_url);
			$(".socialmenu a.link_url").text(link_url);
		}	else $(".socialmenu .email").hide();

		if(typeof smenu.email == "string" && smenu.email != "") {
			$(".socialmenu a.email").prop("href","mailto:"+smenu.email);
			$(".socialmenu a.email").text(smenu.email);
		}	else $(".socialmenu .email").hide();
	} else {
		$(".socialmenu").hide();
	}
}



// JQuery ready function that is called once document has loaded.
$(document).ready(function() {
	// Get local config
	$.ajax("local_config.json").done(parseConfig).fail(function(){
		// Else load default config on failure
		$.ajax("config.json").done(parseConfig).fail(configFail);
	});
});

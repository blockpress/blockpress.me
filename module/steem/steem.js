/* A special content module for pulling content from steem blockchain */
function steem_menuitem(args) {
	var args_json = JSON.stringify(args);
	// get json object ready for injecting into html href...
	args_json = args_json.replace(/"/g,'&quot;');
	console.log(args_json);
	return "javascript:steem_load('"+args_json+"');";
}

function steem_display(content) {
	$('#contentArea').html(content);
}
function steem_load(args) {
	console.log("Inside steem_load.");
	args = JSON.parse(args.replace(/&quot;/g,'"'));
	console.log(args);
	console.log(args.show);

	switch(args.show) {
		case "profile":
			console.log("Get profile of: "+args.user);
			getSteemProfile(args.user);
			break;
		case "posts":
			console.log("posts");
			break;
		case "post":
			getSteemPost(args.user,args.postid);
			console.log("post: "+args.user+" "+args.postid);
			break;
	}
}

function displaySteemPosts(posts) {
	// Get template from theme

	// Else use default template

	// Then insert post values for each post returned

	// Append post to content string
	content = 'SteemPosts';

	// Display content string
	$('#contentArea').html(content);
}
function getSteemPosts(usernames,tags) {
	//
	displaySteemPosts(['AAA']);
}

function displaySteemPost(post) {
	// Get template from theme

	// Else use default template
	content = post;
	// Display template
	$('#contentArea').html(content);

		console.log(steem_post.body);

	var converter = new showdown.Converter();
	var body_html = converter.makeHtml(steem_post.body);

	console.log(body_html);
	// Then add post values
	$("#steem-post-content").html(body_html);
}
function getSteemPostTemplate(err, post) {
	// Save profile in global variable
	steem_post = post;

	// Get template from theme
	var theme_template = "/theme/"+config.theme+"/steem-post.html";
	$.ajax(theme_template).done(displaySteemProfile).fail(function(){
		// Else use default template
		$.ajax("/module/steem/steem-post.html").done(displaySteemPost);
	});

	content = 'post';
}
function getSteemPost(username,postid) {
	//
	steem.api.getContent(username, postid,	function(err, result){getSteemPostTemplate(err, result)});
}

function simpleReputation(raw_reputation) {
	var simple_reputation = Math.log10(raw_reputation);
	simple_reputation = simple_reputation - 9;
	simple_reputation = simple_reputation * 9;
	simple_reputation = simple_reputation + 25;
	return simple_reputation;
}

function displaySteemProfile(template) {
	console.log(steem_profile);
	// Display template
	$('#contentArea').html(template);

	// Then add profile values
	var metadata = JSON.parse(steem_profile.json_metadata);
	console.log(metadata.profile);
	console.log("profile image: "+metadata.profile.profile_image);
	$("#profile-banner").css("background","url("+metadata.profile.cover_image+") no-repeat");
	$("#profile-image").html('<img src="'+metadata.profile.profile_image+'">');
	$("#profile-username").html('@'+steem_profile.name);
	$("#profile-username").html('@'+steem_profile.name);
	$("#profile-name").html(metadata.profile.name);
	var reputation = simpleReputation(steem_profile.reputation);
	$("#profile-reputation").html(Math.round(reputation));

	$("#profile-about").html(metadata.profile.about);
}
function getSteemProfileTemplate(err, profile) {
	// Save profile in global variable
	steem_profile = profile[0];

	// Get template from theme
	var theme_template = "/theme/"+config.theme+"/steem-profile.html";
	$.ajax(theme_template).done(displaySteemProfile).fail(function(){
		// Else use default template
		$.ajax("/module/steem/steem-profile.html").done(displaySteemProfile);
	});

	content = 'profile';
}
function getSteemProfile(username) {
	//
	steem.api.getAccounts([username],	function(err, profile){getSteemProfileTemplate(err, profile)});
}

//Load the showdown library (for parsing markdown)
$.getScript( "lib/showdown/showdown.min.js").done(function( script, textStatus ) {
		console.log( textStatus );
		console.log( "showdown.min.js load was performed." );
	})
	.fail(function( jqxhr, settings, exception ) {
		console.log( exception );
		console.log( jqxhr.status );
		console.log( settings );
		$( "div.log" ).text( "Triggered ajaxError handler." );
	});

var steem_profile, steem_post, steem_posts;

//Load the steem javascript API
$.getScript( "lib/steem-js/steem.min.js", function( data, textStatus, jqxhr ) {
	console.log( data ); // Data returned
	console.log( textStatus ); // Success
	console.log( jqxhr.status ); // 200
	console.log( "steem.min.js load was performed." );
});

	console.log( "XXXXX" ); // Data returned

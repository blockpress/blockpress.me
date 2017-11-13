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
			console.log("profile");
			break;
		case "posts":
			console.log("posts");
			break;
		case "post":
			console.log("post");
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

	// Then add post values
}
function getSteemPost(postid) {
	//
	displaySteemPost("Post content")
}

function displaySteemProfile(err, profile) {
	// Get template from theme

	// Else use default template
	content = 'profile';
	// Display template
	$('#contentArea').html(content);

	// Then add profile values
}
function getSteemProfile(username) {
	//
	steem.api.getAccounts([username],	displaySteemProfile(err, profile));
}

//Load the steem javascript API
$.getScript( "module/steem/steem.min.js", function( data, textStatus, jqxhr ) {
	console.log( data ); // Data returned
	console.log( textStatus ); // Success
	console.log( jqxhr.status ); // 200
	console.log( "Load was performed." );
});

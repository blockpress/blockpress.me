// Globals used in this module
var steem_args, steem_profile, steem_post;

// Steem profile variables
var steem_profile_template,steem_profile;

// Steem post variables
var steem_post_template,steem_post;

// Steem posts variables
var steem_posts_template, steem_posts, steem_posts_displayed, steem_username, steem_tags, steem_posts_count;

/* A special content module for pulling content from steem blockchain */
function steem_menuitem(args) {
	var args_json = JSON.stringify(args);
	// get json object ready for injecting into html href...
	args_json = args_json.replace(/"/g,'&quot;');
	//console.log(args_json);
	return "javascript:steem_load('"+args_json+"');";
}

function steem_display(content) {
	$('#contentArea').html(content);
}
function steem_load(args) {
	steem_args = args;
	//console.log("Inside steem_load.");
//console.log('args: '+args);
	args = JSON.parse(args.replace(/&quot;/g,'"'));
//console.log('args JSON parsed: '+args);
	//console.log(args.show);

	switch(args.show) {
		case "profile":
			//console.log("Get profile of: "+args.user);
			getSteemProfile(args.user);
			break;
		case "posts":
			// First clear contentArea, because we might need to make multiple calls to refill it.
			$('#contentArea').html('');
			steem_posts_displayed = new Array();
			getSteemPosts(args.user,args.tag,args.count,'');
			//console.log("Get posts for: user(s): "+args.user+", tag(s): "+args.tag+", count: "+args.count);
			break;
		case "post":
			getSteemPost(args.user,args.postid);
			//console.log("post: "+args.user+" "+args.postid);
			break;
	}
}
function steemPostsDisplayThumbnail(postid){
	console.log("steemPostsDisplayThumbnail: "+postid);
	$('#'+postid+' img.steemposts_thumbnail').css("display",'inline-block');
	$('#'+postid+' span.steem_posts_preview').css("width",'70%');

}
function displaySteemPosts(err, posts) {
	var template = steem_posts_template;
	// Save posts in global variable
	//console.log(posts);
	steem_posts = posts;

//console.log("steem_username: "+steem_username);

	var args = steem_args;
//console.log("displaySteemPosts args: "+args);
	var content = '', display_count = steem_posts_displayed.length;
	var json_metadata, post_tags, post_obj, body, show_post, last_date, last_permlink, created_date, display_date, loop_end = false;

	var converter = new showdown.Converter();

	// Loop through posts, populate the template and append it to contentArea
	var post, postsLength = steem_posts.length;
	for (var i = 0; i < postsLength && !loop_end; i++) {
		post_obj = steem_posts[i];
		json_metadata = JSON.parse(post_obj.json_metadata);
		post_tags = json_metadata.tags;

		show_post = false;
		if(Array.isArray(steem_tags.isArray)) {
			for(var j =0; j < steem_tags.length; j++) {
				if(post_tags.indexOf(steem_tags[j]) !== -1) show_post = true;
			}
		}
		else if(steem_tags === '') show_post = true;
		else if(post_tags.indexOf(steem_tags) !== -1) show_post = true;

		//console.log("Post "+i+": "+JSON.stringify(post_obj));
		//console.log("metadata "+i+": "+JSON.stringify(json_metadata));

		//console.log("permlink "+i+": "+JSON.stringify(post_obj.permlink));
		//console.log("created "+i+": "+JSON.stringify(post_obj.created));

		if(steem_posts_displayed.indexOf(post_obj.permlink) !== -1) {
			//loop_end = true;
			show_post = false;
		} else {
			last_permlink = post_obj.permlink;
	//console.log("Last permlink: "+last_permlink);
		}

		if(show_post) {
			steem_posts_displayed.push(post_obj.permlink);
			display_count++;
			//template+="post_obj "+i+": "+JSON.stringify(post_obj)+"<br><br>";
			//template+="json_metadata "+i+": "+JSON.stringify(json_metadata);

			// Insert post values for this post
			template = template.replace(/{steem_posts_tag}/g,post_obj.category);
			template = template.replace(/{steem_posts_title}/g,post_obj.title);
			template = template.replace(/{steem_posts_permlink}/g,post_obj.permlink);
			template = template.replace(/{steem_posts_img}/g,json_metadata.image);
			template = template.replace(/{steem_posts_author}/g,post_obj.author);

			created_date=new Date(post_obj.created);
			display_date = created_date.toLocaleDateString(config.dateformat.locale, config.dateformat.options);
			template = template.replace(/{steem_posts_date}/g,display_date);

			// Full body
			body = converter.makeHtml(post_obj.body);
			template = template.replace('{steem_posts_body}',body);

			// Body preview
			body = body.replace(/<(?:.|\n)*?>/gm, ''); //strip html
			if(body.length > 250) body = body.substring(0,247)+'...';
			template = template.replace('{steem_posts_preview}',body);

			// Append post to content string if it has a matching tag
			content += template;
			//Reset template
			var template = steem_posts_template;
		}
	}
	if(display_count < steem_posts_count && !loop_end) {
//console.log("username: "+steem_username);
//console.log("steem_posts_count: "+steem_posts_count);
//console.log("last_permlink: "+last_permlink);
		getSteemPosts(steem_username,steem_tags,steem_posts_count,last_permlink);
	}
	if(loop_end) console.log('Blocked infinite loop. Quitting...');
	if(display_count >= steem_posts_count) {
		//console.log('Reached post limit. Quitting...');
		//console.log(steem_posts_displayed);
	}
	// Append content to contentArea
	$('#contentArea').append(content);
}
function getSteemPosts(usernames,tags,count,lastPermlink) {
//console.log('getSteemPosts usernames: '+usernames+' tags: '+tags+' count: '+count+' lastPermlink: '+lastPermlink);
	if (typeof count === "undefined") count=10; // Default to 10 if no count specified.
	if (typeof lastPermlink === "undefined") lastPermlink=''; // Default to 10 if no count specified.

	steem_tags = tags;
	steem_posts_count = count;
	steem_username = usernames;
//console.log('usernames: '+usernames+' tags: '+tags+' count: '+count+' lastPermlink: '+lastPermlink);

	steem.api.getDiscussionsByAuthorBeforeDate(usernames, lastPermlink, '2100-01-01T00:00:00', count,	function(err, result){displaySteemPosts(err, result)});
	//displaySteemPosts(['AAA']);
}

function displaySteemPost(err, post) {
	// Save post in global variable
	steem_post = post;

	var template = steem_post_template;


	// Insert post values for this post
	template = template.replace(/{steem_post_category}/g,steem_post.category);
	template = template.replace(/{steem_post_title}/g,steem_post.title);
	template = template.replace(/{steem_post_permlink}/g,steem_post.permlink);
	template = template.replace(/{steem_post_author}/g,steem_post.author);

	// Display template
	$('#contentArea').html(template);

		//console.log(steem_post.body);
// Convert markdown into html
	var converter = new showdown.Converter();
	var body_html = converter.makeHtml(steem_post.body);

	//console.log(body_html);
	// Then add post values
	$("#steem-post-content").html(body_html);
	$("#steem-post-title").html(steem_post.title);
}
function getSteemPost(username,postid) {
	//
	steem.api.getContent(username, postid,	function(err, result){displaySteemPost(err, result)});
}

function simpleReputation(raw_reputation) {
	var simple_reputation = Math.log10(raw_reputation);
	simple_reputation = simple_reputation - 9;
	simple_reputation = simple_reputation * 9;
	simple_reputation = simple_reputation + 25;
	return simple_reputation;
}

function displaySteemProfile(err, profile) {
	// Save profile in global variable
	steem_profile = profile[0];
	template = steem_profile_template;
	console.log(steem_profile);

	var metadata = JSON.parse(steem_profile.json_metadata);
	template = template.replace('{steem_profile_website}','<a href="'+metadata.profile.website+'">'+metadata.profile.website+'</a>');
template = template.replace('{steem_profile_location}',metadata.profile.location);
	// Display template
	$('#contentArea').html(template);

	// Then add profile values

	console.log(metadata.profile);
	console.log("profile image: "+metadata.profile.profile_image);
	$("#profile-banner").css("background","url("+metadata.profile.cover_image+") no-repeat");
	$("#profile-banner").css("background-position","center");
	$("#profile-image").html('<img src="'+metadata.profile.profile_image+'">');
	$("#profile-username").html('@'+steem_profile.name);
	$("#profile-name").html(metadata.profile.name);
	var reputation = simpleReputation(steem_profile.reputation);
	$("#profile-reputation").html(Math.round(reputation));
	$("#profile-about").html(metadata.profile.about);
	$("#profile-location").html(metadata.profile.location);
	$("#profile-website").html('<a href="'+metadata.profile.website+'">'+metadata.profile.website+'</a>');
}
function getSteemProfile(username) {
	//
	steem.api.getAccounts([username],	function(err, profile){displaySteemProfile(err, profile)});
}

//Load the showdown library (for parsing markdown)
$.getScript( "lib/showdown/showdown.min.js").done(function( script, textStatus ) {
		//console.log( textStatus );
		console.log( "showdown.min.js load was performed." );
	})
	.fail(function( jqxhr, settings, exception ) {
		console.log( exception );
		console.log( jqxhr.status );
		console.log( settings );
		$( "div.log" ).text( "Triggered ajaxError handler." );
	});


//Load the steem javascript API
$.getScript( "lib/steem-js/steem.min.js", function( data, textStatus, jqxhr ) {
	//console.log( data ); // Data returned
	//console.log( textStatus ); // Success
	//console.log( jqxhr.status ); // 200
	console.log( "steem.min.js load was performed." );
});

//Template loaded functions
function steemProfileTemplateLoaded(template) {
	steem_profile_template = template;
	console.log( "steem ProfileTemplate load was performed." );
}
function steemPostTemplateLoaded(template) {
	steem_post_template = template;
	console.log( "steem PostTemplate load was performed." );
}
function steemPostsTemplateLoaded(template) {
	steem_posts_template = template;
	console.log( "steem PostsTemplate load was performed." );
}
//Load the templates
function loadSteemTemplates() {
	// Get template from theme
	var theme_template = "/theme/"+config.theme+"/steem-profile.html";
	$.ajax(theme_template).done(steemProfileTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("/module/steem/steem-profile.html").done(steemProfileTemplateLoaded);
	});
	// Get template from theme
	var theme_template = "/theme/"+config.theme+"/steem-post.html";
	$.ajax(theme_template).done(steemPostTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("/module/steem/steem-post.html").done(steemPostTemplateLoaded);
	});
	// Get template from theme
	var theme_template = "/theme/"+config.theme+"/steem-posts.html";
	$.ajax(theme_template).done(steemPostsTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("/module/steem/steem-posts.html").done(steemPostsTemplateLoaded);
	});
}
loadSteemTemplates();

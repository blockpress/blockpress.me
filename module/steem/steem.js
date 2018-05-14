// Globals used in this module
var steem_args, steem_profile, steem_post, steem_libs_to_load = 2;

// Steem profile variables
var steem_profile_template,steem_profile;

// Steem post variables
var steem_post_template,steem_post;

// Steem posts variables
var steem_posts_template, steem_posts, steem_posts_displayed, steem_username, steem_tags, steem_posts_count;

// Steem comment variables
var steem_comment_template;

/* A special content module for pulling content from steem blockchain */
function steem_menuitem(args) {
	var args_json = JSON.stringify(args);
	// get json object ready for injecting into html href...
	args_json = args_json.replace(/"/g,'&quot;');
	return "javascript:steem_load('"+args_json+"');";
}

function steem_display(content) {
	$('#contentArea').html(content);
}
function steem_load(args) {
	if(steem_libs_to_load > 0) {
		// Try to call menu again in 1/10 of a second.
		setTimeout(function () {
			steem_load(args);
		}, 100);
		return null;
	}

	steem_args = args;
	args = JSON.parse(args.replace(/&quot;/g,'"'));

	switch(args.show) {
		case "profile":
			getSteemProfile(args.user,args.tag);
			break;
		case "posts":
			// First clear contentArea, because we might need to make multiple calls to refill it.
			$('#contentArea').html('');
			steem_posts_displayed = new Array();
			getSteemPosts(args.user,args.tag,args.count,'');
			if(args.user == '') { pushStateWithoutDuplicate('Posts tagged '+args.tag, './?p=steem/posts/'+args.tag); }
			else { pushStateWithoutDuplicate('Posts by '+args.user, './?p=steem/'+args.tag+'/@'+args.user); }
			break;
		case "post":
			getSteemPost(args.user,args.postid);
			break;
	}
}
function steem_permlink(permlink) {
	let args, username;
	switch(permlink.length) {
		case 1:
			// username -> profile
			// @username -> profile
			if(permlink[0].substring(0,1) == "@") {	username = permlink[0].substring(1); }
			else { username = permlink[0]; }

			args = '{"show":"profile","user":"'+username+'"}';
			break;
		case 2:
			if(permlink[0].substring(0,1) == "@") {
				// @username/tag -> profile with posts for a tag
				args = '{"show":"profile","user":"'+permlink[0].substring(1)+'","tag":"'+permlink[1]+'"}';
			} else if (permlink[1].substring(0,1) == "@") {
				// tag/@username -> postlisting for a user by tag
				args = '{"show":"posts","user":"'+permlink[1].substring(1)+'","tag":"'+permlink[0]+'"}';
			} else {
				// posts/tag -> post listing (not yet implemented)
				args = '{"show":"posts","user":"","tag":"'+permlink[1]+'"}';
			}

			break;
		case 3:
			// tag/@username/post_permlink -> post
			args = '{"show":"post","user":"'+permlink[1].substring(1)+'","postid":"'+permlink[2]+'"}';
			break;
	}
  steem_load(args);
}

function displaySteemPosts(err, posts) {
	var template = steem_posts_template;
	// Save posts in global variable
	steem_posts = posts;

	var args = steem_args;
	var content = '', display_count = steem_posts_displayed.length;
	var json_metadata, post_tags, post_obj, body, show_post, last_date, last_permlink, created_date, display_date, loop_end = false;

	var converter = new showdown.Converter();

	// Loop through posts, populate the template and append it to contentArea
	var post, postsLength = steem_posts.length;
	if(postsLength == 0) {
		loop_end = true;
	}
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

		if(steem_posts_displayed.indexOf(post_obj.permlink) !== -1) {
			show_post = false;
		} else {
			last_permlink = post_obj.permlink;
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
			template = template.replace(/{steem_posts_author}/g,post_obj.author);

			created_date=new Date(post_obj.created);
			display_date = created_date.toLocaleDateString(config.dateformat.locale, config.dateformat.options);
			template = template.replace(/{steem_posts_date}/g,display_date);

			// Full body
			body = converter.makeHtml(post_obj.body);
			var imgSrc=findImg(body);
			template = template.replace(/{steem_posts_img}/g,imgSrc);
			template = template.replace(/{steem_posts_body}/g,body);

			findImg();

			// Body preview
			body = body.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/gm,""); //strip html
			//body= $(body).find("img").remove().end().html();
			template = template.replace('{steem_posts_preview}',body);

			// Append post to content string if it has a matching tag
			content += template;
			//Reset template
			var template = steem_posts_template;
		}
	}
	if(display_count < steem_posts_count && !loop_end) {
		getSteemPosts(steem_username,steem_tags,steem_posts_count,last_permlink);
	}

	if ($(".profile-posts")[0]){
		// Append content to contentArea
		$('.profile-posts').append(content);
	} else {
		// Append content to contentArea
		$('#contentArea').append(content);
	}

	// Add onload event to thumbnails...
	$('.steem_posts_thumbnail img').on('load',function (e){
		thumbLoaded(this.id);
	});
}

function findImg(html_string){
	var firstimg = $(html_string).find("img:first").attr("src");
	return firstimg;
}

function getSteemPosts(usernames,tags,count,lastPermlink) {
	if (typeof count === "undefined") count=10; // Default to 10 if no count specified.
	if (typeof lastPermlink === "undefined") lastPermlink=''; // Default to empty string if no permlink specified.

	steem_tags = tags;
	steem_posts_count = count;
	steem_username = usernames;

	steem.api.setOptions({ url: 'https://api.steemit.com' });
	if(usernames == '') {
		let query = {
		    tag: tags, // This tag is used to filter the results by a specific post tag
		    limit: count, // This limit allows us to limit the number of results returned to 5
		};
		steem.api.getDiscussionsByCreated(query,function(err, result){displaySteemPosts(err, result)});
	}	else { steem.api.getDiscussionsByAuthorBeforeDate(usernames, lastPermlink, '2100-01-01T00:00:00', count,	function(err, result){displaySteemPosts(err, result)}); }
	//displaySteemPosts(['AAA']);
}

function tagSelected(username,tag,count) {
	// Tag is selected, so clear currently displayed posts...
	if ($(".profile-posts")[0]){
		// Clear posts area of profile page
		$('.profile-posts').html('');
		pushStateWithoutDuplicate('Posts by @'+username+' tagged '+tag, './?p=steem/@'+username+'/'+tag);
	} else if(tag,count){
		$('#contentArea').html('');
		pushStateWithoutDuplicate('Posts tagged #'+steem_tags,'./?p=steem/posts/'+steem_tags);

	}
		else {
		// Clear contentArea
		$('#contentArea').html('');
		pushStateWithoutDuplicate('Posts tagged #'+tag+' by @'+username, './?p=steem/'+tag+'/@'+username);
	}
	steem_posts_displayed = new Array();
	getSteemPosts(username,tag,count,'');
}

function thumbLoaded(thumb_id){
	var Permlink=thumb_id.substring(5);
	var divID="steem_posts_"+Permlink;
	$("#"+divID).removeClass("no_thumb");
	$("#"+divID).addClass("has_thumb");
}

function displaySteemComment(comment_obj,target) {
	var converter = new showdown.Converter();
	author = comment_obj.author;
	comment = converter.makeHtml(comment_obj.body);
	comment = addLinksToUsr(addLinksToTags(comment));

	template = steem_comment_template;
	template = template.replace(/{steem_comment}/g,comment);
	template = template.replace(/{steem_comment_author}/g,comment_obj.author);
	template = template.replace(/{steem_comment_permlink}/g,comment_obj.permlink);

	created_date=new Date(comment_obj.created);
	display_date = created_date.toLocaleDateString(config.dateformat.locale, config.dateformat.options);
	template = template.replace(/{steem_comment_date}/g,display_date);
	$(target).append(template).show(500);

	if(comment_obj.children > 0) getSteemComments(comment_obj.author,comment_obj.permlink);
}
function displaySteemComments(err, comments) {
	var author, comment, template, created_date, display_date, commentsLength = comments.length;
	for (var i = 0; i < commentsLength; i++) {
			comment_obj = comments[i];

			displaySteemComment(comment_obj,'#'+comment_obj.parent_permlink+'_comments');
	}
}
function getSteemComments(username,permlink) {
	steem.api.setOptions({ url: 'https://api.steemit.com' });
	steem.api.getContentReplies(username, permlink,	function(err, result){displaySteemComments(err, result)});
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
console.log('steem_post: '+JSON.stringify(steem_post));
	// Display template
	$('#contentArea').html(template);
	pushStateWithoutDuplicate(steem_post.title+' by '+steem_post.author, './?p=steem/'+steem_post.category+'/@'+steem_post.author+'/'+steem_post.permlink);

	// Convert markdown into html
	var converter = new showdown.Converter();
	var body_html = converter.makeHtml(steem_post.body);

	// Then add post values
	$("#steem-post-content").html(addLinksToUsr(addLinksToTags(body_html)));
	$("#steem-post-title").html(steem_post.title);

	// Get comments
	getSteemComments(steem_post.author,steem_post.permlink);
}


function getSteemPost(username,postid) {
	steem.api.setOptions({ url: 'https://api.steemit.com' });
	steem.api.getContent(username, postid,	function(err, result){displaySteemPost(err, result)});
}

function simpleReputation(raw_reputation) {
	var simple_reputation = Math.log10(raw_reputation);
	simple_reputation = simple_reputation - 9;
	simple_reputation = simple_reputation * 9;
	simple_reputation = simple_reputation + 25;
	return simple_reputation;
}

function addLinksToTags(text,author) {
	if (typeof author === "undefined") author=''; // Default to all users if no user specified.
	text = text.replace(/\s#(\S+)/g,' <a href="javascript:tagSelected(\''+author+'\',\'$1\',25,\'\');" title="View posts tagged with #$1">#$1</a>');
	return text;
}

function addLinksToUsr(text){
	text = text.replace(/\s@([-_\w\d]+)/g,' <a href="javascript:getSteemProfile(\'$1\');" title="View user mention @$1">@$1</a>');
	return text;
}

function displaySteemProfile(err, profile) {
	// Save profile in global variable
	steem_profile = profile[0];
	template = steem_profile_template;

	var metadata = JSON.parse(steem_profile.json_metadata);
	template = template.replace(/{steem_profile_website}/g,'<a href="'+metadata.profile.website+'">'+metadata.profile.website+'</a>');
	var location='';
	if (typeof metadata.profile.location != 'undefined') location=metadata.profile.location;
	template = template.replace(/{steem_profile_location}/g,location);
	template = template.replace(/{steem_profile_username}/g,steem_profile.name);

	// Display template
	$('#contentArea').html(template);


	// Then add profile values
	$("#profile-banner").css("background","url("+metadata.profile.cover_image+") no-repeat");
	$("#profile-banner").css("background-position","center");
	$("#profile-image").html('<img src="'+metadata.profile.profile_image+'">');
	$("#profile-username").html('@'+steem_profile.name);
	$("#profile-name").html(metadata.profile.name);
	var reputation = simpleReputation(steem_profile.reputation);
	$("#profile-reputation").html(Math.round(reputation));
	$("#profile-about").html(addLinksToUsr(addLinksToTags(metadata.profile.about,steem_profile.name)));
	if (typeof metadata.profile.location != 'undefined') $("#profile-location").html(metadata.profile.location);
	$("#profile-website").html('<a href="'+metadata.profile.website+'">'+metadata.profile.website+'</a>');

	// If profile template has a space for user posts.
	if ($(".profile-posts")[0]){
		if(typeof steem_tags == 'undefined') {
			steem_posts_displayed = new Array();
			getSteemPosts(steem_profile.name,'',25,'');
			pushStateWithoutDuplicate('Profile page for '+metadata.profile.name, './?p=steem/@'+steem_profile.name);
		} else {
			steem_posts_displayed = new Array();
			getSteemPosts(steem_profile.name,steem_tags,25,'');
			pushStateWithoutDuplicate('Profile page for '+metadata.profile.name+' tagged #'+steem_tags, './?p=steem/@'+steem_profile.name+'/'+steem_tags);
		}
	} else {
		pushStateWithoutDuplicate('Profile page for '+metadata.profile.name, './?p=steem/@'+steem_profile.name);		
	}
}
function getSteemProfile(username,tag) {
	steem_tags = tag;
	steem.api.setOptions({ url: 'https://api.steemit.com' });
	steem.api.getAccounts([username],	function(err, profile){displaySteemProfile(err, profile)});
}

//Load the showdown library (for parsing markdown)
$.getScript( "lib/showdown/showdown.min.js").done(function( script, textStatus ) {
		console.log( "showdown.min.js load was performed." );
		steem_libs_to_load--;
	})
	.fail(function( jqxhr, settings, exception ) {
		console.log( exception );
		console.log( jqxhr.status );
		console.log( settings );
		$( "div.log" ).text( "Triggered ajaxError handler." );
	});


//Load the steem javascript API
$.getScript( "lib/steem-js/steem.min.js", function( data, textStatus, jqxhr ) {
	console.log( "steem.min.js load was performed." );
	steem_libs_to_load--;
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
function steemCommentTemplateLoaded(template) {
	steem_comment_template = template;
	console.log( "steem CommentTemplate load was performed." );
}
//Load the templates
function loadSteemTemplates() {
	// Get template from theme
	var theme_template = "./theme/"+config.theme+"/steem-profile.html";
	$.ajax(theme_template).done(steemProfileTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("./module/steem/steem-profile.html").done(steemProfileTemplateLoaded);
	});
	// Get template from theme
	var theme_template = "./theme/"+config.theme+"/steem-post.html";
	$.ajax(theme_template).done(steemPostTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("./module/steem/steem-post.html").done(steemPostTemplateLoaded);
	});
	// Get template from theme
	var theme_template = "./theme/"+config.theme+"/steem-posts.html";
	$.ajax(theme_template).done(steemPostsTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("./module/steem/steem-posts.html").done(steemPostsTemplateLoaded);
	});
	// Get template from theme
	var theme_template = "./theme/"+config.theme+"/steem-comment.html";
	$.ajax(theme_template).done(steemCommentTemplateLoaded).fail(function(){
		// Else use default template
		$.ajax("./module/steem/steem-comment.html").done(steemCommentTemplateLoaded);
	});
}
loadSteemTemplates();

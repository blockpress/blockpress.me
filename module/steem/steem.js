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
	console.log(args);
	steem.api.getAccounts(['antonchanning', 'dana-varahi'], function(err, response) {
		var output = JSON.stringify(response)
	   // console.log(err, JSON.stringify(response));
			steem_display("<p>This is where the fun begins. We'll now be loading content from steem. "+output+"</p>");
	});

	/* $.ajax({
		type: 'GET',
		url: file
	}).done(steem_display); */
}

//Load the steem javascript API
$.getScript( "module/steem/steem.min.js", function( data, textStatus, jqxhr ) {
	console.log( data ); // Data returned
	console.log( textStatus ); // Success
	console.log( jqxhr.status ); // 200
	console.log( "Load was performed." );
});

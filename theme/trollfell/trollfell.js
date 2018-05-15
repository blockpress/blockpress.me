$.getScript( "lib/transit/jquery.transit.min.js", function( data, textStatus, jqxhr ) {
	console.log( "jquery.transit.min.js load was performed." );
});


$('#openNav').click(function() {
  $("#sidebar").transition({ x: '+=300px' });
  $("#leftpad").transition({'padding-left': "300px"},400);
  $("#contentArea").transition({'width':'95%','display':'inline-block'},400);
  $("#openNav").hide();
});

$('#closeNav').click(function() {
  console.log('closenav');
  $("#sidebar").transition({ x :'-=300px' });
  $("#leftpad").transition({'padding-left': "0"},400)
  $("#contentArea").transition({'width':'70%','display':'block'},400);
  $("#openNav").show();
});

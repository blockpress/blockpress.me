$.getScript( "lib/transit/jquery.transit.min.js", function( data, textStatus, jqxhr ) {
	console.log( "jquery.transit.min.js load was performed." );
});


$('#openNav').click(function() {
  $("#sidebar").transition({ x: '+=300px', delay: 200});
  $("#leftpad").transition({'padding-left': "300px",delay: 200},400, 'ease');
  $("#contentArea").transition({'width':'95%','display':'inline-block',delay: 200},400,'ease');
  $("#openNav").transition({scale:0,delay: 100});
});

$('#closeNav').click(function() {
  console.log('closenav');
  $("#sidebar").transition({ x :'-=300px', delay: 200 });
  $("#leftpad").transition({'padding-left': "0",delay: 200},400,'ease')
  $("#contentArea").transition({'width':'70%','display':'block',delay: 200},400,'ease');
  $("#openNav").transition({scale:1,delay: 100});
});

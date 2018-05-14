$('#openNav').click(function() {
  $("#leftpad").animate({'padding-left': "300px"},400);
  $("#contentArea").animate({'width':'95%','display':'inline-block'},400);
  $("#sidebar").show(400);
  $("#openNav").hide();
});

$('#closeNav').click(function() {
  $("#leftpad").animate({'padding-left': "0px"},400)
  $("#contentArea").animate({'width':'70%','display':'block'},400);
  $("#sidebar").hide(400);
  $("#openNav").show();
});

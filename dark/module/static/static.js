function static_menuitem(args) {
  return "javascript:static_onclick('"+args[0]+"');";
}

function static_load(content) {
  $('#contentArea').html(content);
}
function static_onclick(file) {
  $.ajax({
      type: 'GET',
      url: file
  }).done(static_load)
};

/* The simplest form of content module */
function static_menuitem(args) {
  return "javascript:static_load('"+args+"');";
}

function static_display(content) {
  $('#contentArea').html(content);
}
function static_load(file) {
  $.ajax({
      type: 'GET',
      url: file
  }).done(static_display);
}
function static_permlink(permlink) {
  static_load(permlink);
}

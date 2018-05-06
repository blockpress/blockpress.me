/* The simplest form of content module */
function static_menuitem(args) {
  return "javascript:static_load('"+args+"');";
}

function static_display(content) {
  $('#contentArea').html(content);
}
function static_load(file) {
  pushStateWithoutDuplicate(file, './?p=static/'+file);
  $.ajax({
      type: 'GET',
      url: "content/"+file
  }).done(static_display);
}
function static_permlink(permlink) {
  permlink = permlink.join("/");
  static_load(permlink);
}

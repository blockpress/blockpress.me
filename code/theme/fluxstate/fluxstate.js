  function displayMenu() {
    $(".fluxstate-screen").hide();
    $("#mainMenu").show();
    $("#mainMenu").click(function(){
      displayContent();
    });
  }
  function displayContent() {
    $(".fluxstate-screen").hide();
    $("#contentArea").show();
  }
  function displaySocial() {
    $(".fluxstate-screen").hide();
    $("#socialMenu").show();
  }

    function cat_menuitem(args) {
        return "javascript:cat_load('');";
    }

    function cat_load() {
        pushStateWithoutDuplicate('CATS!', './?p=cat/');
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: "http://aws.random.cat/meow"
        }).done(cat_display).fail(cat_display);
    }

    function cat_display(cat) {
      console.log(cat);
      if(cat.hasOwnProperty('file')) {
        console.log('random cat');
          var cat_img_src = cat.file;

          var content="<h1>CATS!</h1>";
          content+="<img src='"+cat_img_src+"' style='max-width:100%;'>";
          content+="<p>Visit <a href='http://random.cat'>random.cat</a> for a random cat.</p>";
          $('#contentArea').html(content);
      } else if(cat.hasOwnProperty('fact')) {
        console.log('random cat fact');
          var cat_fact = cat.file;

          var content="<h1>CAT FACT!</h1>";
          content+="<p>Sometimes the random cat API does not work, perhaps it gets overloaded.</p>";
          content+="<p>Have a <a href='https://catfact.ninja'>random cat fact</a> instead.</p>";
          content+="<p>"+cat_fact+"</p>";
          content+="<p>Visit <a href='http://random.cat'>random.cat</a> for a random cat.</p>";
          $('#contentArea').html(content);
      } else {
        console.log('not object');
          $.ajax({
              type: 'GET',
              dataType: "json",
              url: "https://catfact.ninja/fact"
          }).done(cat_display).fail(cat_fail);
      }
    }

    function cat_permlink(permlink) {
        permlink = permlink.join("/"); // permlink is always an array. Turn into string.
        cat_load(permlink);
    }

    function cat_fail(error) {
      console.log('error'+error);
        console.log(error);
        var content="<h1>CATS NOT FOUND!</h1>";
        content+="<p>Sometimes the random cat API does not work, perhaps it gets overloaded.</p>";
        content+="<p>Visit <a href='http://random.cat'>random.cat</a> for a random cat instead.</p>";
        $('#contentArea').html(content);
    }

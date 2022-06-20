var chapitres = [
  {
    id: 1,
    numero: 1,
    titre: "Introduction java",
    nbp: 5
  },

];

$.each(chapitres, function(i, user) {
  appendToUsrTable(user);
});

$("form").submit(function(e) {
  e.preventDefault();
});

$("form#addUser").submit(function() {
  var user = {};
  var numeroInput = $('input[numero="numero"]').val().trim();
  var titreInput = $('input[numero="titre"]').val().trim();
  var nbpInput = $('input[numero="nbp"]').val().trim();
  if (numeroInput && titreInput && nbpInput) {
    $(this).serializeArray().map(function(data) {
      user[data.numero] = data.value;
    });
    var lastUser = chapitres[Object.keys(chapitres).sort().pop()];
    user.id = lastUser.id + 1;

    addUser(user);
  } else {
    alert("All fields must have a valid value.");
  }
});

function addUser(user) {
  chapitres.push(user);
  appendToUsrTable(user);
}

function editUser(id) {
  chapitres.forEach(function(user, i) {
    if (user.id == id) {
      $(".modal-body").empty().append(`
                <form id="updateUser" action="">
                    <label for="numero">numero</label>
                    <input class="form-control" type="text" numero="numero" value="${user.numero}"/>
                    <label for="titre">titre</label>
                    <input class="form-control" type="text" numero="titre" value="${user.titre}"/>
                    <label for="nbp">nbp</label>
                    <input class="form-control" type="number" numero="nbp" value="${user.nbp}" min=10 max=100/>
            `);
      $(".modal-footer").empty().append(`
                    <button type="button" type="submit" class="btn btn-primary" onClick="updateUser(${id})">Save changes</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </form>
            `);
    }
  });
}

function deleteUser(id) {
  var action = confirm("Are you sure you want to delete this user?");
  var msg = "User deleted successfully!";
  chapitres.forEach(function(user, i) {
    if (user.id == id && action != false) {
      chapitres.splice(i, 1);
      $("#userTable #user-" + user.id).remove();
      flashMessnbp(msg);
    }
  });
}

function updateUser(id) {
  var msg = "User updated successfully!";
  var user = {};
  user.id = id;
  chapitres.forEach(function(user, i) {
    if (user.id == id) {
      $("#updateUser").children("input").each(function() {
        var value = $(this).val();
        var attr = $(this).attr("numero");
        if (attr == "numero") {
          user.numero = value;
        } else if (attr == "titre") {
          user.titre = value;
        } else if (attr == "nbp") {
          user.nbp = value;
        }
      });
      chapitres.splice(i, 1);
      chapitres.splice(user.id - 1, 0, user);
      $("#userTable #user-" + user.id).children(".userData").each(function() {
        var attr = $(this).attr("numero");
        if (attr == "numero") {
          $(this).text(user.numero);
        } else if (attr == "titre") {
          $(this).text(user.titre);
        } else {
          $(this).text(user.nbp);
        }
      });
      $(".modal").modal("toggle");
      flashMessnbp(msg);
    }
  });
}

function flashMessnbp(msg) {
  $(".flashMsg").remove();
  $(".row").prepend(`
        <div class="col-sm-12"><div class="flashMsg alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>${msg}</strong></div></div>
    `);
}

function appendToUsrTable(user) {
  $("#userTable > tbody:last-child").append(`
        <tr id="user-${user.id}">
            <td class="userData" numero="numero">${user.numero}</td>
            '<td class="userData" numero="titre">${user.titre}</td>
            '<td id="tdnbp" class="userData" numero="nbp">${user.nbp}</td>
            '<td >
                <a href="vidpdf.html"><button class="btn btn-warning form-control"  >Add Vid/Pdf</button></a>
            </td>
            '<td align="center">
                <button class="btn btn-success form-control" onClick="editUser(${user.id})" data-toggle="modal" data-target="#myModal")">EDIT</button>
            </td>
            <td align="center">
                <button class="btn btn-danger form-control" onClick="deleteUser(${user.id})">DELETE</button>
            </td>
        </tr>
    `);
}
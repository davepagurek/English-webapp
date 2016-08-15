function makeHTML(ast, sentence) {
  var div = $("<div>", { "class": "ast" });
  if (ast.children.length > 0) {
    ast.children.forEach(function(pair) {
      for (var key in pair) {
        if (key != "word" && key != "end") {
          var child = $("<div>", { "class": "child" });
          var type = $("<div>", { "class": "type" });
          type.text(key);
          child.append(makeHTML(pair[key], sentence));
          child.append(type);
          div.append(child);
        } else {
          div.append(makeHTML(pair[key], sentence));
        }
      }
    });
  } else {
    div.addClass("leaf");
    div.text(sentence.substring(ast.from, ast.to));
  }
  return div;
}

$("#sentence").keyup(function (e) {
  if (e.keyCode == 13) {
    parse();
  }
});
$("#parse").click(function() {
  parse();
});

function parse() {
  $("#parse").removeClass("unclicked");
  $("#loader").removeClass("hidden");
  $("#result").addClass("hidden");
  $.ajax({
    url: "/parse",
    data: {text: $("#sentence").val()}
  }).done(function(data) {
    $("#loader").addClass("hidden");
    $("#result").empty();
    if (data.error) {
      $("#result").text(data.error);
    } else {
      $("#result").append(makeHTML(data.ast, data.sentence));
    }
    $("#result").removeClass("hidden");
  })
  .fail(function() {
    $("#loader").addClass("hidden");
    $("#result").empty();
    $("#result").text("Server error :(");
    $("#result").removeClass("hidden");
  });
}

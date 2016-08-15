$(document)
.one('focus.textarea', '.autoExpand', function(){
  var savedValue = this.value;
  this.value = '';
  this.baseScrollHeight = this.scrollHeight;
  this.value = savedValue;
})
.on('input.textarea', '.autoExpand', function(){
  var minRows = this.getAttribute('data-min-rows')|0,
    rows;
  this.rows = minRows;
  rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
  this.rows = minRows + rows;
});

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

$("#parse").click(function() {
  $("#loader").removeClass("hidden");
  $("#result").addClass("hidden");
  $.ajax({
    url: "/parse",
    data: {text: $("#sentence").val()}
  }).done(function(data) {
    $("#loader").addClass("hidden");
    $("#result").empty();
    $("#result").append(makeHTML(data.ast, data.sentence));
    $("#result").removeClass("hidden");
  })
  .fail(function() {
    $("#loader").addClass("hidden");
    $("#result").empty();
    $("#result").text("Couldn't parse your sentence :(");
    $("#result").removeClass("hidden");
  });
});

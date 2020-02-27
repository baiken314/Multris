/* global scoreJSON */

$(document).ready(() => {
  // make sure connection is https
  if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
  // focus on name input, store name in window.name
  $("#name-input").val(window.name);
  $("#name-input").focus();
  // get scores
  fetch("https://multris.glitch.me/scores")
  .then(res => {
    return res.json();
  })
  // then display scores
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      $("score-board").append(
        '<h2 class="name" style="color: #59f">' + data[i].name + '</h2>' +
        '<h2 class="score" style="color: #f59">' + data[i].score + '</h2>' +
        '<div class="break"></div>'
      );
    }
  });
});

// play button click
function startGame() {
  let name = $("#name-input").val();
  name = name.replace(/</g, "&lt;");
  name = name.replace(/>/g, "&gt;");
  console.log(name.length);
  window.name = name;
  if (name.length >= 4) {
    window.location.href = "https://multris.glitch.me/play";
  } 
}

$("#play-button").click(() => {
  startGame();
});

$("#name-input").keyup((event) => {
  if (event.keyCode == 13) {
    startGame();
  }
})
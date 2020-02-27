const url = "https://multris.glitch.me";

// post score from script.js
function postScore(name, score) {
  let link = url + "/post-score";
  const scoreJSON = {
    name: name,
    score: score
  }
  fetch(link, {
    method: 'POST',
    headers: {
      'Accept': 'application.json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    body: JSON.stringify(scoreJSON)
  })
  .then(res => res.json())
  .then(data => console.log(data));
  window.setTimeout(() => { window.location.href = url; }, 1000);
}
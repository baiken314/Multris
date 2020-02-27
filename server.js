const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const httpServer = require('http').Server(app);

// setup database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// setup score schema
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number
});

const Score = mongoose.model("Score", scoreSchema);

// setup express app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// get menu
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/menu.html");
});

// get game
app.get("/play", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// get score
app.get("/scores", (req, res) => {
  Score.find({}).sort({"score": -1}).exec((err, data) => {
    res.json(data);
  });
});

// save score
app.post("/post-score", (req, res) => {
  console.log("post score new");
  let score = new Score({
    name: req.body.name,
    score: req.body.score
  });
  Score.find({"name": score.name}).exec((err, data) => {
    // update score if already exists
    if (data.length > 0) {
      if (score.score > data[0].score) {
        data[0].score = score.score;
        data[0].save();
      }
    }
    // add new score
    else {
      score.save((err) => {
        if (err) console.log(err);
      });
    }
  });
  //Score.findOneAndRemove({"name": score.name}).sort({"score": 1}).exec((err) => console.log(err));
});

// run on port
const listener = httpServer.listen(process.env.PORT, () => {
  console.log("Listening on port " + listener.address().port);
});
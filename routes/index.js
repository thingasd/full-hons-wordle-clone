const express = require("express");
const app = express();
const router = express.Router();
const server = require("../server");

const axios = require("axios");
const API_KEY = process.env.API_KEY;

router.get("/", async (req, res) => {
  res.render("index", { word: server.word });
  console.log("[CLIENT] Get Word: " + server.word);
});

router.post("/", async (req, res) => {
  const data = req.body;
  if (data.word != null) {
    checkGuess(req, res, data.word);
  }
});

const checkGuess = async (req, res, guess) => {
  console.log(`Checking ${guess} Valid. . .`);
  try {
    const result = await axios.get(
      `https://api.wordnik.com/v4/word.json/${guess}/definitions?limit=1&api_key=${API_KEY}`
    );
    const correctness = checkGuessByCharater(guess);
    res.send({
      valid: true,
      correctness: correctness,
    }); // 01202
  } catch (error) {
    console.log(error);
    res.send({
      valid: false,
    }); // prevent next row
  }
};

const checkGuessByCharater = (guess) => {
  const AnsChar = server.word.split(""); //apple
  const GuessChar = guess.split(""); //pupil
  let result = [];
  for (let i = 0; i < guess.length; i++) {
    //check position correct
    if (AnsChar[i] == GuessChar[i]) {
      result[i] = 2;
    }
    //check exist
    else if (server.word.includes(GuessChar[i])) {
      result[i] = 1;
    } else {
      result[i] = 0;
    }
  }
  return result;
};

module.exports = router;

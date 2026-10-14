require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OMDB_KEY;
const FILE = "favorites.json";

// ----- read and save favourites (a simple JSON file) -----
function getFavorites() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveFavorites(list) {
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

// ----- 1. Search movies -----
app.get("/api/search", async (req, res) => {
  const url = `https://www.omdbapi.com/?s=${req.query.q}&type=movie&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// ----- 2. Get one movie's details -----
app.get("/api/movie/:id", async (req, res) => {
  const url = `https://www.omdbapi.com/?i=${req.params.id}&plot=full&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// ----- 3. Favourites: get all -----
app.get("/api/favorites", (req, res) => {
  res.json(getFavorites());
});

// ----- 4. Favourites: add one -----
app.post("/api/favorites", (req, res) => {
  const list = getFavorites();
  list.push(req.body);
  saveFavorites(list);
  res.json(req.body);
});

// ----- 5. Favourites: remove one -----
app.delete("/api/favorites/:id", (req, res) => {
  const list = getFavorites().filter((m) => m.imdbID !== req.params.id);
  saveFavorites(list);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
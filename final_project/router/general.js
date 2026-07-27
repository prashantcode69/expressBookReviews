const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matching = [];
  for (let key in books) {
    if (books[key].author === author) {
      matching.push(books[key]);
    }
  }
  res.send(matching);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matching = [];
  for (let key in books) {
    if (books[key].title === title) {
      matching.push(books[key]);
    }
  }
  res.send(matching);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports.general = public_users;

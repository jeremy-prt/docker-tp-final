const express = require("express");
const app = express();
const PORT = 5085;

app.get("/", (req, res) => {
  res.send("Bonjour !");
});

app.listen(PORT, () => {
  console.log(`API run`);
});

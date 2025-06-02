const express = require("express");
const app = express();
const PORT = 5088;

app.use("/public", express.static("."));

app.get("/", (req, res) => {
  res.send("Bonjour !");
});

app.listen(PORT, () => {
  console.log(`API run`);
});

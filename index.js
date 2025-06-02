const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 5088;

app.set("view engine", "ejs");
app.set("views", "./views");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "testdb",
});

// On crée la table et on va inserer les données si elle est vide
connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
  )
`);

connection.query(`
      INSERT INTO users (name) VALUES 
      ('Jeremy'), ('Remi'), ('JeRemiLeGoat')
    `);

app.get("/", (req, res) => {
  connection.query("SELECT name FROM users LIMIT 1", (err, results) => {
    if (err) return res.send("Erreur MySQL");
    const name = results[0]?.name || "Nom non trouvé";
    res.render("pages/index", { name });
  });
});

app.listen(port, () => {
  console.log("API RUN");
});

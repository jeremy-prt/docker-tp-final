const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 5088;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "testdb",
});

// Je fais ça car apparement mon api peut se lancer avant que le container MySQL soit prêt
function connectWithRetry() {
  connection.connect((err) => {
    if (err) {
      console.error(
        "Erreur de connexion à MySQL. Nouvelle tentative dans 5s..."
      );
      setTimeout(connectWithRetry, 5000);
    } else {
      initDatabase();
    }
  });
}

// Je crée si ça existe pas, puis j'insere si y'a 0 donnée
function initDatabase() {
  connection.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50)
    )
  `,
    (err) => {
      if (err) {
        console.error("Erreur création de table:", err);
        return;
      }

      connection.query(
        "SELECT COUNT(*) as count FROM users",
        (err, results) => {
          if (err) {
            console.error("Erreur comptage utilisateurs:", err);
            return;
          }

          if (results[0].count === 0) {
            connection.query(
              `
          INSERT INTO users (name) VALUES 
          ('Jeremy'), ('Remi'), ('JeRemiLeGoat')
        `,
              (err) => {
                if (err) {
                  console.error("Erreur insertion données:", err);
                } else {
                  console.log("Données initiales insérées");
                }
              }
            );
          } else {
            console.log("La table users contient déjà des données");
          }
        }
      );
    }
  );
}

connectWithRetry();

app.get("/users", (req, res) => {
  connection.query("SELECT name FROM users LIMIT 1", (err, results) => {
    if (err) return res.send("Erreur MySQL");
    const name = results[0]?.name || "Nom non trouvé";
    res.render("pages/index", { name });
  });
});

app.listen(port, () => {
  console.log("API en cours d'exécution sur le port", port);
});

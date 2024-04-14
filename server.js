require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/dbConnection");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 4390;
const routes = require("./routes");

connectDB();

app.use(express.json());
app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "app", "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "app", "client", "dist", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

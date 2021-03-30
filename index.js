const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App listening at PORT${port}`);
});

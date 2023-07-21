require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./src/router/index.js");

const app = express();

const port = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/", router);

app.listen(port, () => console.log(`Listening on port ${port}!`));

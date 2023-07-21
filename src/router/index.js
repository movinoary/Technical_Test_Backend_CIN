const express = require("express");
const { register, login, getUser } = require("../controller/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getUser);

module.exports = router;

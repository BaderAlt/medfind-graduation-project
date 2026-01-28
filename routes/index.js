const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



router.get("/", (req, res) => {
    res.render("Index");
});

router.get("/medinfo", (req, res) => {
    res.render("medinfo");
});

router.get("/Medicine-Intraction", (req, res) => {
    res.render("Medicine-Intraction");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/product", (req, res) => {
    res.render("product");
});
router.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
router.get("/intra", (req, res) => {
  res.render("intra");
});

module.exports = router;
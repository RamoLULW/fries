const { Router } = require("express");
const { getHome, getFries } = require("../controllers/index.controllers");

const router = Router();

router.get("/", getHome);
router.get("/fries", getFries);

module.exports = router;

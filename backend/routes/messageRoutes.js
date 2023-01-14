const express = require('express');
const { sendMessage, fetchMessages } = require("../controllers/messageControllers");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(protect, sendMessage);
router.route('/:chatId').get(protect, fetchMessages);

module.exports = router;
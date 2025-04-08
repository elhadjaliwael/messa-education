const express = require("express");
const {
  sendNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const authController = require("./../controllers/authController");
const router = express.Router();

// L'admin peut envoyer une notification
router.post(
  "/send",
  authController.protect,
  authController.restrictTo("admin"),
  sendNotification
);

// Un utilisateur peut voir ses notifications
router.get("/", authController.protect, getUserNotifications);

// Un utilisateur peut marquer une notification comme lue
router.patch("/:id/read", authController.protect, markAsRead);

// Un utilisateur peut supprimer une notification
router.delete("/:id", authController.protect, deleteNotification);

module.exports = router;

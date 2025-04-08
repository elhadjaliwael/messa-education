const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // Référence au modèle utilisateur
      required: [true, "La notification doit appartenir à un utilisateur"],
    },
    message: {
      type: String,
      required: [true, "Le message de la notification est requis"],
    },
    isRead: {
      type: Boolean,
      default: false, // Par défaut, la notification n'est pas lue
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;

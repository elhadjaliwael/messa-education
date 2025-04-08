const Notification = require("../models/notificationModel");
const Auth = require("../models/authModel");

// ✅ Envoyer une notification (Admin uniquement)
exports.sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Créer la notification
    const notification = await Notification.create({ user: userId, message });

    res.status(201).json({
      status: "success",
      data: { notification },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Récupérer toutes les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      results: notifications.length,
      data: { notifications },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    // Vérifier si l'utilisateur est le propriétaire de la notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'avez pas le droit de modifier cette notification",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      status: "success",
      data: { notification },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    // Vérifier si l'utilisateur est le propriétaire de la notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous ne pouvez pas supprimer cette notification",
      });
    }

    await notification.deleteOne();

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

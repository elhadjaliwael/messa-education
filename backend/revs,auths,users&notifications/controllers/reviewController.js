const Review = require("./../models/reviewsModel");

// Obtenir tous les reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Créer un review
exports.createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newReview },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un review (seulement l'utilisateur qui l'a créé)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review introuvable." });
    }

    // Vérifier si l'utilisateur actuel est le propriétaire du review
    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez pas modifier cet avis." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: { updatedReview },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un review (seulement l'utilisateur qui l'a créé)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review introuvable." });
    }

    // Vérifier si l'utilisateur actuel est le propriétaire du review
    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez pas supprimer cet avis." });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

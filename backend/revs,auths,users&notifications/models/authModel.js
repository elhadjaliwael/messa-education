const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const AuthSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Please tell us your name!"] },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["student", "teacher", "parent", "admin"],
    default: "student",
  },
  password: {
    type: String,
    required: [true, "Please tell us your password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  badReviewCount: { type: Number, default: 0 }, // 🚨 Compteur de reviews toxiques
  banUntil: { type: Date, default: null }, // ⏳ Date jusqu'à laquelle user est banni
});

// Avant enregistrement : Hash mdp
AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Suppression champ passwordConfirm

  this.passwordChangedAt = Date.now() - 1000; // Déplacer ici

  next();
});

// Filtrer les utilisateurs désactivés
AuthSchema.pre(/^find/, function (next) {
  this.where({ active: { $ne: false } });
  next();
});

// Comparer password
AuthSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Vérifier si l'utilisateur a changé son mdp après création token
AuthSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < changedTimestamp;
  }
  return false;
};

// Création token reset mdp
AuthSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;

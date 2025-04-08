const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY_JWT, { expiresIn: "2h" });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // l'client maynajamch ya9raha b JavaScript
  };
  if (process.env.Node_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await Auth.create({
      username: req.body.username,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      role: req.body.role,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Veuillez fournir l'email et le mot de passe.",
      });
    }

    const user = await Auth.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Email ou mot de passe incorrect.",
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Vous n'êtes pas connecté !",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const currentUser = await Auth.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "Utilisateur n'existe plus.",
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "Mot de passe modifié récemment. Veuillez vous reconnecter.",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Token invalide ou expiré.",
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Vous n'avez pas les droits d'accès.",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Aucun utilisateur avec cet email.",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;
    const message = `Vous avez demandé une réinitialisation de mot de passe.\n\nCliquez ici : ${resetURL}\nCe lien expire dans 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: "Votre token de réinitialisation (valable 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token envoyé par email.",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Erreur d'envoi de l'email.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Auth.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token invalide ou expiré.",
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select("+password");
    const { passwordCurrent, password, passwordConfirm } = req.body;

    if (!(await user.correctPassword(passwordCurrent, user.password))) {
      return res.status(400).json({
        status: "fail",
        message: "Mot de passe actuel incorrect.",
      });
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

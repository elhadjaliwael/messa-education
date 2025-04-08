const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const User = require("../models/authModel");
/*
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
*/
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${req.file.filename}`);
  next();
};
// Fonction pour filtrer les champs autorisés
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj; // Il faut retourner newObj ici
};

exports.updateMe = async (req, res) => {
  try {
    // Empêcher la mise à jour du mot de passe dans cette route
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        message:
          "Password cannot be updated here, please use updatePassword endpoint.",
      });
    }

    // Filtrer les champs autorisés (ici, on permet seulement "username" et "email")
    const filteredBody = filterObj(req.body, "username", "email");
    if (req.file) filteredBody.photo = req.file.filname;

    // Mise à jour des données de l'utilisateur
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true, // Retourner le document mis à jour
      runValidators: true, // Appliquer les validateurs Mongoose
    });

    // Réponse avec les données mises à jour
    res.status(200).json({
      status: "success",
      data: {
        user, // Utiliser 'user' ici
      },
    });
  } catch (err) {
    // Gérer les erreurs
    res.status(400).json({ err });
  }
};

exports.deletMe = async (req, res) => {
  try {
    // Supprimer l'utilisateur
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({ status: "success", data: null });
  } catch (err) {
    // Gérer les erreurs
    res.status(400).json({ err });
  }
};

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    let date = Date.now();
    let fl = date + "." + file.mimetype.split("/")[1];

    req.savedFilename = fl; // Store the filename in the request object
    cb(null, fl);
  },
});

// add user
(exports.addUser = upload.single("image")),
  async (req, res) => {
    try {
      const data = req.body;
      const user = new User(data);

      if (req.file) {
        user.image = req.savedFilename; // Use filename stored in req
      }

      const savedUser = await user.save();

      res.status(200).send(savedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  };

//get all users
exports.getUsers = async (req, res) => {
  try {
    user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

//get one users
exports.getOneUser = async (req, res) => {
  try {
    id = req.params.id;
    user = await User.findById({ _id: id });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

//update users
exports.updateUser = async (req, res) => {
  try {
    id = req.params.id;
    data = req.body;
    user = await User.findByIdAndUpdate({ _id: id }, data);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

//delete users
exports.deleteUser = async (req, res) => {
  try {
    id = req.params.id;
    user = await User.findByIdAndDelete({ _id: id });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

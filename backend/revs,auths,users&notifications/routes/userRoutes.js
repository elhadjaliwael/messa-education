const express = require("express");

const router = express.Router();

const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

//router.post("/add", usersController.addUser);
router.get("/getAll", authController.protect, usersController.getUsers);
//router.get("/getById/:id", usersController.getOneUser);
//router.put("/update/:id", usersController.updateUser);
//router.delete("/delete/:id",usersController.deleteUser);

router.patch(
  "/updateMe",

  authController.protect,
  usersController.uploadUserPhoto,
  usersController.resizeUserPhoto,
  usersController.updateMe
);
router.delete("/deleteMe", authController.protect, usersController.deletMe);

module.exports = router;

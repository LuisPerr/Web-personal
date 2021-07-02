const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middleware/autheticated');
const multipart = require('connect-multiparty');

const api = express.Router();
const md_upload_avatar = multipart({ uploadDir: './uploads/avatar' })

api.post("/sign-up", UserController.singUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);
api.put("/upload-avatar/:idUsuario", [md_auth.ensureAuth, md_upload_avatar], UserController.uploadAvatar);
api.get("/get-url-avatar/:avatarName", UserController.getUrlAvatar);
api.put("/update-user/:idUsuario", [md_auth.ensureAuth], UserController.updateUser);

module.exports = api;
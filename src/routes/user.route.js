const { createUser, updateUser, getAllUserList, loginUser } = require('../controller/user.controller');
const { verifyToken, isSuperAdmin } = require('../middleware/auth-middleware');

userRouter = require('express').Router();

userRouter.route('/login').post(loginUser)
userRouter.route('/create').post(verifyToken,isSuperAdmin, createUser);
userRouter.route('/update/:userid').patch(verifyToken,isSuperAdmin, updateUser);
userRouter.route('/getallusers').get(verifyToken, getAllUserList);

module.exports = userRouter;
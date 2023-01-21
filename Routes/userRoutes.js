const express=require('express');
const userControllers=require('./../controllers/userControllers');
const authControllers=require('./../controllers/authControllers');



const router= express.Router();

router.route('/signup').post(authControllers.signup);
router.route('/login').post(authControllers.login);
router.route('/updateMyPassword').patch(authControllers.protect,authControllers.updatePassword);
router.route('/updateMe').patch(authControllers.protect,userControllers.updateMe);
router.route('/deleteMe').delete(authControllers.protect,userControllers.deleteMe);

router.route('/').get(userControllers.getAllUsers);
router.route(`/:id`).get(userControllers.getUser);

module.exports=router;

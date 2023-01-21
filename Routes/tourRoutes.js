const express=require('express');
const tourControllers= require('./../controllers/tourControllers');
const authControllers= require('./../controllers/authControllers');

const router= express.Router();

// router.param('id',tourControllers.checkId);

router.route('/')
    .get(authControllers.protect,tourControllers.getAllTours)
    .post(/*tourControllers.CheckBody,*/tourControllers.addTour);

router.route('/:id')
    .get(tourControllers.getTour)
    .patch(authControllers.protect,authControllers.restrictTo('admin','lead-guide','guide') ,tourControllers.updateTour)
    .delete(authControllers.protect,authControllers.restrictTo('admin','lead-guide') ,tourControllers.deleteTour);

module.exports=router;
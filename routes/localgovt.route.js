const express = require('express');
const LGAModel = require('../models/localgovernment.model');
const lgaRouter = express.Router();

//Get: List all the LGAs
lgaRouter.get('/', (req, res) => {

  LGAModel.find({}, (err, data) => 
    {
    res.render('listOfLgas', {Lgas: data})
  });

});

//Get: Create An LGA
lgaRouter.get('/createlga', (req, res) => {
    res.render('createlga');
})

//Post: Create an LGA
lgaRouter.post('/createlga', (req, res) => {
  var model = new LGAModel({
    name: req.body.lga.name
  });

  model.save()
  .then(() => {
    res.redirect('/lga')
  }
  
  )
  .catch((err) => {
    res.render('/lga/createlga')})
})

module.exports = lgaRouter;

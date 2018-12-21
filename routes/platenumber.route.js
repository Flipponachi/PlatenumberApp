const express = require('express');
const PlateNumberModel = require('../models/platenumber.model');
const LgaModel = require('../models/localgovernment.model');
const plateNumberRouter = express.Router();

//Get: List all the LGAs
plateNumberRouter.get('/', (req, res) => {

    res.send("Plate Number routes")
  
});

//Get: Create A plate
plateNumberRouter.get('/createplate', (req, res) => {

    LgaModel.find({}, (err, data) => {
        console.log(data);
        res.render('createplate', {lgas: data})
    })
    
})

//Post: Create a platenumber
plateNumberRouter.post('/createplate', (req, res) => {
  var model = new PlateNumberModel({
    name: req.body.lga.name
  });

  model.save()
  .then(() => {
    res.redirect('/lga')
  }
  
  )
  .catch((err) => {
    res.redirect('/lga/createlga')})
})

module.exports = plateNumberRouter;

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
        res.render('createplate', {lgas: data})
    })
    
})

//Post: Create a platenumber
plateNumberRouter.post('/createplate', (req, res) => {


//Find the LGA and cretae abbreviation
LgaModel.findById(req.body.plates.lgaId)
.then((data) => {
    var lgaName = data.name;
    var plateDetails = [data._id]

    if(lgaName.length > 3){
        var abbrLga = (lgaName.charAt(0) + lgaName.charAt(lgaName.length - 2) + lgaName.charAt(lgaName.length -1)).toUpperCase();
        plateDetails.push(abbrLga);
        return plateDetails
    }
    plateDetails.push(lgaName);
    return plateDetails;
})
.then((plateDetails) => {

    
       //Check if any record in the data base first for the platenumber
        PlateNumberModel.findOne({}).sort({creationTime: -1})
        .then((data) => {
           
            //Amount of plates requested by user
            var noOfPlates = req.body.plates.amount;

            //create new plate number if no records
            if(data === null){           
               //Loop through and create plates
                for(var i = 1; i <= noOfPlates; i++){
                    
                    var newPlatenumber = new PlateNumberModel({
                        number: plateDetails[1]+"00"+i+"AA",
                        lga: plateDetails[0]
                     });
                     newPlatenumber.save();
                }
                
            }
            //Else split last record get the last number
            var lastNumber = data.number.slice(3, -2);
            
            //Check if limit is reached
            var parsedLastNumber = parseInt(lastNumber, 10);

            if(parsedLastNumber === 999){
               //Reset last letter and last number
            }

            //create plates

            //Loop through and create plates
            for(var i = 1; i <= noOfPlates; i++){
                 var amount = (parsedLastNumber+i).toString();                              
                                 
                 var newPlatesNumber = [];
                 if(amount.length === 1){
                     newPlatesNumber.push("00"+amount);
                 }
                 if(amount.length == 2){
                     newPlatesNumber.push("0"+amount);
                 }
                 if(amount.length === 3){
                     newPlatesNumber.push(amount);
                 }

                 //Create new record
                 newPlatesNumber.forEach((num) => {
                      var newPlatenumber = new PlateNumberModel({
                           number: plateDetails[1]+num+"AA",
                           lga: plateDetails[0]
                        });
                 newPlatenumber.save();
                 })
               
            }
            
            

        })
        .catch((err) => {
            
        })


})
.catch((err) => { 
    console.log(err)
});
//Check if any entry in the platenumber table, if no create new entry based on the user input
res.redirect('/lga');
})

module.exports = plateNumberRouter;

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

    LgaModel.find({}).sort({creationTime: -1, number: -1})
    .then((data) => res.render('createplate', {lgas: data}))
    
})

//Get plates
plateNumberRouter.get('/getPlates', (req, res) => {

    LgaModel.find({}, (err, data) => {
        res.render('getplates', {lgas: data})
    })
    
    
})

//Post: Get plates
plateNumberRouter.post('/getPlates', (req, res) => {
    PlateNumberModel.find({lga:req.body.plates.lgaId })
    .then((data) => {
        res.render('plates', {plates: data})
    })
    .catch((err) => { console.log("This is the error " + err)})
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
    
    //var lgaName = plateDetails[1];
   
       //Check if any record in the data base first for the platenumber
        PlateNumberModel.findOne().sort({number: -1})
        .then((data) => {
           
            //console.log("Last record " + data);
            //Amount of plates requested by user
            var noOfPlates = req.body.plates.amount;

           
            var lastLetter = "AA"
            //create new plate number if no records
            if(data === null){           
               //Loop through and create plates
                for(var i = 1; i <= noOfPlates; i++){
                    
                    var newPlatenumber = new PlateNumberModel({
                        number: (plateDetails[1]+"00"+i+lastLetter).toUpperCase(),
                        lga: plateDetails[0]
                     });
                     newPlatenumber.save();
                }

                res.redirect('/lga');
            }

            var lastPlateNumber = data.number;
            //Else split last record get the last number
            var lastNumber = lastPlateNumber.slice(3, -2);
            
            //Check if limit is reached
            var parsedLastNumber = parseInt(lastNumber, 10);
            

             //Get unicode value for first and last ending alphabets
             var firstLetterCode = lastPlateNumber.charCodeAt(data.number.length -2);
             var lastLetterCode = lastPlateNumber.charCodeAt(data.number.length -1);

             //Set default ending letter
             var letter = (lastPlateNumber.slice(-2, -1)+String.fromCharCode(lastLetterCode)).toUpperCase();

            //Checks the last record only
            if(parsedLastNumber === 999){              

               //check if unicode is Z
                if(lastLetterCode === 90){           
                    //Reset both if it is
                    var tempLetter = String.fromCharCode(firstLetterCode +1);
                    letter = (tempLetter+"A").toUpperCase();   
               }
               else if(lastLetterCode !== 90){
                   //Else change the last letter
                  let tempLetter = (lastPlateNumber.slice(-2, -1)+String.fromCharCode(lastLetterCode+1)).toUpperCase();
                  letter = tempLetter;
               }
            }
                 
           
            //create plates

            //Loop through and create plates
            if(parsedLastNumber <= 999){
                for(var i = 1; i <= noOfPlates; i++){
                    var amount = "";
                    if(parsedLastNumber === 999){
                        parsedLastNumber = 0;
                        amount = (parsedLastNumber+i).toString();    
                    }
                                        
                    amount = (parsedLastNumber+i).toString(); 
                                             
                     var newPlatesNumber = [];
                     if(amount.length === 1){
                         newPlatesNumber.push("00"+amount);
                     }
                     if(amount.length === 2){
                         newPlatesNumber.push("0"+amount);
                     }
                     if(amount.length === 3){
                         newPlatesNumber.push(amount);
                     }

                     //Create new record                     
                     newPlatesNumber.forEach((num) => {      
                    
                          var newPlatenumber = new PlateNumberModel({
                               number: plateDetails[1]+num+letter,
                               lga: plateDetails[0]
                            });
                            
                       
                         newPlatenumber.save().then((newEntry) => {
                             console.log("New entries " + newEntry)
                         }).catch((err) => {
                             console.log("Error log" + err)
                         })
                     })
                   
                
               }
            }
            
            

        })
        .catch((err) => {
            console.log(err)
        })


})
.catch((err) => { 
    console.log(err)
});
//Check if any entry in the platenumber table, if no create new entry based on the user input
res.redirect('/lga');
})


module.exports = plateNumberRouter;

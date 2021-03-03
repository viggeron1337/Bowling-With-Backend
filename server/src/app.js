const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

//Build express server
const app = express(); 
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.get('/status', (req, res) => {
    res.send({
        message: 'Status OK!'
    })
})

app.put('/calculateTotal', function(req,res){

    const calcTotal = req.body

    const history = calcTotal.player.entries
    const historySize = calcTotal.player.entries.length
    const currEntry = calcTotal.player.latestEntry
    const pinsHit = calcTotal.pins

    const maxPins = 10
    
    var prevEntry = {}
    if(calcTotal.totalTries >= 1){
        prevEntry =  history[historySize - 2]
    }
    
    var prevPrevEntry = {}
    if(calcTotal.totalTries >= 2){
      prevPrevEntry = history[historySize - 3]
    }

    var addToTotal = 0;

    /*If current entry is a strike or spare,
    do not add any points yet*/
    if(!currEntry.strike && !currEntry.spare){
        addToTotal = pinsHit
    }

    /*2 tries since a strike - add points*/
    if(prevPrevEntry.strike){
        addToTotal += maxPins + prevEntry.pinsHit + currEntry.pinsHit
        console.log('Strike points added!')
    }
    
    /*Previous try was a spare - add points*/
    if(prevEntry.spare){
        addToTotal += (maxPins - prevPrevEntry.pinsHit) + currEntry.pinsHit
        console.log('Spare points added!')
    }

    console.log('~~~~~~Current Turn~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(currEntry)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    res.send({scoreContainer: addToTotal})
})

app.listen(process.env.PORT || 8081)
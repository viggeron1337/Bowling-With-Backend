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

    const calcObj = req.body

    const history = calcObj.player.entries
    const historySize = calcObj.player.entries.length
    const currEntry = calcObj.player.latestEntry
    const score = calcObj.score
    
    var prevEntry = {}
    if(calcObj.totalTries >= 1){
        prevEntry =  history[historySize - 2]
    }
    
    var prevPrevEntry = {}
    if(calcObj.totalTries >= 2){
      prevPrevEntry = history[historySize - 3]
    }

    var addToTotal = 0;

    /*If current entry is a strike or spare,
    do not add any points yet*/
    if(!currEntry.strike && !currEntry.spare){
        addToTotal = score
    }

    /*2 tries since a strike - add points*/
    if(prevPrevEntry.strike){
        addToTotal += 10 + prevEntry.value + calcObj.score
        console.log('Strike points added!')
    }
    
    /*Previous try was a spare - add points*/
    if(prevEntry.spare){
        addToTotal += (10 - prevPrevEntry.value) + calcObj.score
        console.log('Spare points added!')
    }

    console.log('~~~~~~Current Turn~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(currEntry)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    res.send({scoreContainer: addToTotal})
})

app.listen(process.env.PORT || 8081)
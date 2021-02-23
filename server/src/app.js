const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

//Build express server
const app = express(); 
app.use(morgan('combined'))
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.get('/status', (req, res) => {
    res.send({
        message: 'hello world!'
    })
})

app.put('/addScore', function(req,res){

    const entry = req.body.completeTurn
    const history = req.body.history
    const roundId = req.body.roundId

    console.log('~~~~~~Current Turn~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(entry[0])
    console.log(entry[1])
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    if(roundId > 0 || entry[0].strike){
        console.log('~~~~~~History~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        var arrLength = history.length;
       for(var i = 0; i < arrLength; i++){
           console.log(history[i])
       }
       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~') 
    }

    res.send("Done.")
})

app.listen(process.env.PORT || 8081)
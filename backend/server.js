const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = express.Router();

const app = express()
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const PORT = 3500

app.use(bodyParser.json())
//app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

const URI = 'mongodb+srv://root:root@khoj.jyyckk5.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(URI)

var db = mongoose.connection

db.on('error',()=>console.log("Error connecting to db"))
db.once('open',()=>console.log("Connected to db"))


app.post('/register', (req,res)=>{
    var username = req.body.username
    var password = req.body.password
    var data ={
        "username":username,
        "password":password
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Entered successfully")
    });
    return res.redirect('login.html')
})

app.get('/',(req,res)=>{
    res.render('index');

}).listen(PORT);

console.log("Listening on port "+PORT)
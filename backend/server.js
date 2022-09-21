const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = express.Router();
var path = require('path')
let alert = require('alert'); 


const app = express()
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const PORT = 3500



app.use(bodyParser.json())
//app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))

const URI = 'mongodb+srv://root:root@khoj.jyyckk5.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(URI)

var db = mongoose.connection

db.on('error',()=>console.log("Error connecting to db"))
db.once('open',()=>console.log("Connected to db"))


app.post('/register', (req,res)=>{
    var username = req.body.username
    var password = req.body.password
    //console.log(username + " "+password)
    var data ={
        "username":username,
        "password":password
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Signup successful. Please login")
    });
    return res.redirect('login.html')
})

app.get('/',(req,res)=>{res.render('index');})



app.get('/index.html',(req,res)=>{res.render('index')})
app.get('/merch.html',(req,res)=>{res.render('merch')})
app.get('/donation.html',(req,res)=>{res.render('donation')})
app.get('/community.html',(req,res)=>{res.render('community')})
app.get('/adopt.html',(req,res)=>{res.render('adopt')})
app.get('/aboutus.html',(req,res)=>{res.render('aboutus')})
app.get('/volunteer.html',(req,res)=>{res.render('volunteer')})
app.get('/login.html',(req,res)=>{res.render('login')})


app.listen(PORT)
console.log("Listening on port "+PORT)
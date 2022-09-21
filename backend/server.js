const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var path = require('path')
const bcrypt = require('bcryptjs');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require('./model/user')
const DonationM = require('./model/donationM');


const app = express()
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



const PORT = 9999
const URI = 'mongodb+srv://root:root@khoj.jyyckk5.mongodb.net/?retryWrites=true&w=majority'


const store = new MongoDBStore({
    uri: URI,
    collection: "mySessions",
  });


app.use(bodyParser.json())
//app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );

mongoose.connect(URI)

var db = mongoose.connection
db.on('error',()=>console.log("Error connecting to db"))
db.once('open',()=>console.log("Connected to db"))


app.post('/register', async (req,res)=>{
    var username = req.body.username
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)){

        var password =  req.body.password
        var hashPwd = await bcrypt.hash(password,10)
        //console.log(username + " "+password)
        
        user = User.create({
            email: username,
            password: hashPwd
        })
        //await user.save()
        
        console.log("done")
        return res.redirect('login.html')
    }
    else{

        return res.json({status:"error", message: "Invalid Email"})
    }
})

app.post('/login', async (req,res)=>{
    var username = req.body.username
    console.log(username)
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)){
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({ status: 'error', error: 'Invalid username/password' })
        }
        var password =  req.body.password
        //var hashPwd = await bcrypt.hash(password,10)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("in?")
        if (isMatch) {
            console.log("in")
            req.session.isAuth = true;
            
            return res.redirect('index.html')

        }
        

        //console.log(username + " "+password)
        
        
    }
    else{

        return res.json({status:"error", message: "Invalid credentials"})
    } 
})

app.post('/logout', (req,res)=>{
    req.session.destroy((err) => {
        if (err) throw err;
        return res.redirect("login.html");
      });
})

app.post('/isauth',(req,res)=>{
    //res.json("value":req.session.isAuth)
    res.json({"log":req.session.isAuth})
})

app.post('/donation',async (req,res)=>{
    var name = req.body.name
    var email = req.body.email
    var method = req.body.method
    var amount = req.body.amount
    //db.createCollection("donationMoney")
    
    donation = DonationM.create({
        name : name,
        email : email,
        paymentmethod: method,
        amount: amount
    })
    console.log("done")
    
        
    res.json({"status":"ok"})
})

app.get('/',(req,res)=>{res.render('index');})



app.get('/index.html',(req,res)=>{res.render('index')})
app.get('/merch.html',(req,res)=>{res.render('merch')})
app.get('/donation.html',(req,res)=>{res.render('donation')})
app.get('/community.html',(req,res)=>{req.session.isAuth?res.render('community'):res.render('login')})
app.get('/adopt.html',(req,res)=>{res.render('adopt')})
app.get('/aboutus.html',(req,res)=>{res.render('aboutus')})
app.get('/volunteer.html',(req,res)=>{res.render('volunteer')})
app.get('/login.html',(req,res)=>{res.render('login')})
app.get('/rescuepage.html',(req,res)=>{req.session.isAuth?res.render('rescuepage'):res.render('login')})
app.get('/reportabusepage.html',(req,res)=>{req.session.isAuth?res.render('reportabusepage'):res.render('login')})


app.listen(PORT)
console.log("Listening on port "+PORT)
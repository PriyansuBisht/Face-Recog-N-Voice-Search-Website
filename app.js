const express                 = require('express');
const hbs                     = require('express-handlebars');
const fileUpload              = require('express-fileupload');
const mongoose                = require('mongoose');
const MongoClient             = require('mongodb').MongoClient;
const path                    = require('path');
const process                 = require('process');
const fs                      = require('fs');
const app                     = express();







const port                    = process.env.PORT || 3000;
const staticPath              = path.join(__dirname, '/public');
const viewPath                = path.join(__dirname, '/src/views');
const layoutPath              = path.join(__dirname, '/src/views/layouts');
const partialsPath            = path.join(__dirname, '/src/views/partials');
const url                       = "mongodb://localhost:27017/";







require('./src/scripts/mongoDBConnection');
const User = require('./src/models/userDataModel');
const Book = require('./src/models/bookDataModel');
//const async = require('hbs/lib/async');
//const { get } = require('express/lib/response');






app.set('views', viewPath);
app.use(express.static( staticPath ));





app.engine('hbs', hbs.engine({
    extname: '.hbs',
    layoutDir: layoutPath,
    partialsDir: partialsPath,
    defaultLayout: 'mainLayout'
}));
app.set('view engine', 'hbs');




app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));





app.use(fileUpload({
    createParentPath: true
}));





app.get('/', (req, res) => {
    res.render('home', {
        title: "Home",
        customStyles: `<link rel="stylesheet" href="/styles/home.css">
        <link rel="stylesheet" href="/styles/headerStyles.css">`,
        customScripts: `<script type="text/javascript" src="/script/speechRecognitation.js"></script>
        <script type="text/javascript" src="/script/loadingOfBody.js"></script>`,
        loginSucess: false
    });
})


app.get('/junction', (req, res) => {
    res.render('junction', {
        title: 'junction',
        customStyles: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css">
        <link rel="stylesheet" href="/styles/junction.css">`
    });
})


app.post('/signup', async (req, res) => {
    try {
        if( req.body.password === req.body.confirmpass) {
            let num = 0;
            const files = req.files.images;
            let promises = [];
            files.forEach( (file) => {
                if( file.mimetype !== 'image/jpeg' ) {
                    throw new Error('Only JPEG images are supported');
                } else {
                    num++;
                    let savePath = path.join( __dirname + '/public', 'uploads', req.body.username, num + path.extname(file.name));
                    
                    promises.push( file.mv(savePath));
                }
            }) 
            await Promise.all(promises);
            
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                phoneno: req.body.phoneno,
                password: req.body.password,
                totalUploadedImages: num,
                lastUploadedImage: num,
            });
            console.log(newUser);
            await newUser.save();

            res.redirect('/junction');
        } else {
            alert("Password Dont Match");
        }
    } catch( err ) {
        res.status(400).send(err);
    }
})


app.post('/authinticate', async (req, res) => {
    try {
        const getUser = await User.findOne({
            email: req.body.loginEmail
        })
        if( getUser.username === req.body.loginUsername && getUser.password === req.body.loginPassword) {
            res.status(201).render('faceAuth', {
                title: 'Authinticate Yourself',
                customStyles: `<link rel="stylesheet" href="/styles/mainStyles.css">
                <link rel="stylesheet" href="/styles/faceAuth.css">`,
                username: getUser.username,
                totalUploadedImages: getUser.totalUploadedImages
            });
        } else {
            alert("incorrect Credentials");
            res.redirect('/junction');
        }
    } catch( err ) {
        res.status(400).send(err);
    }
})


app.get('/isAuthenticated', (req, res) => {
    res.render(`home`, {
        title: 'Home',
        customStyles: `<link rel="stylesheet" href="/styles/home.css"><link rel="stylesheet" href="/styles/navbarStyles.css">`,
        loginSucess: true
    });
})

app.get('/books', (req, res) => {
    
    MongoClient.connect(url, function(err, databaseConn) {
        if ( err ) {
            throw err;
        }
        const query = {};
        const columns = { projection: { 
            _id: 0, name: 1, image: 1, author: 1, series: 1, note: 1
        }};

        var dataBase = databaseConn.db("faceVoiceNodeProject");
        dataBase.collection("books").find(query, columns).toArray(function(err, allBooks) {
            if ( err ) {
                throw err;
            }
            res.render('books' , {
                title: "Books",
                customStyles: `<link rel="stylesheet" href="/styles/booksStyles.css">
                <link rel="stylesheet" href="/styles/headerStyles.css">`,
                customScripts: `<script type="text/javascript" src="/script/loadingOfBody.js"></script>
                <script type="text/javascript" src="/script/getBookForm.js"></script>`,
                Books: allBooks
            });
            databaseConn.close();
        });
    });
})


app.get("/getBook", (req, res) => {
    
    MongoClient.connect( url, function ( err, databaseConn) {
        if( err ) {
            new handleError( err );
        }
        const query = { "name" : req.query.book };
        const database = databaseConn.db('faceVoiceNodeProject');
        database.collection('books').findOne(query, function ( err, Book ) {
            if( err ) {
                new handleError( err );
            }
            res.render('showBook', {
                title: Book.name,
                customStyles: `<link rel="stylesheet" href="/styles/headerStyles.css" />
                <link rel="stylesheet" href="/styles/showBookStyles.css" />`,
                customScripts: `<script type="text/javascript" src="/script/loadingOfBody.js"></script>`,
                Book: Book
            })
            databaseConn.close();
        })
    })
})



app.get('/search', (req, res) => {
    MongoClient.connect(url, function(err, databaseConn) {
        if ( err ) {
            throw err;
        }
        const query = { $or: [ 
            { "name": req.query.searchBook.toLowerCase() }, 
            { "series": req.query.searchBook.toLowerCase() }, 
            { "author": req.query.searchBook.toLowerCase() } 
        ] };
        const columns = { projection: { 
            _id: 0, name: 1, image: 1, author: 1, series: 1, note: 1
        }};

        var dataBase = databaseConn.db("faceVoiceNodeProject");
        dataBase.collection("books").find(query, columns).toArray(function(err, Books) {
            if ( err ) {
                throw err;
            }
            res.render('books' , {
                title: "Books",
                customStyles: `<link rel="stylesheet" href="/styles/booksStyles.css">
                <link rel="stylesheet" href="/styles/headerStyles.css">`,
                customScripts: `<script type="text/javascript" src="/script/loadingOfBody.js"></script>
                <script type="text/javascript" src="/script/getBookForm.js"></script>`,
                Books: Books
            });
            databaseConn.close();
        });
    });
})



// srver port
app.listen( port, () => {
    console.log(`Server Running at PORT : ${port}`);
})
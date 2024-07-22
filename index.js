const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser')

const URL = require('./model/url')
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require('./connect');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const { restrictToLoggedinUesrOnly, checkAuth } = require('./middlewares/auth');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectToMongoDB("mongodb+srv://kaurprabhleen2002:EGiNeRa7yLhNuZc1@cluster0.ih4d0ql.mongodb.net/url-shortener")
.then(()=> console.log("Server connected to MongoDB"));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use('/url', restrictToLoggedinUesrOnly, urlRoute);
app.use('/', checkAuth ,staticRoute);
app.use('/user', userRoute);


app.get('/url/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push : {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    })

    res.redirect(entry.redirectURL);
});

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
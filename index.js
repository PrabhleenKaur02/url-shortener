const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser')

const URL = require('./model/url')
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require('./connect');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const { checkforAuthentication, restrictTo } = require('./middlewares/auth');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkforAuthentication);

app.use('/url', restrictTo(["NORMAL"]), urlRoute);
app.use('/', staticRoute);
app.use('/user', userRoute);

connectToMongoDB("mongodb+srv://email<password>@cluster0.ih4d0ql.mongodb.net/url-shortener")
.then(()=> console.log("Server connected to MongoDB"));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));


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

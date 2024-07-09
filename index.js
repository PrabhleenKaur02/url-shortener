const express = require("express");

const URL = require('./model/url')
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require('./connect');

const app = express();
const PORT = 8000;

app.use(express.json());

connectToMongoDB("mongodb+srv://kaurprabhleen2002:EGiNeRa7yLhNuZc1@cluster0.ih4d0ql.mongodb.net/url-shortener")
.then(()=> console.log("Server connected to MongoDB"));

app.use('/url', urlRoute);

app.get('/:shortId', async(req, res) => {
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
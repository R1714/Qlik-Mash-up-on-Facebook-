const express = require('express'),
    fs = require("fs"),
    login = require("facebook-chat-api"),
    app = express(),
    port = 3000,
    bodyParser = require('body-parser'),
    imageDataURI = require('image-data-uri');

app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
}));

process.setMaxListeners(0);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        return res.status(200).json({});
    }
    next();
})


const saveAs = (req, res, next) => {
    let message = req.body;
    let filePath = './fileName';
    imageDataURI.outputFile(message.url, filePath)
        .then(res => {
            console.log(res);
            next();
        })
}

app.post('/login', (req, res) => {
    let credentials = req.body;

    login({
        appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
    }, (err, api) => {
        if (err) {
            login({
                email: credentials.email,
                password: credentials.password
            }, (err, api) => {
                if (err) res.send({
                    message: 'Login Error',
                    data: err
                });
                fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
                api.getFriendsList((err, data) => {
                    if (err) res.send({
                        message: 'Fetch friends list error',
                        data: err
                    });
                    res.send({
                        message: 'Success',
                        data: data
                    });
                });
            });
        } else {
            api.getFriendsList((err, data) => {
                if (err) res.send({
                    message: 'Fetch friends list error',
                    data: err
                });
                res.send({
                    message: 'Success',
                    data: data
                });
            });
        }
    });
})

app.post('/sendMessage', saveAs, (req, res, next) => {
    let message = req.body;
    login({
        appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
    }, (err, api) => {
        if (err) return res.send({
            message: 'Login Error',
            data: err
        });
        var msg = {
            body: message.text,
            attachment: fs.createReadStream(__dirname + '/fileName.png')
        }
        api.sendMessage(msg, message.id, (err, data) => {
            if (err) return res.send({
                message: 'Sending message error',
                data: err
            });
            res.send({
                message: 'Success',
                data: data
            });
        })
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
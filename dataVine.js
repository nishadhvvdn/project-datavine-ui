var express = require('express');
var path = require('path');
var app = express();
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

var argport = null;
try {
	argport = process.argv.slice(2);
	argport = argport[0];
} catch(err) {
	console.log(err);
}

var port = process.env.PORT || 8082;
port = argport ? argport : port;

app.get('/', function (req, res) {
    console.log('login hit');
    res.sendFile(__dirname + '/views/index.html');
});

//--------------------------------
// file upload
var bodyParser = require('body-parser');
/*var multer = require('multer');*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/getBillingReport', function (req, res) {
    console.log('getBillingReport hit');
    billingCollection.find({}, function (err, data) {
        console.log('err', err);
        res.send(data);
    });
});
app.get('/getEnv',function(req,res){
    var obj={
        webservicehost:process.env.webservicehost,
        webserviceport:process.env.webserviceport,
        protocol:process.env.protocol,
        envName:process.env.envName,
        mqttHost:process.env.mqttHost,
        mqttUsername:process.env.mqttUsername,
        mqttPassword:process.env.mqttPassword
    };
    res.json(obj);
});

//For uploading csv file
app.post('/csvUpload', function (req, res) {
    console.log('/csvUpload hit');
    upload(req, res, function (err) {
        if (err) {
            console.log('err', err);
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    });
});
//uploading csv file ends here

//--------------------
var server = app.listen(port, function () {
    console.log('DataVine Server Started at port %s', port);
});

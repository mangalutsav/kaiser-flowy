var config = require('./config/config.json');
var baseUrl = config.base_url;
var pingUrl = config.accounts_url;

delete config.accounts_url;
delete config.base_url;

var express = require('express')

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(expressLayouts);
app.set('layout');
app.set('view engine', 'ejs');

request = require('request-json');

var http = require('http').Server(app);

app.set('port',(process.env.PORT||4000));

http.listen (app.get('port'),function(){
    console.log('listening to port number'  + app.get('port'));
});

var mysql = require('mysql');
var connection = mysql.createConnection(config);
connection.connect();
var io = require('socket.io')(http);

app.get( '/', function(req, res) {
    var client = request.createClient(pingUrl); //creating a client variable storing the credentials of the user based on the cookie of this request

    if (req.headers.cookie) {
        client.headers['Cookie'] = req.headers.cookie ;
    }

    client.get('/info', function(err, result, body) {
        //control reaches here when result is fetched from accounts.sdslabs.co.in
        if(body.loggedin) {  //if the user is logged in
            connection.query('SELECT * FROM usersInFlowy WHERE username = "'+body.username+'"', function(err, rows, fields) {
                if(err) {
                    //a connection error to the database
                    res.send('Server Is Busy');
                    return;
                }
                if(rows[0] == null) {
                    connection.query('INSERT INTO `flowy`.`usersInFlowy` (`name`, `username`) VALUES (\''+body.name+'\', \''+body.username+'\');', function(err, result) {
                        if(err) {
                            res.send('Server Is Busy');
                            return;
                        }
                        else {
                            res.render('index', {name: body.name.toUpperCase() ,list: null,username : body.username} );
                        }
                    });
                }
                else {
                    connection.query('SELECT * FROM lists WHERE username = "'+body.username+'"', function(err, lists, fields) {
	                    if(err) {
	                    	//a connection error to the database
	                    	res.send('Server Is Busy');
	                    	return;
	                	}
	                	else {
	                		res.render('index', {name: body.name.toUpperCase() ,lists: lists,username : body.username})
	                	}
                    })
                    res.render('index', {name: rows[0].name.toUpperCase() ,rating: rows[0].rating, username : rows[0].username});
                }
            });
        }
        else
        {
            //if the user is not logged in.
            res.render('login');
        }
    });
});

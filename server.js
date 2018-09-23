//Express is a server application. We'll run our server through express
//require('express') is what includes express in our project.
//var Express is the name by which we've chose to refer to the code imported by
//express. It will be used to declare an instance of the express application.
var Express = require('express');

//Calling Express() creates an instance of the main express application
//We've named it "app" for ease of use
var app = Express();

//Here we need to create the server itself
//First we must include Hypertext Transfer Protocol, basically so we can run
//HTML pages on the server.
//We're immediately creating a server on the http code we just imported, and
//our parameter "app" establishes that our server will use the application
//we created earlier.
//Remember that the return value of this statement comes from the LAST function
//so we are returning the result of ".Server(app)", which is of course a server
//We name it "server" for fairly obvious reasons.
var server = require('http').Server(app);

//Socket.io is a system of communication between server and client using web
//sockets. We must require it for message passing.
//We call "listen(server)" to establish an input/output stream on our server we
//created. We call this input/output stream "io".
var io = require('socket.io').listen(server);

//For our game (where players will collect coins) we just need a few basic
//variables. A list of players' individual money counts, and a server total.
var totalCoins = 0;
var players = {};

//This is where express does its heavy lifting through our application. Its a
//little complicated, but here's the basic rundown.
//Don't worry about understanding all of this stuff, you're not likely to
//change it until you've gained a lot of experience. Change the files/folders
//if you want.
//This sets "public" as the root folder for files being accessed. This is
//important because with the exception of the server itself, everything is
//contained within public. Therefore, everything a connecting client will need
//should be accessed through public.
app.use(Express.static(__dirname + '/public'));
//This sets public/index.html as the root page. In other words, when a client
//connects to the web server, it will load THIS html page. Hence, this should
//be the page that starts our client-side game.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//Here is where we handle the connection of a new io client. This is
//specifically when a client intially connects its input/output socket.
//We use "io.on" to respond to specific events using functions.
//"connect" is an event that is already defined in socket.io
io.on('connection', function (user) {

    //Let's output a message to the server console informing the administrator
    //that a user has connected.
    console.log("A new user has connected...");

    //Give the user a slot in the players list, and set it to 0 because the
    //user has not yet collected coins.
    players[user.id] = null;

    //Now, here's the important thing. Every time a user connects, we need to
    //inform the server what kind of messages it should be listening for from
    //this particular user. That means we need to define a function for every
    //message we expect to receive from the user, every time a user connects.
    //So while it may seem redundant, we will define the functions in here,
    //thus re-creating them for every client.

    //When the client clicks on the coin, it will send a message that says
    //"I clicked a coin". Usually we want our messages to be short, one word
    //alerts. However, for the sake of demonstration I will use larger strings
    //We say "user.on" here because we're waiting for this particular user to
    //send this message.
    user.on("I clicked a coin", function(){
        totalCoins++;
        players[user.id]++;
    })

    //The user is going to want pretty frequent updates on how many coins are
    //currently collected, so that they can accurately display it on their
    //screen. Here we will handle a request for information from the server.
    user.on("How many coins", function(){
        //We're going to send a message to the user telling them to update
        //the number of coins they have, and we're also passing them the total
        //number of coins collected.
        //"emit" is the function we use to send a message to the user. We do
        //'user.emit()' when we are sending a message to a specific user. If
        //we needed to send a message to all the users, we would call emit from
        //our server's io object. "io.emit()"
        user.emit('Update coins', totalCoins);
    })

    //What do we do when the player disconnects? Well, we should delete their
    //spot in the players list, and remove their coins from the total.
    user.on("disconnect", function(){
        totalCoins -= players[user.id];
        players[user.id] = null;
    })

});

//Start the server itself. Tell it to listen on a specific port and execute a
//function as it starts.
//Params: port, function
server.listen(8081, function () {
    //This will just output what port we're listening on.
    console.log(`Listening on ${server.address().port}`);
});
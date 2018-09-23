//Game configuration
var conf = {
    width: 800,
    height: 600,
    renderer: Phaser.AUTO,
    forceSetTimeOut: true
};
game = new Phaser.Game(conf);

var Play = function () { };
Play.prototype = {

    preload: function () {
        this.load.spritesheet('coin', './assets/coin.png', 200, 300);
    },

    create: function () {

        //Our local io we will call "theServer", referring to who we are
        //communicating with
        this.theServer = io();

        //Keep track of the local coin count
        this.myscore = 0;
        this.totalscore = 0;

        //Create a spinning coin
        var coin = game.add.sprite(this.game.width / 2, this.game.height / 2, 'coin');
        coin.anchor.setTo(0.5);
        coin.animations.add('spin', [0, 1, 2, 3, 4, 5]);
        coin.animations.play('spin', 30, true);
        coin.inputEnabled = true;
        coin.events.onInputDown.add(function () {
            this.myscore++;
            //Inform the server we clicked a coin
            this.theServer.emit("I clicked a coin");
        }, this);

        //Create score texts
        this.myCoins = game.add.text(0, 0, "My Coins: 0", {fill: 'white'});
        this.allCoins = game.add.text(0, 50, "All Coins: 0", {fill: 'white'});

        //Define how we will respond to coin updates from the server
        this.theServer.on("Update coins", function (total) {
            this.totalscore = total;
            //We bind "this" so the function will recognize the object we
            //came from
        }.bind(this))

    },

    update: function () {

        //Get the current total coins
        this.theServer.emit("How many coins");

        //Update the text
        this.myCoins.text = "My Coins: " + String(this.myscore);
        this.allCoins.text = "All Coins: " + String(this.totalscore);

    }

}

game.state.add('Play', Play);
game.state.start('Play');
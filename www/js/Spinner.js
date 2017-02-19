/**
 * Created by Jackson on 2/19/2017.
 */
var gameHeight = 400;
var gameWidth  = 400;

var states = {
    game1: "game1",
};
var gameState = function(game){

};
gameState.prototype={

    preload: function(){
        game1.load.image('tile','img/hexagon.svg');
    },
    create: function(){
        sprite = game1.add.sprite(600, 500, 'tile');
        sprite.anchor.setTo(0.5, 0.5);
    },
    update: function(){
        sprite.angle += 1;
    }



}

var game1 = new Phaser.Game(gameWidth,gameHeight, Phaser.AUTO, 'gameDiv1');
game1.state.add(states.game1, gameState);
game1.state.start(states.game1);

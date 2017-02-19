var gameHeight = 640;
var gameWidth  = 480;

var states = {
    game: "game",
};

var gameState = function(game){

};

var hexagons = new Array();
var active = new Array();
var time = 0;
gameState.prototype = {

    preload: function () {
      game.load.image('tile','img/hexagon.svg');
      game.load.image('earth','img/hexagon_earth.svg');
    },

    create: function () {
        var hexWidth= 696;
        var hexHeight = 800;
        var numWide = 6;
        // Desired Tile Width
        var tileWidth = Math.trunc(gameWidth / (numWide*3/2));
        var tileHeight = tileWidth  / hexWidth * hexHeight;
        var numHigh = Math.trunc(gameHeight / tileHeight);        

        for(j = 0; j < numHigh; j++){
            for(i = 0; i < numWide; i++){
                tile = game.add.sprite(1.5*i*tileWidth,j*tileHeight,'tile');
                tile.height = tileHeight;
                tile.width = tileWidth;
                tile.inputEnabled = true;
                tile.events.onInputDown.add(clickHandler, this);
                var nextTile = {tile:tile, x:i, y:j};
                hexagons.push(nextTile);
            }
        }

        for(j = 0; j < numHigh-1; j++){
            for(i = 0; i < numWide-1; i++){
                tile = game.add.sprite((1.5*i+0.75)*tileWidth,(j+0.5)*tileHeight,'tile');
                tile.height = tileHeight;
                tile.width = tileWidth;
                tile.inputEnabled = true;
                tile.events.onInputDown.add(clickHandler, this);
                var nextTile = {tile:tile, x:i, y:j};
            }
        }
    },

    update: function () {
        if(time++%100 == 0){

        }
    },
};

function clickHandler(tile, pointer) {
    if (pointer.leftButton.isDown) {
      if(tile.key == 'tile'){
        tile.loadTexture('earth');
        active.push(tile);
      }
      else{
        tile.loadTexture('tile');
        for(i = 0; i < active.length;i++){
          if(active[i]==tile)
            active.splice(i,1);
        }
      }
    }
}

var game = new Phaser.Game(gameWidth,gameHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);

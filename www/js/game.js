var gameHeight = 640;
var gameWidth  = 480;

var states = {
    game: "game",
};

var gameState = function(game){

};

var active = new Array();
var time = 0;
var allStructs = new Array();

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
        var numHigh = Math.trunc(gameHeight / tileHeight)*2-1;        

        var allTiles = new Array();

        for(j = 0; j < numHigh; j++){
            for(i = 0; i < numWide; i++){
                var nextTile = {tile:null,x:null,y:null};
                if(j%2==0){
                    tile = game.add.sprite(1.5*i*tileWidth,(j/2)*tileHeight,'tile');
                    tile.height = tileHeight;
                    tile.width = tileWidth;
                    tile.inputEnabled = true;
                    tile.events.onInputDown.add(clickHandler, this);
                    nextTile = {tile:tile, x:i, y:j};
                }else{
                    if(i == numWide - 1)
                        continue;
                    tile = game.add.sprite((1.5*i+0.75)*tileWidth,(Math.round(j)/2)*tileHeight,'tile');
                    tile.height = tileHeight;
                    tile.width = tileWidth;
                    tile.inputEnabled = true;
                    tile.events.onInputDown.add(clickHandler, this);
                    nextTile = {tile:tile, x:i, y:j};
                }
                allTiles.push(nextTile);
            }
        }

        for(i = 0; i < allTiles.length; i++){
            var numRows = Math.ceil(i/numWide);
            var numOddRows= Math.floor(numRows/2);

           //set neighbor values
            var upLeft = allTiles[i-numWide];
            var up = allTiles[i-(2*numWide-1)];
            var upRight = allTiles[i-(numWide-1)];
            var dnLeft = allTiles[i+(numWide-1)];
            var dn = allTiles[i+(numWide*2-1)];
            var dnRight = allTiles[i+numWide];

            //correct bad neighbor values
            //if tile is on left side left neighbors don't exist
            if (tile:allTiles[i]%(2*numWide-1)==0){
                upLeft=null;
                dnLeft=null;
            }
            //if tile is on right side right neighbors don't exist
            else if(i==numWide*numRows-numOddRows-1){
                upRight=null;
                dnRight=null;
            }

            //a tile can be on both right or left side and also on the top or bottom

            //if on top
            if(i<num-1){
                upLeft=null;
                upRight=null;
            }
            //else if on bottom
            else if(i>allTiles.length-n){
                dnLeft=null;
                dnRight=null;
            }
            var tileStruct = {tile:allTiles[i],
                upLeft:upLeft,up:up,upRight:upRight,
                downLeft:dnLeft, down:dn, downRight:dnRight};
            allStructs.push(tileStruct);
        }
    },

    update: function () {
        if(time++%100 == 0){
            for(i = 0; i < active.length; i++){}
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

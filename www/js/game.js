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
var tileHeight;
var tileWidth;
var numWide = 6;

gameState.prototype = {

    preload: function () {
      game.load.image('tile','img/hexagon.svg');
      game.load.image('earth','img/hexagon_earth.svg');
    },

    create: function () {
        var hexWidth= 696;
        var hexHeight = 800;

        // Desired Tile Width
        tileWidth = Math.trunc(gameWidth / (numWide*3/2));
        tileHeight = tileWidth  / hexWidth * hexHeight;
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

            //get useful variables
            var numRows = Math.ceil(i/numWide);
            var numOddRows= Math.floor(numRows/2);

           //set neighbor values
            var upLeft = i-numWide;
            var up = i-(2*numWide-1);
            var upRight = i-(numWide-1);
            var dnLeft = i+(numWide-1);
            var dn = i+(numWide*2-1);
            var dnRight = i+numWide;

            //initialize the tileStruct
            var tileStruct = {tile:allTiles[i],
                            upLeft:null,up:null,upRight:null,
                            downLeft:null, down:null, downRight:null};


            var isLefttile=false;
            var isRighttile=false;
            var isToptile=false;
            var isBottile=false;

            //if tile is on left side left neighbors don't exist
            if (i%(2*numWide-1)==0){
                isLefttile=true;
                tileStruct[upLeft]=null;
                tileStruct[dnLeft]=null;
                tileStruct
            }
            //if tile is on right side right neighbors don't exist
            else if(i==numWide*numRows-numOddRows-1){
                isRighttile=true;
                tileStruct[upRight]=null;
                tileStruct[dnRight]=null;
            }

            //a tile can be on both right or left side and also on the top or bottom

            //if on top
            if(i<numWide-1){
                isToptile=true;
                tileStruct[upLeft]=null;
                tileStruct[upRight]=null;
            }
            //else if on bottom
            else if(i>allTiles.length-numWide){
                isBottile=true;
                tileStruct[dnLeft]=null;
                tileStruct[dnRight]=null;
            }
            if(isToptile)
                if(isRighttile)
                    tileStruct = {tile:allTiles[i], upLeft:null,up:null,upRight:null,
                                 downLeft:allTiles[dnLeft], down:allTiles[dn], downRight:null};
                else if(isLefttile)
                    tileStruct = {tile:allTiles[i], upLeft:null,up:null,upRight:null,
                                 downLeft:null, down:allTiles[dn], downRight:allTiles[dnRight]};
                else
                    tileStruct = {tile:allTiles[i], upLeft:null,up:null,upRight:null,
                                 downLeft:allTiles[dnLeft], down:allTiles[dn], downRight:allTiles[dnRight]};
            else if(isBottile)
                if(isRighttile)
                    tileStruct = {tile:allTiles[i], upLeft:allTiles[upLeft],up:allTiles[up],upRight:null,
                                 downLeft:null, down:null, downRight:null};
                else if(isLefttile)
                    tileStruct = {tile:allTiles[i], upLeft:null,up:allTiles[up],upRight:allTiles[upRight],
                                 downLeft:null, down:null, downRight:null};
                else
                    tileStruct = {tile:allTiles[i], upLeft:allTiles[upLeft],up:allTiles[up],upRight:allTiles[upRight],
                                 downLeft:null, down:null, downRight:null};
            else if(isLefttile)
                    tileStruct = {tile:allTiles[i], upLeft:null,up:allTiles[up],upRight:allTiles[upRight],
                                 downLeft:null, down:allTiles[dn], downRight:allTiles[dnRight]};
            else if(isRighttile)
                    tileStruct = {tile:allTiles[i], upLeft:allTiles[upLeft],up:allTiles[up],upRight:null,
                                 downLeft:allTiles[dnLeft], down:allTiles[dn], downRight:null};
            else
                tileStruct = {tile:allTiles[i], upLeft:allTiles[upLeft],up:allTiles[up],upRight:allTiles[upRight],
                             downLeft:allTiles[dnLeft], down:allTiles[dn], downRight:allTiles[dnRight]};

            allStructs.push(tileStruct);
        }
    },

    update: function () {
        if(time++%10 == 0){
            for(i = 0; i < active.length; i++){
                console.log(active[i])
            }
        }
    },
};

function clickHandler(tile, pointer) {
    if (pointer.leftButton.isDown) {
      if(tile.key == 'tile'){
        tile.loadTexture('earth');
        active.push(getTile(tile));
      }
      else{
        deactivateTile(tile);
      }
    }
}

function deactivateTile(tile){
    tile.loadTexture('tile');
    for(i = 0; i < active.length;i++){
      if(active[i].tile.x==tile.x && active[i].tile.y == tile.y)
        active.splice(i,1);
        return true;
    }
    return false;
}


function getTile(tile){
    var x = tile.x;
    var y = tile.y;
    var row = 0;
    var col = 0;
    if(y%tileHeight == 0)
        row = y/tileHeight*2;
    else
        row = (y-tileHeight/2)/tileHeight*2+1;
    row = Math.round(row);
    col = Math.floor(x/(tileWidth*0.75)/2);
    var index = numWide*row-Math.floor(row/2)+col;
    return allStructs[index];
}

var game = new Phaser.Game(gameWidth,gameHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);

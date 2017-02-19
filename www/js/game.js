var gameHeight = 800;
var gameWidth  = 800;

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
var numWide = 5;
var go = 0;
var timer = 0;
var text;

gameState.prototype = {

    preload: function () {
      game.load.image('tile','img/hexagon.svg');
      game.load.image('earth','img/hexagon_earth.svg');
      game.load.image('predator','img/yellow.svg');
        game.load.image('prey','img/blue.svg');
game.load.image('button', 'img/start.png')
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

        button = game.add.button(game.world.centerX - gameWidth/2+25, gameHeight-50, 'button', actionOnClick, this, 0, 0, 0);
        //button.style.background("#333333");
        var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100, align: "center", backgroundColor: "#ffff00" };
        text = game.add.text(100,gameHeight-50,timer ,style);

    },

    update: function () {
        if(time++%100 == 0){
            for(i = 0; i < active.length; i++){
                console.log(active[i])
            }
        }
text.setText(Math.round(timer/60*100)/100);
        // if(go==0) {
        //     for (j = 0; j < active.length; j++) {
        //
        //         if (active.get(i).LoadTexture() == "prey") {
        //             var numchildren = active.get(i).getNumChildren();
        //             if (OnResource()) {
        //                 //moves
        //             }
        //
        //             else if (numchildren == 0) {
        //                 //nothing
        //             }
        //             else if (numchildren == 1) {
        //                 //reproduce and doesnt move
        //             }
        //             else if (numchildren == 2 || numchildren == 3 || numchildren == 4) {
        //                 //moves randomly
        //             }
        //             else {
        //                 //dies from overpolulation
        //             }
        //         }
        //         else if (active.get(i).LoadTexture() == "predator") {
        //             var numchildren = active.get(i).getNumChildren();
        //             if (PreyIsNeighbor()) {
        //                 //moves and kills prey
        //             }
        //
        //             else if (numchildren == 0) {
        //                 //moves
        //             }
        //             else if (numchildren == 1) {
        //                 //reproduce and doesnt move
        //             }
        //             else if (numchildren == 2 || numchildren == 3) {
        //                 //moves randomly
        //             }
        //             else {
        //                 //dies from overpolulation
        //             }
        //         }
        //         else {
        //
        //         }
        //     }
        // }

        if(go==0) {
            timer++;
        }



    },
};

function clickHandler(tile, pointer) {
    if (pointer.leftButton.isDown) {
        if(tile.key == 'tile'){
        tile.loadTexture('earth');
        active.push(getTile(tile));
      }
      else if(tile.key == "earth"){
            tile.loadTexture('prey');
            active.push(getTile(tile));
        }
        else if(tile.key == "prey"){
            tile.loadTexture('predator');
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

function actionOnClick(){
    console.log("button works");
    console.log(timer/60);

    if(go ==0){


        go = 1;
    }
    else{

        go = 0;
    }
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

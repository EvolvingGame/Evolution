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
var numWide = 4;


gameState.prototype = {

    preload: function () {
      game.load.image('tile','img/hexagon.svg');
      game.load.image('earth','img/hexagon_earth.svg');
    },

    create: function () {
        var hexWidth= 696;
        var hexHeight = 1600;

        // Desired Tile Width
        tileWidth = Math.trunc(gameWidth / (numWide*3/2));
        tileHeight = tileWidth  / hexWidth * hexHeight;
        var numHigh = Math.trunc(gameHeight / tileHeight)*2-1;        

        var allTiles = new Array();

        for(var j = 0; j < numHigh; j++){
            for(var i = 0; i < numWide; i++){
                var nextTile;
                if(j%2==0){
                    tile = game.add.sprite(1.5*i*tileWidth,(j/2)*tileHeight,'tile');
                    tile.height = tileHeight;
                    tile.width = tileWidth;
                    tile.inputEnabled = true;
                    tile.events.onInputDown.add(clickHandler, this);
                    nextTile = {'tile':tile,
                            'upLeft':null,'up':null,'upRight':null,
                            'downLeft':null, 'down':null, 'downRight':null};
                }else{
                    if(i == numWide - 1)
                        continue;
                    tile = game.add.sprite((1.5*i+0.75)*tileWidth,(Math.round(j)/2)*tileHeight,'tile');
                    tile.height = tileHeight;
                    tile.width = tileWidth;
                    tile.inputEnabled = true;
                    tile.events.onInputDown.add(clickHandler, this);
                    nextTile = {'tile':tile,
                            'upLeft':null,'up':null,'upRight':null,
                            'downLeft':null, 'down':null, 'downRight':null};
                }
                allStructs.push(nextTile);
            }
        }

        for(var i = 0; i < allStructs.length; i++){

            var tile = allStructs[i]['tile'];

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

            var isLefttile=false;
            var isRighttile=false;
            var isToptile=false;
            var isBottile=false;
            var isTopOdd=false;
            var isBotOdd=false;


            //if tile is on left side left neighbors don't exist
            if (i%(2*numWide-1)==0){
                isLefttile=true;
            }
            //if tile is on right side right neighbors don't exist
            else if(i==numWide*numRows-numOddRows-1 && numRows%2==1){
                isRighttile=true;
            }

            //a tile can be on both right or left side and also on the top or bottom

            //if on top
            if(i<numWide){
                isToptile=true;
            }
            //else if on bottom
            else if(i>allStructs.length-numWide-1){
                isBottile=true;
            }

            if(i >= numWide && i <= 2*(numWide-1)){
                isTopOdd=true;
            }
            else if(i <= (allStructs.length-numWide-1) && i > (allStructs.length-2*(numWide))){
                isBotOdd=true;
            }

            if(isToptile)
                if(isRighttile)
                    allStructs[i] = {'tile':tile,'upLeft':null,'up':null,'upRight':null,
                                 'downLeft':dnLeft, 'down':dn, 'downRight':null};
                else if(isLefttile)
                    allStructs[i] = {'tile':tile,'upLeft':null,'up':null,'upRight':null,
                                 'downLeft':null, 'down':dn, 'downRight':dnRight};
                else
                    allStructs[i] = {'tile':tile,'upLeft':null,'up':null,'upRight':null,
                                 'downLeft':dnLeft, 'down':dn, 'downRight':dnRight};
            else if(isBottile)
                if(isRighttile)
                    allStructs[i] = {'tile':tile,'upLeft':upLeft,'up':up,'upRight':null,
                                 'downLeft':null, 'down':null, 'downRight':null};
                else if(isLefttile)
                    allStructs[i] = {'tile':tile,'upLeft':null,'up':up,'upRight':upRight,
                                 'downLeft':null, 'down':null, 'downRight':null};
                else
                    allStructs[i] = {'tile':tile,'upLeft':upLeft,'up':up,'upRight':upRight,
                                 'downLeft':null, 'down':null, 'downRight':null};
            else if(isLefttile)
                    allStructs[i] = {'tile':tile,'upLeft':null,'up':up,'upRight':upRight,
                                 'downLeft':null, 'down':dn, 'downRight':dnRight};
            else if(isRighttile)
                    allStructs[i] = {'tile':tile,'upLeft':upLeft,'up':up,'upRight':null,
                                 'downLeft':dnLeft, 'down':dn, 'downRight':null};
            else if(isTopOdd)
                allStructs[i] = {'tile':tile, 'upLeft':upLeft, 'up':null, upRight:upRight,
                              'downLeft':dnLeft, 'down':dn, 'downRight': dnRight};
            else if(isBotOdd)
                allStructs[i] = {'tile':tile, 'upLeft':upLeft, 'up':up, upRight:upRight,
                                              'downLeft':dnLeft, 'down':null, 'downRight': dnRight};

            else{
                allStructs[i] = {'tile':tile,'upLeft':upLeft,'up':up,'upRight':upRight,
                             'downLeft':dnLeft, 'down':dn, 'downRight':dnRight};
            }
        }
    },

    update: function () {
        if(time++%10 == 0){
            if(active.length > 0){
                var myInd = Math.floor(Math.random() * active.length);
                currStruct = active[myInd];
                var keys = Object.keys(currStruct);
                var key;
                var counter=0;
                do{
                    var cont = false;
                    key = keys[Math.floor((Math.random() * keys.length-1) + 1)];
                    nextStruct = allStructs[currStruct[key]];
                    counter ++;
                    if(counter > 5)
                        return;
                }while(nextStruct == null || 
                    (contains(nextStruct) && nextStruct['tile']['key'] == currStruct['tile']['key']));

                if(nextStruct['tile']['key'] == 'tile'){
                    active.push(nextStruct);
                }

                nextStruct['tile'].loadTexture(currStruct['tile']['key']);  
                currStruct['tile'].loadTexture('tile');
                active.splice(myInd,1);
                
            }
        }
    }
};

function contains(tileStruct){
    for(var i = 0; i < active.length; i++)
        if(tileStruct['tile']['x'] == active[i]['tile']['x']&&tileStruct['tile']['y'] == active[i]['tile']['y'])
            return true;
    return false;
}

function clickHandler(tile, pointer) {
    if (pointer.leftButton.isDown) {
        if(tile.key == 'tile'){
            tile.loadTexture('earth');
            active.push(getTileStruct(tile));
        }
        else{
            tile.loadTexture('tile');
            for(var i = 0; i < active.length;i++){
                if(active[i].tile.x==tile.x && active[i].tile.y == tile.y)
                    active.splice(i,1);
            }
        }
    }
}

function getTileStruct(tile){
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

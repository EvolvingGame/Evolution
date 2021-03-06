var gameHeight = document.documentElement.clientHeight-40;
var gameWidth  = document.documentElement.clientWidth-20;

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



var numWide = 8;

var go = 1;
var timer = 0;
var text;
var currentColor = "earth";
var numResources = 15;
var gameOver = false;
var preycounter = 0;


gameState.prototype = {

    preload: function () {
        game.load.image('tile','img/hexagon.svg');
        game.load.image('earth','img/hexagon_earth.svg');
        game.load.image('predator','img/yellow.svg');
        game.load.image('prey','img/blue.svg');
        game.load.image('button', 'img/start.png')
        game.load.image('buttoncolor', 'img/colorbutton.jpg')
        game.load.image('resource', 'img/hexagon_red.svg')
    },

    create: function () {
        var hexWidth= 696;
        var hexHeight = 800;

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


        for(k = 0;k<numResources;k++) {
            console.log("Made Resource");
            r = allStructs.length;
            z = Math.floor(Math.random() * r);
            allStructs[z]["tile"].loadTexture("resource");
            active.push(allStructs[z]);
            if (k = 0) {
                y = Math.floor(Math.random() * r);
                console.log("Made prey");
                allStructs[y]["tile"].loadTexture("prey");

                active.push(allStructs[y]);
            }

        }

        button = game.add.button(game.world.centerX - gameWidth/2+25, gameHeight-50, 'button', actionOnClick, this, 0, 0, 0);
        button1 = game.add.button(game.world.centerX - gameWidth/2+500, gameHeight-50, 'buttoncolor', actionOnClick2, this, 0, 0, 0);
        //button.style.background("#333333");
        var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100, align: "center", backgroundColor: "#ffff00" };
        text = game.add.text(100,gameHeight-50,timer ,style);
        text2 = game.add.text(300, gameHeight-50, currentColor, style);

    },

    update: function () {

       gameOver = true;
        for(b = 0;b<active.length;b++){
            if(active[b]["tile"]["key"] == "prey"){
                console.log("HERE");
                gameOver = false;
            }
        }


        if(time++%5 == 0 && go==0 && active.length > 0 &&!gameOver){


        if(time%200 == 0){
            var ind;
            var count = 0;
            do{
                ind = Math.floor(Math.random()*allStructs.length);
            }while(allStructs[ind]['tile']['key'] != 'tile' && count++ < 10);
            allStructs[ind]['tile'].loadTexture('resource')
        }


        if(time++%2 == 0 && go==0 && active.length > 0){

            var myInd;
            var currStruct;
            var key;
            var counter=-1;
            var nextStruct;
            do{
                counter ++; // Increment count to stop infinite loop
                key = null; // Reset Variable

                // Get Random Active Struct
                myInd = Math.floor(Math.random() * active.length);
                currStruct = active[myInd];


                if(currStruct["tile"]["key"]=="resource"){
                    continue;
                }

                var keys = Object.keys(currStruct);



                console.log(currStruct['time']);
                if(time-currStruct['time'] > 20000){
                    currStruct['tile'].loadTexture('tile');
                    currStruct['time']=0;
                    active.splice(myInd,1);
                }

                // Check if it has an available move
                var move = false;
                for(var i = 0; i < active.length; i++)
                    if(active[i]['tile']['key'] != currStruct['tile']['key'])
                        move = true;



                // If it is a predator check for prey
                if(move && currStruct['tile']['key'] == "predator"){
                    key = findNearest(currStruct,"prey");

                    for (var neighbor = 1; neighbor<keys.length; neighbor++){
                        key_check = keys[neighbor];
                        var neighborStruct = null;
                        if (currStruct[key_check]!= null)
                            neighborStruct = allStructs[currStruct[key_check]];
                        if (neighborStruct !=null && neighborStruct['tile']['key'] == 'prey'){
                            // kill(neighborStruct,currStruct);
                            // return;
                            key = key_check;
                        }
                    }
                }

                // If it is a pey check for resources
                if(move && currStruct['tile']['key'] == 'prey'){
                    key = findNearest(currStruct,'resource');
                }

                // Assign a key if the key is null
                if(move && key == null)
                    key = keys[Math.floor((Math.random() * keys.length-1) + 1)];

                // Tried to many times, don't get stuck!
                if(counter > 10)
                    return;
                if(!move)
                    continue;
                nextStruct = allStructs[currStruct[key]];

                //if a prey is planning on going to a predator next find a new plan
                if(currStruct!=null && currStruct['tile']['key']=='prey'&&
                    nextStruct!=null && nextStruct['tile']['key']=='predator')
                    continue;

                //if the currStruct is earth or resource, do not move
                if(currStruct != null && (currStruct['tile']['key']=='earth'
                    || currStruct['tile']['key']=='resource')){
                        return;
                    }
            }while(nextStruct == null || (contains(nextStruct) && 
                nextStruct['tile']['key'] == currStruct['tile']['key']));

            nextStruct['time']=time;
            currStruct['time'] = time;
            if(nextStruct['tile']['key'] == 'tile'){
                active.push(nextStruct);
                active.splice(myInd,1);
                nextStruct['tile'].loadTexture(currStruct['tile']['key']);
                currStruct['tile'].loadTexture('tile');
            }else if(nextStruct['tile']['key'] == 'resource'){
                currStruct['time'] = time;
                nextStruct['tile'].loadTexture(currStruct['tile']['key']);
                active.push(nextStruct);
            }else if(nextStruct['tile']['key'] == 'prey'){
                nextStruct['tile'].loadTexture(currStruct['tile']['key']);
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

        if(go==0&&!gameOver) {
            timer++;
        }}
    },
};

// function clickHandler(tile, pointer) {
//     if (pointer.leftButton.isDown) {
//         if(tile.key == 'tile'){
//         tile.loadTexture('earth');
//         active.push(getTile(tile));
//       }
//       else if(tile.key == "earth"){
//             tile.loadTexture('prey');
//             active.push(getTile(tile));
//         }
//         else if(tile.key == "prey"){
//             tile.loadTexture('predator');
//             active.push(getTile(tile));
//         }
//       else{
//         deactivateTile(tile);
//       }
//     }
//
//
// };


function contains(tileStruct){
    for(var i = 0; i < active.length; i++)
        if(tileStruct['tile']['x'] == active[i]['tile']['x']&&tileStruct['tile']['y'] == active[i]['tile']['y'])
            return true;
    return false;

}

function kill(preyStruct, predatorStruct){
    preyStruct.tile.loadTexture('predator');
    predatorStruct.tile.loadTexture('tile');

    for (var index; index < active.length; index++){
        if( predatorStruct['tile']['x'] == active[index]['tile']['x'] &&
        predatorStruct['tile']['y'] == active[index]['tile']['y']){
            active.splice(index,1);
            break;
        }
    }
}

function moveRandom(currStruct){


}

function clickHandler(tile, pointer) {
    if (pointer.leftButton.isDown) {
        if(tile['key']=='tile'){
            tile.loadTexture(currentColor);
            if(currentColor != 'earth'&& currentColor != 'resource'){
                var tileStruct = getTileStruct(tile);
                active.push(tileStruct);
                console.log('Active');
                console.log(tileStruct);
                console.log(active);
                console.log(go);
            }
        }else{
            for(var i = 0; i < active.length;i++)
                    if(active[i].tile.x==tile.x && active[i].tile.y == tile.y)
                        active.splice(i,1);
            tile.loadTexture('tile');
        }
    }
}


function actionOnClick(){
    if(go ==0){
        go = 1;
    }
    else{
        go = 0;
    }
}


function actionOnClick2(){
    if(currentColor=="earth"){
        currentColor="prey";
        text2.setText(currentColor);
    }else if(currentColor == "prey"){
        currentColor="predator";
        text2.setText(currentColor);    
    }
    else{
        currentColor = "earth";
        text2.setText(currentColor);
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

function compare(tileStruct1,tileStruct2){
    if(tileStruct1['file']['x'] == tileStruct2['file']['x'] &&
        tileStruct1['file']['y'] == tileStruct2['file']['y'])
        return true;
    else
        return false;
}

function findNearest(tileStructIn,type){
    var maxDepth = 12;
    var tileStructList = new Array();
    var oldStructList = new Array();
    tileStructList.push(tileStructIn);
    while(tileStructList.length > 0){
        if(maxDepth < 0)
            return null;
        var tileStruct = tileStructList.shift();
        if(tileStruct == null)
            continue;
        oldStructList.push(tileStruct);
        var vals = new Array();
        var keys = Object.keys(tileStruct);
        while(vals.length < keys.length){
            var gen = Math.floor(Math.random()*(keys.length-1))+1;
            var add = true;
            for(var i = 0; i < vals.length; i++)
                if(gen == vals[i])
                    add = false;
            if(add)
                vals.push(keys[gen]);
        }
        for(var i = 0; i < vals.length;i++)
            if(allStructs[tileStruct[vals[i]]] != null)
                if(allStructs[tileStruct[vals[i]]]['tile']['key'] == type){
                    return vals[i];
                }
                else{
                    tileStructList.push(allStructs[tileStruct[vals[i]]]);
                }
        maxDepth--;
    }
}

var game = new Phaser.Game(gameWidth,gameHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);

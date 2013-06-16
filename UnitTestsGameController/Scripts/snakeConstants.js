//enumeration for constants used in game
//to be deleted upon 'exit' ?? or browser deletes them automatically...
window.snakeConstants = {
    gameMenuElementSelector:"#menu-holder",
    gameVisualizingElementClass: 'snake-game',
    standartWidthOfElements: 10,
    objectTypes: {
        staticObject: 'staticObject',
        movableObject: 'movableObject'
    },
    collisionObjectsTypes: {
        wall: 'wall',
        food: 'food',
        tail: 'tail',
        rock: 'rock',
        snakeHead: 'snakeHead',        
    },
    colors: {
        snakeHeadColor: 'blue',
        snakeTailColor: 'green',
        wallColor: 'black',
        rockColor: 'brown',
        foodColor: 'red',
        textColor: 'rgba(255, 0, 0, 0.3)'
    },
    /*A = keycode 65, a = keycode 97*/
    /*  left = leyCode 37
        up = keyCode 38
        right = kkeyCode 39
        down = keyCode 40
    */
    snakeKeys: {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    },
    localStorageName: "snake-results-local",
    rocksCount: 20
}

var Coords = Class.create({
    initialize: function (posX, posY) {
        this.X = posX;
        this.Y = posY;
    },
    equals: function (coordObj) {
        var equals = false;
        if (this.X == coordObj.X && this.Y == coordObj.Y) {
            equals = true;
        }

        return equals;
    },
    add: function (coordsObjOther) {
        this.X += coordsObjOther.X;
        this.Y += coordsObjOther.Y;
    },
    substract: function (coordsObjOne, coordsObjOther) {
        var substractedX = coordsObjOne.X - coordsObjOther.X;
        var substactedY = coordsObjOne.Y - coordsObjOther.Y;

        return new Coords(substractedX, substactedY);
    },
    changeTo: function (coorObj) {
        this.X = coorObj.X;
        this.Y = coorObj.Y;
    }
});
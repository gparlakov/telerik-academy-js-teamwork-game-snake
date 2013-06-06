//**using jQuery $**///
//using prototype OOP ... or the other one//
var Coords = {
    init : function (posX, poxY) {
        this.X = posX;
        this.Y = posY;
    }        
}

var GameObjectsNS = (function () {   

    var GameObject = {
        init: function (positionX, positionY, width) {

        },
        getPosition: function () {
            return 
        }
    }

    var StaticObject = {
        init: function (positionX,  positionY, width, collisionGroup) {
            this._super.init.apply(this, arguments);
            this.collisionGroup = collisionGroup;
        }
    }
    StaticObject.inherit(GameObject);

    var MovableObject = {
        init
    }

    return {
        staticObject: StaticObject,
        movableObject: MovableObject,
        snakeObject: SnakeObject,
        gameObjectsFactory: GameObjectsFactory
    }
})();

var GameControllersNS = (function () {

    var GameController = {
        init: function (drawer, gameObjectsFactory) {

        },
        initEvents: function (){

        }

    }


    return {
        gameController: GameController,
        menuController: MenuController,
    }

})();

var DrawersNS = (function () {
    var CanvasDrawer = {
        init: function (cavasElement) {

        },
        draw : function() {

        }

    }

    return {
        canvasDrawer: CanvasDrawer,
        menuDrawer: MenuDrawer
    }
})();
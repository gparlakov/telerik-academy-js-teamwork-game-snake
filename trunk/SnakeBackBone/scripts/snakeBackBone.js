//**using jQuery $**///
//using prototype OOP ... or the other one//

Object.create = function (object) {
    var f = function () {};
    f.prototype = object;
    return new f();
}

Object.prototype.extends = function (parent) {
    var oldPrototype = this;
    var prototype = parent;
    this.prototype = Object.create(prototype);
    this.prototype._super = prototype;
    for (var prop in oldPrototype) {
        this.prototype[prop] = oldPrototype[prop];
    }    
}

var Coords = {
    init : function (posX, posY) {
        this.X = posX;
        this.Y = posY;
    }        
}

var GameObjectsNS = (function () {   

    var GameObject = {
        init: function (position, width) {
            this.position = position;
            this.width = width;
        },
        getPosition: function () {
            return this.position;
        }
    }

    var StaticObject = {
        init: function (position, width, collisionGroup) {
            this._super.init.apply(this, arguments);
            this.collisionGroup = collisionGroup;
        }
    }
    StaticObject.extends(GameObject);

    var MovableObject = {
        init: function (position, width, collisionGroup, direction) {
            this.prototype._super.init.apply(this, arguments);
            this.collisionGroup = collisionGroup;
            this.direction = direction
        },
        update: function () {
            this.position.X += this.direction.X;
            this.position.Y += this.direction.Y;
        }
    }
    MovableObject.extends(GameObject);

    return {
        StaticObject: StaticObject,
        MovableObject: MovableObject,
        //SnakeObject: SnakeObject,
        //GameObjectsFactory: GameObjectsFactory
    }
})();

var GameControllersNS = (function () {

    var GameController = {
        init: function (drawer, gameObjectsFactory) {
            this.allObjects = [];
            this.drawer = drawer;
            this.gameLoopInterval; //for pausing and starting game
            this.snakeHead;
            this.initEvents();
        },
        initEvents: function (){
            var cavasElement = this.drawer.canvasElement;
            var that = this;
            $(window).on('keyup', function (event) {
                var keyPressed = event.keyCode;
                //todo - fix event
                if (keyPressed === 87) {
                    snakeHead.direction.X = 0;
                    snakeHead.direction.Y = -1;
                }
            });
        },
        addObject: function (gameObject) {
            this.allObjects.push(gameObject);
        },
        gameLoop: function () {
            //this.detectCollisions();
            var that = this;
            setInterval(function () {
                that.updateElements();
                that.drawElements();
            }, 1000/60);
        },
        updateElements: function () {
            var i = 0;
            var len = this.allObjects.length;
            for (i = 0; i < len; i++) {
                this.allObjects[i].update();
            }
        },
        drawElements: function () {
            this.drawer.ctx.clearRect(0, 0, 1000, 1000);
            var i = 0;
            var len = this.allObjects.length;
            for (i = 0; i < len; i++) {
                this.drawer.draw(this.allObjects[i]);
            }
        }
    }

    return {
        GameController: GameController,
        //MenuController: MenuController,
    }

})();

var DrawersNS = (function () {
    var CanvasDrawer = {
        init: function (cavasElementSelector) {
            this.canvasElement = $(cavasElementSelector).get(0)
            this.ctx = this.canvasElement.getContext('2d');
        },
        draw : function(gameObject) {
            this.ctx.save();
            this.ctx.fillStyle = "red";
            if(gameObject.color)
            {
                this.ctx.fillStyle = gameObject.color;
            }
            
            this.ctx.fillRect(gameObject.position.X, gameObject.position.Y,
                gameObject.width, gameObject.width);
            this.ctx.restore();
        }
    }

    return {
        CanvasDrawer: CanvasDrawer,
        //MenuDrawer: MenuDrawer
    }
})();

window.onload = function () {
    var drawer = Object.create(DrawersNS.CanvasDrawer);
    drawer.init('#canvas');

    var controller = Object.create(GameControllersNS.GameController);
    controller.init(drawer);

    
    var snakeHeadPosition = Object.create(Coords);
    snakeHeadPosition.init(5,5);

    var snakeHeadDirection = Object.create(Coords);
    snakeHeadDirection.init(1, 1);

    var snakeHead = Object.create(GameObjectsNS.MovableObject);
    snakeHead.init(snakeHeadPosition, 5, "movable static", snakeHeadDirection);

    controller.addObject(snakeHead);
    controller.snakeHead = snakeHead;
    controller.gameLoop();
};
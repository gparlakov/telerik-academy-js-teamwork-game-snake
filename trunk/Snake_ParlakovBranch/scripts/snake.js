﻿//**using jQuery jQuery**///
//using prototype.js OOP //

//enumeration for constants used in game
//to be deleted upon 'exit' ?? or browser deletes them automatically...
window.snakeConstants = {
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
        snakeHead: 'snakeHead'
    },
    colors: {
        snakeHeadColor: 'blue',
        snakeTailColor: 'orange',
        wallColor: 'black',
        rockColor: 'brown',
        foodColor: 'red'
    },
    /*A = keycode 65, a = keycode 97*/
    /*  left = leyCode 37
        up = keyCode 38
        right = kkeyCode 39
        down = keyCode 40
    */
    snakeKeys : {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    }
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
    add: function (coorObjOne, coordsObjOther) {
        var addedX = coordsObjOne.X + coordsObjOther.X;
        var addedY = coordsObjOne.Y + coordsObjOther.Y;

        return new Coords(addedX, addedY);
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

//TODO put in separate file at end of development
var GameObjectsNS = (function () {

    var GameObject = Class.create({
        initialize: function (position, width) {
            this.position = position;
            this.width = width;
        },
        getPosition: function () {
            return this.position;
        },
        isCollision: function (coordObj) {
            if ((this.position.X - this.width <= coordObj.X + 1 && this.position.X >= coordObj.X - this.width - 1) &&
                (this.position.Y - this.width <= coordObj.Y + 1 && this.position.Y >= coordObj.Y - this.width - 1)) {
                return true;
            }
        },
        //kind of virtual method
        update: function () { }
    });

    var StaticObject = Class.create(GameObject, {
        initialize: function ($super, position, width) {
            $super(position, width);
            this.type = window.snakeConstants.objectTypes.staticObject;
        }
    });

    var MovableObject = Class.create(GameObject, {
        initialize: function ($super, position, width, direction) {
            $super(position, width);
            this.direction = direction;
            this.type = window.snakeConstants.objectTypes.movableObject;
        },
        update: function () {
            this.position.X += this.direction.X;
            this.position.Y += this.direction.Y;
        }
    });

    var Food = Class.create(StaticObject, {
        initialize: function ($super, position, width) {
            $super(position, width);
            this.color = window.snakeConstants.colors.foodColor;
            this.collisionType = window.snakeConstants.collisionObjectsTypes.food;
        }
    });

    var Wall = Class.create(StaticObject, {
        initialize: function ($super, position, width) {
            $super(position, width);
            this.color = window.snakeConstants.colors.wallColor;
            this.collisionType = window.snakeConstants.collisionObjectsTypes.wall;
        },
        isCollision: function (coordObj) {
            if (coordObj.X <= 0 || coordObj.X > 190 || coordObj.Y <= 0 || coordObj.Y >= 190) {
                return true;
            }
        }
    });

    var Rock = Class.create(StaticObject, {
        initialize: function ($super, position, width) {
            $super(position, width);
            this.color = snakeConstants.colors.rockColor;
            this.collisionType = window.snakeConstants.collisionObjectsTypes.wall;
        }
    });

    var SnakeHead = Class.create(MovableObject, {
        initialize: function ($super, position, width, direction) {
            $super(position, width, direction);
            this.collisionType = window.snakeConstants.collisionObjectsTypes.snakeHead;
            this.color = window.snakeConstants.colors.snakeHeadColor;
        },
    });

    // added SnakeTail object
    var SnakeTail = Class.create(MovableObject, {
        initialize: function ($super, position, width, nextTail) {
            $super(position, width, new Coords(nextTail.direction.X, nextTail.direction.Y));
            this.collisionType = window.snakeConstants.collisionObjectsTypes.tail;
            this.color = window.snakeConstants.colors.snakeTailColor;
            this.nextTail = nextTail;
        },
        update: function () {
            this.position.X += this.direction.X;
            this.position.Y += this.direction.Y;

            //If the direction of the next tail changes
            if (!this.direction.equals(this.nextTail.direction)) {
                if (this.direction.X > 0 && (this.position.X + this.direction.X) > this.nextTail.position.X
                    || (this.direction.X < 0 && (this.position.X + this.direction.X) < this.nextTail.position.X)
                    || (this.direction.Y > 0 && (this.position.Y + this.direction.Y) > this.nextTail.position.Y)
                    || (this.direction.Y < 0 && (this.position.Y + this.direction.Y) < this.nextTail.position.Y)) {
                    this.direction = new Coords(this.nextTail.direction.X, this.nextTail.direction.Y);
                }
            }
        }
    });

    //start new type of piece
    var TailPiece = Class.create(MovableObject, {
        initialize: function ($super, position, width, prevPiece) {
            $super(position, width);
        },
        update: function () { }
    });
    var GameObjectsCreator = {
        createTail: function () {

        }
    };

    return {
        //TODO static and movable object will be hidden in final version
        StaticObject: StaticObject,
        MovableObject: MovableObject,

        //theese are the objects that will show ouside
        // or show only gameObjectsFactory
        SnakeHead: SnakeHead,
        SnakeTail: SnakeTail,
        Food: Food,
        Rock: Rock,
        Wall: Wall,

        // TODO:
        // TailPiece = object,piece that takes its next position from a previous piece and 
        // puts its current position in a property for the next
        // tailpiece to take, each piece must have a pointer to the previous piece
        //TailPiece: TailPiece 

        //SnakeObject: SnakeObject, -- not needed - we'll have a head and it will have one property - last/previous coordinates and the first tail will have a ponter to that
        //GameObjectsFactory: GameObjectsFactory -- an object to create other objects by given position x postion y width color collisionType
    }
})();

//TODO put in separate file at end of development
var GameControllersNS = (function () {
    var GameController = Class.create({
        initialize: function (drawer, gameObjectsFactory) {
            this.allObjects = [];

            //for collision detection - check all movable objects against all objects for collision
            this.movableObjects = [];

            //the object wich will draw objects
            this.drawer = drawer;

            //setting the class of element so it can be later used
            this.drawer.canvasElement.className =
                window.snakeConstants.gameVisualizingElementClass;

            //for pausing and starting game
            this.gameLoopInterval;

            //for easiaer movement of the snake 
            this.snakeHead;

            //initializes keypress events - attaches event handler on window!
            this.initEvents();
        },
        initEvents: function () {
            var canvasElement = this.drawer.canvasElement;
            if (!canvasElement.gameEnginePointer) {
                //give a pointer to game controller for event to find
                canvasElement.gameEnginePointer = this;
            }

            jQuery(window).on('keyup', function (event) {
                var that = jQuery('.snake-game')[0].gameEnginePointer;
                var pressedKeyCode = event.keyCode;

                that.handleKeyPress(pressedKeyCode);
            });
        },
        addObject: function (gameObject) {
            this.allObjects.push(gameObject);
            if (gameObject.type === window.snakeConstants.objectTypes.movableObject) {
                this.movableObjects.push(gameObject);
            }
        },
        gameLoop: function () {
            //this.detectCollisions();
            var that = this;
            this.gameInterval = setInterval(function () {

                that.checkForCollisions();

                that.updateElements();

                that.drawElements();

            }, 1000 / 60);
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
        },
        handleKeyPress: function (keyCode) {
            switch (keyCode) {
                case window.snakeConstants.snakeKeys.up: {
                    this.changeMovementToUp();
                    break;
                }
                case window.snakeConstants.snakeKeys.down: {
                    this.changeMovementToDown();
                    break;
                }
                case window.snakeConstants.snakeKeys.left: {
                    this.changeMovementToLeft();
                    break;
                }
                case window.snakeConstants.snakeKeys.right: {
                    this.changeMovementToRight();
                    break;
                }

                default: { break; }
            }
        },
        changeMovementToUp: function () {
            if (this.snakeHead.direction.Y !== 1) {
                this.snakeHead.direction.X = 0;
                this.snakeHead.direction.Y = -1;
            }
        },
        changeMovementToDown: function () {
            if (this.snakeHead.direction.Y !== -1) {
                this.snakeHead.direction.X = 0;
                this.snakeHead.direction.Y = 1;
            }
        },
        changeMovementToLeft: function () {
            if (this.snakeHead.direction.X != 1) {
                this.snakeHead.direction.X = -1;
                this.snakeHead.direction.Y = 0;
            }
        },
        changeMovementToRight: function () {
            if (this.snakeHead.direction.X !== -1) {
                this.snakeHead.direction.X = 1;
                this.snakeHead.direction.Y = 0;
            }
        },
        ///substracts coords and checks if x < standart width and y< standart width
        checkForCollisions: function () {
            var head = this.snakeHead;
            var i = 0;
            var allObjLen = this.allObjects.length;

            for (i = 0; i < allObjLen; i++) {
                var nextObj = this.allObjects[i];
                if (nextObj.collisionType === snakeConstants.collisionObjectsTypes.snakeHead) {
                    continue;
                }

                var theyCollide = this.checkForCollision(head, nextObj);
                if (theyCollide) {
                    this.handleCollisions(head, nextObj);
                }
            }
        },
        handleCollisions: function (snakeHead, otherObj) {
            switch (otherObj.collisionType) {
                case snakeConstants.collisionObjectsTypes.rock:
                case snakeConstants.collisionObjectsTypes.wall:
                case snakeConstants.collisionObjectsTypes.tail:{
                    this.gameOver();
                    break;
                }

                case snakeConstants.collisionObjectsTypes.food: {
                    var foodObj = otherObj;
                    this.extendTail(snakeHead, foodObj);
                    break;
                }

                default: break;
            }

        },
        //Added extendTail method.
        extendTail: function (snakeHead, foodObj) {
            var tailPosition = new Coords(this.snakeHead.position.X, this.snakeHead.position.Y);
            var snakeDirection = this.snakeHead.direction;

            var newTail = new GameObjectsNS.SnakeTail(tailPosition, 10, this.snakeHead);

            if (snakeDirection.X > 0 || snakeDirection.X < 0) {
                this.snakeHead.position.X = foodObj.position.X;
                tailPosition.X -= snakeDirection.X;
            }
            else if (snakeDirection.Y > 0 || snakeDirection.Y < 0) {
                this.snakeHead.position.Y = foodObj.position.Y;
                tailPosition.Y -= snakeDirection.Y;
            }

            if (this.snakeHead.lastTail) {
                this.snakeHead.lastTail.nextTail = newTail;
            }
            this.snakeHead.lastTail = newTail;

            this.addObject(newTail);
        },
        gameOver: function () {
            alert('Snake ate smthing it wasn\'t supposed to!');
            clearInterval(this.gameInterval);
        },
        checkForCollision: function (one, other) {
            var collided = false;

            var collideCoords = new Coords().substract(one.position, other.position);

            if (Math.abs(collideCoords.X) <= one.width &&
				Math.abs(collideCoords.Y) <= one.width) {
                collided = true;
            }

            return collided;
        }
    });

    return {
        GameController: GameController,
        //TODO:
        //MenuController: MenuController,
    }

})();

//TODO put in separate file at end of development
var DrawersNS = (function () {
    var CanvasDrawer = Class.create({
        initialize: function (cavasElementSelector) {
            this.canvasElement = jQuery(cavasElementSelector).get(0)
            this.ctx = this.canvasElement.getContext('2d');
        },
        draw: function (gameObject) {
            //just in case
            this.ctx.save();
            
            //set only for testing purposes //TODO remove after ..
            //this.ctx.fillStyle = "red";
            if (gameObject.color) {
                this.ctx.fillStyle = gameObject.color;
            }

            //draws a rectangle at given position with given width and color
            this.ctx.fillRect(gameObject.position.X, gameObject.position.Y,
                gameObject.width, gameObject.width);

            //restores the ctx as it was before step - this.ctx.save();
            this.ctx.restore();
        }
    });

    return {
        CanvasDrawer: CanvasDrawer,
        //MenuDrawer: MenuDrawer - maybe wont be needed - use DOM elements instead of drawing in 
    }
})();

//TODO put in separate file at end of development
window.onload = function () {
    jQuery('#canvas').css('border', '1px solid blue');

    var drawer = new DrawersNS.CanvasDrawer('#canvas');

    var controller = new GameControllersNS.GameController(drawer);

    var snakeHeadPosition = new Coords(25, 25);
    var snakeHeadDirection = new Coords(1, 0);

    var snakeHead = new GameObjectsNS.SnakeHead(snakeHeadPosition, 10, snakeHeadDirection);
    snakeHead.previousPosition = snakeHeadPosition;

    var food = new GameObjectsNS.Food(new Coords(60, 50), snakeConstants.standartWidthOfElements);
    var food2 = new GameObjectsNS.Food(new Coords(10, 40), snakeConstants.standartWidthOfElements);
    var food3 = new GameObjectsNS.Food(new Coords(15, 20), snakeConstants.standartWidthOfElements);

    var rock1 = new GameObjectsNS.Rock(new Coords(35, 45), snakeConstants.standartWidthOfElements);
    //var food4 = new GameObjectsNS.Food(new Coords(60, 10), 10);
    //var food5 = new GameObjectsNS.Food(new Coords(45, 15), 10);
    //idea -> var factory = new GameObjectsNS.Factory();
    //var newFood = factory(position, width, color, collisionObjectType, //eventually direction//)

    var standartWidth = snakeConstants.standartWidthOfElements
    var lenX = 200 - standartWidth;
    var lenY = 200 - standartWidth;

    controller.addObject(snakeHead);
    //var foods = [food, food2, food3];
    //for (var i = 0; i < foods.length; i++) {
    //    controller.addObject(foods[i]);
    //}
    //controller.addObject(new GameObjectsNS.Wall());
    controller.addObject(food)
    controller.addObject(rock1);
    controller.snakeHead = snakeHead;


    //TODO - Put in separate method - create walls!!
    for (var x = 0; x <= lenX; x += standartWidth) {
        var nextWallTop = new GameObjectsNS.Wall(new Coords(x, 0), standartWidth);
        var nextWallBottom = new GameObjectsNS.Wall(new Coords(x, 190), standartWidth);
        controller.addObject(nextWallTop);
        controller.addObject(nextWallBottom);
    }

    for (var y = 0; y < lenY; y += standartWidth) {
        var nextWallLeft = new GameObjectsNS.Wall(new Coords(0, y), standartWidth);
        var nextWallRight = new GameObjectsNS.Wall(new Coords(190, y), standartWidth);
        controller.addObject(nextWallLeft);
        controller.addObject(nextWallRight);
    }

    controller.gameLoop();
};
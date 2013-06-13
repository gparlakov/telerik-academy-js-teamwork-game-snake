//**using jQuery jQuery**///
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
        snakeTailColor: 'green',
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
    },
    localStorageName: "snake-results-local",
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
			this.position.add(this.direction); 
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
            this.collisionType = window.snakeConstants.collisionObjectsTypes.rock;
        }
    });

    var SnakeHead = Class.create(MovableObject, {
        initialize: function ($super, position, width, direction) {
            $super(position, width, direction);
            this.collisionType = window.snakeConstants.collisionObjectsTypes.snakeHead;
            this.color = window.snakeConstants.colors.snakeHeadColor;
        }
    });

    //start new type of piece
    var TailPiece = Class.create(MovableObject, {
        initialize: function ($super, position, width, prevPiece) {
            $super(position, width, new Coords(0, 0));
            this.color = snakeConstants.colors.snakeTailColor;
			this.prevPiece = prevPiece;
			this.bufferCoords = [];            
        },
        
        update: function () {
			var currPositionOfPrevCopy = 
				new Coords(this.prevPiece.position.X, this.prevPiece.position.Y);
				
			this.bufferCoords.push(currPositionOfPrevCopy);
			if(this.bufferCoords.length > this.width + 2){
			    this.position.changeTo(this.bufferCoords.shift());
			    if (!this.collisionType) {
			        this.collisionType = snakeConstants.collisionObjectsTypes.tail;
			    }
			}
		}
    });
	
    return {
        //theese are the objects that will show ouside       
        SnakeHead: SnakeHead,
        TailPiece: TailPiece,
        Food: Food,
        Rock: Rock,
        Wall: Wall,
    }
})();

//TODO put in separate file at end of development
var GameControllersNS = (function ($) {
    var GameController = Class.create({
        initialize: function (drawer, gameObjectsFactory) {
            this.points = {
                countEaten: 0,
                timePlayed: 0
            };

            this.fieldWidth = drawer.width;
            this.fieldHeight = drawer.height;

            this.allObjects = [];

            //for collision detection - check all movable objects against all objects for collision
            this.movableObjects = [];

            //the object wich will draw objects
            this.drawer = drawer;
            drawer.canvasElement.addClass(snakeConstants.gameVisualizingElementClass);

            //setting the class of element so it can be later used
            this.drawer.canvasElement.className =
                window.snakeConstants.gameVisualizingElementClass;

            //for pausing and starting game
            this.gameLoopInterval;

            //for easiaer movement of the snake 
            this.snakeHead;

            //initializes keypress events - attaches event handler on window!
            this.initEvents();

            this.initGame();

            this.gameIsOver = false;
        },
        initEvents: function () {
            var canvasElement = this.drawer.canvasElement.get(0);
            if (!canvasElement.gameEnginePointer) {
                //give a pointer to game controller for event to find
                canvasElement.gameEnginePointer = this;
            }

            $(window).on('keyup', function (event) {
                var selector = '.' + snakeConstants.gameVisualizingElementClass;
                var that = $(selector)[0].gameEnginePointer;
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
            
            var that = this;
            this.gameInterval = setInterval(function () {
				that.checkForCollisions();

                that.updateElements();

                that.drawElements();

                that.points.timePlayed += 1;

                that.drawer.displayCurrentPoints(that.points.countEaten);
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
        
        //**Key handling *//
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

        /*Collisions part*/
        ///substracts coords and checks if x < standart width and y< standart width
        checkForCollisions: function () {
            var head = this.snakeHead;
            var i = 0;
            var allObjLen = this.allObjects.length;
        
            for (i = 0; i < allObjLen; i++) {
                if (this.gameIsOver) {
                    break;
                }

                var nextObj = this.allObjects[i];
                if (nextObj.collisionType === snakeConstants.collisionObjectsTypes.snakeHead) {
                    continue;
                }
        
                var theyCollide = this.checkIfCollide(head, nextObj, i);
                if (theyCollide) {
                    this.handleCollisions(head, nextObj, i);
                }
            }
        },
        checkIfCollide: function (one, other) {
            var collided = false;

            var collideCoords = new Coords().substract(one.position, other.position);

            if (Math.abs(collideCoords.X) <= one.width &&
				Math.abs(collideCoords.Y) <= one.width) {
                collided = true;
            }

            return collided;
        },
        handleCollisions: function (snakeHead, otherObj, allObjectsCurrIndex) {
            if (otherObj.prevPiece && snakeHead === otherObj.prevPiece) {
                return;
            }

            switch (otherObj.collisionType) {
                case snakeConstants.collisionObjectsTypes.rock:
                case snakeConstants.collisionObjectsTypes.wall:
                case snakeConstants.collisionObjectsTypes.tail: {
                    this.gameOver();
                    break;
                }

                case snakeConstants.collisionObjectsTypes.food: {
                    var foodObj = otherObj;
                    var tailObj = this.extendTail(snakeHead, foodObj);

                    // exchange the food with the tail object in the objects array
                    this.allObjects[allObjectsCurrIndex] = tailObj;

                    this.generateFood();
                    break;
                }

                default: break;
            }

        },        
        extendTail: function (snakeHead, foodObj) {	
			if(!snakeHead.lastPiece){
				snakeHead.lastPiece = snakeHead;
			}
            var tailpiece = new GameObjectsNS.TailPiece(foodObj.position, foodObj.width, snakeHead.lastPiece);
			
			snakeHead.lastPiece = tailpiece;
			
			this.points.countEaten += 1;;
			return tailpiece;
        },
        gameOver: function () {
            clearInterval(this.gameInterval);
            this.gameIsOver = true;
            alert('Snake ate smthing it wasn\'t supposed to!');
            var name = prompt("your name");

            this.saveResult(name);

            $(window).off('keyup');
        },
    
        //*Initial generating*//
        generateFood: function () {
		    var newFood = new GameObjectsNS.Food(this.generateRandomPosition(),
                snakeConstants.standartWidthOfElements);

			this.addObject(newFood);			
		},
		generateRandomPosition: function () {            

		    var x = parseInt(Math.random() * (this.fieldWidth - 2 * snakeConstants.standartWidthOfElements) + snakeConstants.standartWidthOfElements);
		    var y = parseInt(Math.random() * (this.fieldHeight - 2 * snakeConstants.standartWidthOfElements) + snakeConstants.standartWidthOfElements);

		    return new Coords(x, y);
		},
		surroundWithWall: function () {
		    var standartWidth = snakeConstants.standartWidthOfElements;
		    var maxX = this.fieldWidth - standartWidth;
		    var maxY = this.fieldHeight - standartWidth;

		    for (var x = 0; x <= this.fieldWidth; x += standartWidth) {
		        var nextWallTop = new GameObjectsNS.Wall(new Coords(x, 0), standartWidth);
		        var nextWallBottom = new GameObjectsNS.Wall(new Coords(x, maxY), standartWidth);
		        this.addObject(nextWallTop);
		        this.addObject(nextWallBottom);
		    }

		    for (var y = 0; y < this.fieldHeight; y += standartWidth) {
		        var nextWallLeft = new GameObjectsNS.Wall(new Coords(0, y), standartWidth);
		        var nextWallRight = new GameObjectsNS.Wall(new Coords(maxX, y), standartWidth);
		        this.addObject(nextWallLeft);
		        this.addObject(nextWallRight);
		    }
		},
		genSnakeHead: function () {
		    var snakePos = this.generateRandomPosition();
		    var snakeWidth = snakeConstants.standartWidthOfElements;
		    var snakeDirection = new Coords(1, 0);
		    var snakeHead = new GameObjectsNS.SnakeHead(snakePos, snakeWidth, snakeDirection);

		    this.addObject(snakeHead);
		    this.snakeHead = snakeHead;

		}, genRocks: function () {
		    var numberOfRocks = parseInt(Math.random() * 5);

		    for (var i = 0; i < numberOfRocks; i++) {
		        var nextRockPosition = this.generateRandomPosition();
		        var nextRockWidth = snakeConstants.standartWidthOfElements;
		        var nextRock = new GameObjectsNS.Rock(nextRockPosition, nextRockWidth);

		        this.addObject(nextRock);
		    }
		},
		initGame: function () {
		    this.surroundWithWall();
		    this.genSnakeHead();
		    this.genRocks();
		    this.generateFood();
		},

        //**Finalizing result*//
		saveResult: function (name) {

            name = name || "Snake eater Anonimous!"
		    var result = {
		        "name": name,
		        "countEaten": this.points.countEaten,
		        "timePlayed": this.points.timePlayed
		    }


		    var currResults = this.getResults();
		    currResults.push(result);

		    currResults.sort(function (a, b) { return b.countEaten - a.countEaten });

		    localStorage.setItem(snakeConstants.localStorageName, JSON.stringify(currResults));
		},
		getResults: function () {
		    var currResult = JSON.parse(localStorage.getItem(snakeConstants.localStorageName));
		    if (!currResult) {
		        currResult = [];
		    }

		    return currResult;
		}		
    });

    return {
        GameController: GameController,
        //TODO:
        //MenuController: MenuController,
    }

})(jQuery);

//TODO put in separate file at end of development
var DrawersNS = (function ($) {
    var CanvasDrawer = Class.create({
        initialize: function (cavasElementSelector) {
            this.canvasElement = $(cavasElementSelector);
            this.ctx = this.canvasElement.get(0).getContext('2d');

            this.width = parseInt(this.canvasElement.css('width'));
            this.height = parseInt(this.canvasElement.css('height'));
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
        },
        displayCurrentPoints: function (points) {
            this.ctx.save();            
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx.fillText("Points:" + points, this.width / 2, 20);
            this.ctx.restore();
        }
    });

    return {
        CanvasDrawer: CanvasDrawer,
        //MenuDrawer: MenuDrawer - maybe wont be needed - use DOM elements instead of drawing in 
    }
})(jQuery);


//TODO put in separate file at end of development
window.onload = function () {
    jQuery('#canvas').css('border', '1px solid blue');
	
    var drawer = new DrawersNS.CanvasDrawer('#canvas');

    var controller = new GameControllersNS.GameController(drawer);

    
    controller.gameLoop();
};
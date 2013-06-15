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
        foodColor: 'red',
        textColor: 'rgba(255, 0, 0, 0.3)'
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

//TODO put in separate file at end of development
var gameObjectsNS = (function () {

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
var gameControllersNS = (function ($) {
    var GameController = Class.create({
        initialize: function (drawer, resultHandler) {
            this.points = {
                countEaten: 0,
                timePlayed: 0
            };

            this.fieldWidth = drawer.width;
            this.fieldHeight = drawer.height;

            this.allObjects = [];

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

            this.resultHandler = resultHandler;
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
        // substracts coords and returns true
        // if its X and Y are smaller than the first elements' width
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
            // skips the first tail object beacuse of game phisics
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
            var tailpiece = new gameObjectsNS.TailPiece(foodObj.position, foodObj.width, snakeHead.lastPiece);
			
			snakeHead.lastPiece = tailpiece;
			
			this.points.countEaten += 1;;
			return tailpiece;
        },
        //gameOver: function () {
        //    clearInterval(this.gameInterval);
        //    this.gameIsOver = true;
           
        //    //var name = prompt("The snake is dead. Your name for the investigation:");
        //    var gameOverScren = document.createElement("div");
            
        //    this.resultHandler.saveResult(name, this.points);

        //    $(window).off('keyup');
        //},
        gameOver: function () {
            //TODO: SUBMIT onclick??
            //this appends massage to div>span
            var massage = $("#gameOverMassage");
            massage.text("Game Over your points: " + this.points.countEaten);
            var gameOverBar = $('div#gameOver');

            //This calls the gameOver menu
			gameOverBar.show(500, function() {
			    $( this ).animate({top:250}, 'slow');
			});
            
            //this appends tweet event to #tweetIt btn
            $("#tweetIt").click(function(ev) {
                var tweetMassage = "I played snake :D";
                if (tweetMassage.length > 140) {
                    alert("tweets can't be so large");
                } else {
                    var tweetLink = 'http://twitter.com/home?status=' + encodeURIComponent(tweetMassage);
                    window.open(tweetLink, "_blank");
                }
            });


			clearInterval(this.gameInterval);
},
        //*Initial generating*//
       
        generateRandomPosition: function () {
            var standartWidth = snakeConstants.standartWidthOfElements;
		    var minX = standartWidth * 2;
		    var minY = standartWidth * 2;
		    var maxX = this.fieldWidth - standartWidth * 2;
		    var maxY = this.fieldHeight - standartWidth * 2;


		    var x = parseInt(Math.random() * (maxX - minX) + minX);
		    var y = parseInt(Math.random() * (maxY - minY) + minY);

		    return new Coords(x, y);
		},
		surroundWithWall: function () {
		    var standartWidth = snakeConstants.standartWidthOfElements;
		    var maxX = this.fieldWidth - standartWidth;
		    var maxY = this.fieldHeight - standartWidth;

		    for (var x = 0; x <= this.fieldWidth; x += standartWidth) {
		        var nextWallTop = new gameObjectsNS.Wall(new Coords(x, 0), standartWidth);
		        var nextWallBottom = new gameObjectsNS.Wall(new Coords(x, maxY), standartWidth);
		        this.addObject(nextWallTop);
		        this.addObject(nextWallBottom);
		    }

		    for (var y = 0; y < this.fieldHeight; y += standartWidth) {
		        var nextWallLeft = new gameObjectsNS.Wall(new Coords(0, y), standartWidth);
		        var nextWallRight = new gameObjectsNS.Wall(new Coords(maxX, y), standartWidth);
		        this.addObject(nextWallLeft);
		        this.addObject(nextWallRight);
		    }
		},
		genSnakeHead: function () {
		    var snakePos = this.generateRandomPosition();
		    var snakeWidth = snakeConstants.standartWidthOfElements;
		    var snakeDirection = new Coords(1, 0);
		    var snakeHead = new gameObjectsNS.SnakeHead(snakePos, snakeWidth, snakeDirection);

		    this.addObject(snakeHead);
		    this.snakeHead = snakeHead;

		},
		genRocks: function () {
		    var numberOfRocks = parseInt(Math.random() * snakeConstants.rocksCount);

		    for (var i = 0; i < numberOfRocks; i++) {
		        var nextRockPosition = this.generateRandomPosition();
		        var nextRockWidth = snakeConstants.standartWidthOfElements;
		        var nextRock = new gameObjectsNS.Rock(nextRockPosition, nextRockWidth);

		        this.addObject(nextRock);
		    }
		},
		generateFood: function () {
		    var newFood = new gameObjectsNS.Food(this.generateRandomPosition(),
                snakeConstants.standartWidthOfElements);

		    this.addObject(newFood);
		},
		initGame: function () {
		    this.surroundWithWall();
		    this.genRocks();
		    this.generateFood();
		    this.genSnakeHead();
		}
		
    });

    // this is the object that can save and load results int localStorage    
    var resultsHandler = Class.create({
        initialize: function () { },
        //takse name and an points obj.countEaten, obj.timePlayed
        saveResult: function (name, pointsObj) {
            name = name || "Snake eater Anonimous!"

            var result = {
                "name": name,
                "countEaten": pointsObj.countEaten,
                "timePlayed": pointsObj.timePlayed
            };
            
            var currResults = this.getResults();
            currResults.push(result);

            currResults.sort(function (a, b) { return b.countEaten - a.countEaten });

            localStorage.setItem(snakeConstants.localStorageName, JSON.stringify(currResults));
        },
        // returns an array of objects with obj.name, obj.countEaten, obj.timePlayed
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
        resultsHandler: resultsHandler
        //TODO:
        //MenuController: MenuController,
    }

})(jQuery);

//TODO put in separate file at end of development
var drawersNS = (function ($) {
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
            this.ctx.fillStyle = snakeConstants.colors.textColor;
            this.ctx.fillText("Points:" + points, this.width / 2 - 20, 20);
            this.ctx.restore();
        }
    });

    return {
        CanvasDrawer: CanvasDrawer,
        //MenuDrawer: MenuDrawer - maybe wont be needed - use DOM elements instead of drawing in 
    };
})(jQuery);


//TODO this will be the function to call on menu callback - when start game is pressed
//window.onload = function () {
//    jQuery('#canvas').css('border', '1px solid blue');
	
//    var resultsHandler = new gameControllersNS.resultsHandler()

//    var drawer = new drawersNS.CanvasDrawer('#canvas');

//    var controller = new gameControllersNS.GameController(drawer, resultsHandler);

    
//    controller.gameLoop();
//};

// START GAME
var startGame = function () {
    jQuery('#canvas').css('border', '1px solid blue');

    var resultsHandler = new gameControllersNS.resultsHandler();

    var drawer = new drawersNS.CanvasDrawer('#canvas');

    var controller = new gameControllersNS.GameController(drawer, resultsHandler);

    
    controller.gameLoop();
};

// START BUTTON




window.onload = function () {
   
    var $ = jQuery.noConflict();
    var _startGame = $("#startGame");
    _startGame.click(function() {
        startGame();
        startMenu.hide();
    });
    var startMenu = $("#startMenu");
    var startBtn = $("#startBtn>img");
    startBtn.on("click", function() {
        var $this = $(this);
        if ($this.data("clicked")) {
            $("body").css({ 'backgroundImage': "url(img/tabletOff.jpg)" });
            $this.data('clicked', false);
            $("#startBtnImg").attr("src", "img/offBtn.jpg");
            startMenu.hide();
        } else {
            //Menu is on!
            $this.data('clicked', true);
            var startBtnImg = $("#startBtnImg");
            startBtnImg.attr("src", "img/onBtn.jpg");
            var body = $("body");
            body.css({ 'backgroundImage': "url(img/tabletOn.jpg)" });
            startMenu.show();
        }
    });

};

//$("#tweetIt").click(function(ev) {
//    var tweetMassage = "I played snake :D";
//    if (tweetMassage.length > 140) {
//        alert("tweets can't be so large");
//    } else {
//        var tweetLink = 'http://twitter.com/home?status=' + encodeURIComponent(tweetMassage);
//        window.open(tweetLink, "_blank");
//    }  $("#tweetIt").click(function(ev) {
//        var tweetMassage = "I played snake :D";
//        if (tweetMassage.length > 140) {
//            alert("tweets can't be so large");
//        } else {
//            var tweetLink = 'http://twitter.com/home?status=' + encodeURIComponent(tweetMassage);
//            window.open(tweetLink, "_blank");
//        }
var gameControllersNS = (function ($) {
    var GameController = Class.create({
        initialize: function (drawer, menuController) {
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

            //for easier movement of the snake 
            this.snakeHead;

            //initializes keypress events - attaches event handler on window!
            this.initEvents();

            this.initGame();

            this.menuController = menuController;

            this.gameIsOver = false;
        },
        initEvents: function () {
            var canvasElement = this.drawer.canvasElement.get(0);
            var controller = this;
            if (!canvasElement.gameEnginePointer) {
                //give a pointer to game controller for event to find
                canvasElement.gameEnginePointer = this;
            }
            $(window).on('keydown', function (event) {               
                var selector = '.' + snakeConstants.gameVisualizingElementClass;
                //var that = $(selector)[0].gameEnginePointer;
                var pressedKeyCode = event.keyCode;

                controller.handleKeyPress(pressedKeyCode, event);
            });
        },
        addObject: function (gameObject) {
            if (!gameObject.update) {
                throw new { message: "Can't add a random object that doesen't have update() to objects" };
            }

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
            var preventDefault = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            switch (keyCode) {
                case window.snakeConstants.snakeKeys.up: {
                    this.changeMovementToUp();
                    preventDefault(event);
                    break;
                }
                case window.snakeConstants.snakeKeys.down: {
                    this.changeMovementToDown();
                    preventDefault(event);
                    break;
                }
                case window.snakeConstants.snakeKeys.left: {
                    this.changeMovementToLeft();
                    preventDefault(event);
                    break;
                }
                case window.snakeConstants.snakeKeys.right: {
                    this.changeMovementToRight();
                    preventDefault(event);
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
            if (snakeHead.collisionType != snakeConstants.collisionObjectsTypes.snakeHead) {
                throw new { message: "An object that is not a snake headpassed to extendTail()!" }
            }

            if (foodObj.collisionType != snakeConstants.collisionObjectsTypes.food) {
                throw new { message: "An object that is not a food passed to extendTail()!" }
            }


            if (!snakeHead.lastPiece) {
                snakeHead.lastPiece = snakeHead;
            }
            var tailpiece = new gameObjectsNS.TailPiece(foodObj.position, foodObj.width, snakeHead.lastPiece);

            snakeHead.lastPiece = tailpiece;

            this.points.countEaten += 1;;
            return tailpiece;
        },
        gameOver: function () {
            clearInterval(this.gameInterval);
            $(window).off('keydown');
            this.gameIsOver = true;
            this.menuController.gameOver(this.points);
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
    var ResultsHandler = Class.create({
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
        ResultsHandler: ResultsHandler
    }

})(jQuery);
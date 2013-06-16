/// <reference path="snake.js" />

(function ($) {
    $(document).ready(function () {
        //addObject tests
        (function () {
            var gameController;

            module("AddObjects tests");

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    width: 10,
                    height: 10
                };
                gameController = new gameControllersNS.GameController(stubTestDrawer);
                gameController.allObjects = [];
            });
                 
            test("Don't allow objects without update() to be added", function () {
                var randomObj = {};
                throws(function () {
                    gameController.addObject(randomObj);
                }, "Does throw exception when adding a random object");
            });

            test("Add food in all objects", function () {

                var food = new gameObjectsNS.Food(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                gameController.addObject(food);

                ok(gameController.allObjects.length === 1, "Added 1");
                equal(snakeConstants.collisionObjectsTypes.food, gameController.allObjects[0].collisionType, "Food added ok");
            });

            test("Add rock in all objects", function () {

                var rock = new gameObjectsNS.Rock(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                gameController.addObject(rock);

                ok(gameController.allObjects.length === 1, "Added 1");
                equal(snakeConstants.collisionObjectsTypes.rock, gameController.allObjects[0].collisionType, "Rock added ok");
            });

            test("Add wall in all objects", function () {

                var wall = new gameObjectsNS.Wall(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                gameController.addObject(wall);

                ok(gameController.allObjects.length === 1, "Added 1");
                equal(snakeConstants.collisionObjectsTypes.wall, gameController.allObjects[0].collisionType, "Wall added ok");
            });

            test("Add snakehead in all objects", function () {

                var snakeHead = new gameObjectsNS.SnakeHead(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                gameController.addObject(snakeHead);

                ok(gameController.allObjects.length === 1, "Added 1");
                equal(snakeConstants.collisionObjectsTypes.snakeHead, gameController.allObjects[0].collisionType, "Snakehead added ok");
            });

            test("Add snaketail in all objects", function () {
                var snakeTail = new gameObjectsNS.TailPiece(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                gameController.addObject(snakeTail);

                ok(gameController.allObjects.length === 1, "Added 1");
                equal(snakeConstants.collisionObjectsTypes.tail, gameController.allObjects[0].collisionType, "Snakehead added ok");
            });

            test("Add multiple objects in all objects", function () {
                var food = new gameObjectsNS.Food(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                var rock = new gameObjectsNS.Rock(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                var wall = new gameObjectsNS.Wall(new Coords(5, 5), snakeConstants.standartWidthOfElements);
                var snakeHead = new gameObjectsNS.SnakeHead(new Coords(5, 5), snakeConstants.standartWidthOfElements);

                gameController.addObject(snakeHead);
                gameController.addObject(rock);
                gameController.addObject(wall);
                gameController.addObject(food);

                equal(4, gameController.allObjects.length, "Added 4 objects OK");
            });

            QUnit.testStart(function () { });

        })();

        //changeDirection to Up 
        (function () {
            module("Change direction to UP");
            var gameController;
            var directions = {
                left: { X: -1, Y: 0 },
                right:  { X: 1, Y: 0 },
                up: { X: 0, Y: -1},
                down: { X: 0, Y: 1 }
            }
            
            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 100,
                    height: 100
                };
                gameController = new gameControllersNS.GameController(stubTestDrawer);
            });

            test("Change direction to UP from LEFT", function () {
                gameController.snakeHead.direction = directions.left;
                gameController.changeMovementToUp();

                var expectedDirectionOfMovement = directions.up;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to UP from LEFT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to UP from LEFT Y OK");
                
            });

            test("Change direction to UP from RIGHT", function () {
                gameController.snakeHead.direction = directions.right;
                gameController.changeMovementToUp();

                var expectedDirectionOfMovement = directions.up;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to up from RIGHT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to up from RIGHT Y OK");

            });

            test("Not changed direction to UP from DOWN", function () {
                gameController.snakeHead.direction = directions.down;
                gameController.changeMovementToUp();

                var expectedDirectionOfMovement = directions.down;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction NOT changed to up from DOWN X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction NOT changed to up from DOWN Y OK");
            });

            test("Direction remains UP from UP", function () {
                gameController.snakeHead.direction = directions.up;
                gameController.changeMovementToUp();

                var expectedDirectionOfMovement = directions.up;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction REMAINS up from UP X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction REMAINS up from UP Y OK");
            });

            QUnit.testStart(function () { });
        })();
        
        //changeDirection to Down 
        (function () {
            module("Change direction to DOWN");
            var gameController;
            var directions = {
                left: { X: -1, Y: 0 },
                right: { X: 1, Y: 0 },
                up: { X: 0, Y: -1 },
                down: { X: 0, Y: 1 }
            }
            
            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 100,
                    height: 100
                };
                gameController = new gameControllersNS.GameController(stubTestDrawer);
            });

            test("Change direction to DOWN from LEFT", function () {
                gameController.snakeHead.direction = directions.left;
                gameController.changeMovementToDown();

                var expectedDirectionOfMovement = directions.down;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to DOWN from LEFT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to DOWN from LEFT Y OK");

            });

            test("Change direction to DOWN from RIGHT", function () {
                gameController.snakeHead.direction = directions.right;
                gameController.changeMovementToDown();

                var expectedDirectionOfMovement = directions.down;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to DOWN from RIGHT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to DOWN from RIGHT Y OK");

            });

            test("Direction remains DOWN from DOWN", function () {
                gameController.snakeHead.direction = directions.down;
                gameController.changeMovementToDown();

                var expectedDirectionOfMovement = directions.down;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction REMAINS DOWN from DOWN X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction REMAINS DOWN from DOWN Y OK");
            });

            test("Not changed direction to DOWN from UP", function () {
                gameController.snakeHead.direction = directions.up;
                gameController.changeMovementToDown();

                var expectedDirectionOfMovement = directions.up;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction NOT changed to DOWN from UP X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction NOT changed to DOWN from Up Y OK");
            });

            QUnit.testStart(function () { });
        })();

        //changeDirection to Left 
        (function () {
            module("Change direction to LEFT");
            var gameController;
            var directions = {
                left: { X: -1, Y: 0 },
                right: { X: 1, Y: 0 },
                up: { X: 0, Y: -1 },
                down: { X: 0, Y: 1 }
            }

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 100,
                    height: 100
                };
                gameController = new gameControllersNS.GameController(stubTestDrawer);
            });

            test("Direction remains LEFT from LEFT", function () {
                gameController.snakeHead.direction = directions.left;
                gameController.changeMovementToLeft();

                var expectedDirectionOfMovement = directions.left;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction REMAINS LEFT from LEFT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction REMAINS LEFT from LEFT Y OK");

            });

            test("Not changed direction to LEFT from RIGHT", function () {
                gameController.snakeHead.direction = directions.right;
                gameController.changeMovementToLeft();

                var expectedDirectionOfMovement = directions.right;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction NOT changed to LEFT from RIGHT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction NOT changed to LEFT from RIGHT Y OK");

            });

            test("Change direction to LEFT from DOWN", function () {
                gameController.snakeHead.direction = directions.down;
                gameController.changeMovementToLeft();

                var expectedDirectionOfMovement = directions.left;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to LEFT from DOWN X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to LEFT from DOWN Y OK");
            });

            test("Change direction to LEFT from UP", function () {
                gameController.snakeHead.direction = directions.up;
                gameController.changeMovementToLeft();

                var expectedDirectionOfMovement = directions.left;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to LEFT from UP X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to LEFT from UP Y OK");
            });

            QUnit.testStart(function () { });

        })();

        //changeDirection to Right 
        (function () {
            module("Change direction to RIGHT");
            var gameController;
            var directions = {
                left: { X: -1, Y: 0 },
                right: { X: 1, Y: 0 },
                up: { X: 0, Y: -1 },
                down: { X: 0, Y: 1 }
            }

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 100,
                    height: 100
                };
                gameController = new gameControllersNS.GameController(stubTestDrawer);
            });

            test("NOT change direction to RIGHT from LEFT", function () {
                gameController.snakeHead.direction = directions.left;
                gameController.changeMovementToRight();

                var expectedDirectionOfMovement = directions.left;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction NOT changed to RIGHT from LEFT X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction NOT changed to RIGHT from LEFT X OK");

            });

            test("Direction remains RIGHT from RIGHT", function () {
                gameController.snakeHead.direction = directions.right;
                gameController.changeMovementToRight();

                var expectedDirectionOfMovement = directions.right;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction REMAINS RIGHT from RIGHT Y OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction REMAINS RIGHT from RIGHT Y OK");

            });

            test("Change direction to RIGHT from DOWN", function () {
                gameController.snakeHead.direction = directions.down;
                gameController.changeMovementToRight();

                var expectedDirectionOfMovement = directions.right;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to RIGHT from DOWN X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to RIGHT from DOWN Y OK");
            });

            test("Change direction to RIGHT from UP", function () {
                gameController.snakeHead.direction = directions.up;
                gameController.changeMovementToRight();

                var expectedDirectionOfMovement = directions.right;
                var actualDirection = gameController.snakeHead.direction;

                equal(expectedDirectionOfMovement.X, actualDirection.X, "Direction changed to RIGHT from UP X OK");
                equal(expectedDirectionOfMovement.Y, actualDirection.Y, "Direction changed to RIGHT from UP Y OK");
            });

            QUnit.testStart(function () { });
        })();

        //checkIfCollide tests
        (function () {
            module("Check if two objects collide tests.");
            var gameController;
            var snakeHead;
            var collidableObject;

            var position0_0 = new Coords(0, 0);
            var position0_5 = new Coords(0, 5);
            var position5_0 = new Coords(5, 0);

            var position9_9 = new Coords(9, 9);
            var positio10_10 = new Coords(10, 10);

            var position10_11 = new Coords(10, 11);
            var position11_10 = new Coords(11, 10);
            var position11_11 = new Coords(11, 11);

            var position20_20 = new Coords(20, 20);

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 100,
                    height: 100
                };

                gameController = new gameControllersNS.GameController(stubTestDrawer);
                snakeHead = gameController.snakeHead;
                snakeHead.position = position0_0;

                collidableObject = new gameObjectsNS.Food(position0_0);
            });

            

            test("Should Collide if same coordinates", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position0_0;

                ok(gameController.checkIfCollide(snakeHead, collidableObject), "Collide when same coordinates");
            });

            test("Should Collide when X difference is 5", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position5_0;

                ok(gameController.checkIfCollide(snakeHead, collidableObject), "Collide when X difference is 5");
            });

            test("Should Collide when X difference is 5", function () {
                snakeHead.position = position5_0;
                collidableObject.position = position0_0;

                ok(gameController.checkIfCollide(snakeHead, collidableObject), "Collide when X difference is 5. Snake head is below");
            });

            test("Should Collide when Y difference is 5", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position0_5;

                ok(gameController.checkIfCollide(snakeHead, collidableObject), "Collide when Y difference is 5");
            });

            test("Should Collide when X and Y difference is 9", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position9_9;

                ok(gameController.checkIfCollide(snakeHead, collidableObject), "Collide when X and Y difference is 9");
            });

            test("Should Collide when X and Y difference is 10", function () {
                snakeHead.position = position0_0;
                collidableObject.position = positio10_10;

                ok(gameController.checkIfCollide(snakeHead, collidableObject), "Collide when X and Y difference is 10");
            });

            test("Should Not Collide when X difference is 11", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position11_10;

                ok(!gameController.checkIfCollide(snakeHead, collidableObject), "Does not Collide when X 11");
            });

            test("Should Not Collide when Y difference is 11", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position10_11;

                ok(!gameController.checkIfCollide(snakeHead, collidableObject), "Does not Collide when Y 11");
            });

            test("Should Not Collide when X and Y difference is 20", function () {
                snakeHead.position = position0_0;
                collidableObject.position = position20_20;

                ok(!gameController.checkIfCollide(snakeHead, collidableObject), "Does not Collide when X and Y difference is 20");
            });

        })()

     
        ////generate random position
        var generateRandomPositionTEsts = (function () {
            module("Check if generates position from 0 to width - standartWidth * 2 /height - standartWidth * 2");
            var gameController;
            var snakeHead;
            var maxX;
            var maxY;
            var minX;
            var minY;

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 345,
                    height: 567
                };

                gameController = new gameControllersNS.GameController(stubTestDrawer);
                maxX = gameController.fieldWidth - snakeConstants.standartWidthOfElements * 2;
                maxY = gameController.fieldHeight - snakeConstants.standartWidthOfElements * 2;
                minX = snakeConstants.standartWidthOfElements * 2;
                minY = snakeConstants.standartWidthOfElements * 2;
            });

            test("Generate position that has X and Y", function () {
                var position = gameController.generateRandomPosition();

                ok(position.X, "Does it have X property");
                ok(position.Y, "Does it have Y property");
            });

            //since it generates random position will test 5 random positions to make sure
            test("Generate position that has the right X and Y first test ", function () {
                var position = gameController.generateRandomPosition();

                ok(position.X >= minX && position.X < maxX, "X ok");
                ok(position.Y >= minY && position.Y < maxY, "Y ok");
            });

            test("Generate position that has the right X and Y second test ", function () {
                var position = gameController.generateRandomPosition();

                ok(position.X >= minX && position.X < maxX, "X ok");
                ok(position.Y >= minY && position.Y < maxY, "Y ok");
            });

            test("Generate position that has the right X and Y third test ", function () {
                var position = gameController.generateRandomPosition();

                ok(position.X >= minX && position.X < maxX, "X ok");
                ok(position.Y >= minY && position.Y < maxY, "Y ok");
            });

            test("Generate position that has the right X and Y fourth test ", function () {
                var position = gameController.generateRandomPosition();

                ok(position.X >= minX && position.X < maxX, "X ok");
                ok(position.Y >= minY && position.Y < maxY, "Y ok");
            });

            test("Generate position that has the right X and Y fifth test ", function () {
                var position = gameController.generateRandomPosition();

                ok(position.X >= minX && position.X < maxX, "X ok");
                ok(position.Y >= minY && position.Y < maxY, "Y ok");
            });
        })()

        //extendTail tests
        var extendTailTests = (function () {
            module("Extend Tail tests");
            var gameController;            

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 345,
                    height: 567
                };

                gameController = new gameControllersNS.GameController(stubTestDrawer);               
            });

            test("Generate tail from non-food element - EXCEPTION", function () {
                
                throws(function () {
                    gameController.extendTail(gameController.snakeHead, {});
                }, "Throws exception when trying to add tail from an non-food element");
            });

            test("Generate tail and add to non-headElement - EXCEPTION", function () {
                var food = new gameObjectsNS.Food(new Coords(20,20), snakeConstants.standartWidthOfElements);
                throws(function () {
                    gameController.extendTail({}, food);
                }, "Throws exception when trying to add tail from an non-food element");
            });

            test("Generate tail element from food element", function () {
                var food = new gameObjectsNS.Food(new Coords(20, 20), snakeConstants.standartWidthOfElements);
                var tailElem = gameController.extendTail(gameController.snakeHead, food);
                
                var expectedType = snakeConstants.collisionObjectsTypes.tail;
                var actualType = tailElem.collisionType;

                equal(expectedType, actualType, "Extending tail works fine")
            });
            
        })()

        //surroundWithWall
        var surroundWithWallTest = (function () {
            module("Surround With Wall tests");
            var gameController;

            QUnit.testStart(function () {
                var stubTestDrawer = {
                    canvasElement: $(["testStubNeededThis"]),
                    draw: function () { },
                    width: 345,
                    height: 567
                };

                gameController = new gameControllersNS.GameController(stubTestDrawer);                
            });

            test("Run method on an instance of gameController with empty allObjects." +
                "Should generate wall elements only", function () {
                    gameController.allObjects = [];
                    gameController.surroundWithWall();
                    
                    var len = gameController.allObjects.length;

                    var allElementsAreWallElements = true;

                    for (var i = 0; i < len; i++) {
                        var nextObj = gameController.allObjects[i];

                        if (nextObj.collisionType != snakeConstants.collisionObjectsTypes.wall) {
                            allElementsAreWallElements = false;
                        }
                    }

                    ok(allElementsAreWallElements, "All elements are put on the edge");
            });
        })();

    });
}(jQuery))

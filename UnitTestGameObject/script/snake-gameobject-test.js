module('Coords.initialize');
test('When game object is created, should set correct values', function () {
    var posX = 10;
    var posY = 15;
    var position = new Coords(posX, posY);
    equal(position.X, posX);
    equal(position.Y, posY);
});

module('Coords.equals');
test('Check 2 same Coords objects if equal', function () {
    var firstPosX = 10;
    var firstPosY = 25;
    var firstPos = new Coords(firstPosX, firstPosY);

    var secondPosX = 10;
    var secondPosY = 25;
    var secondPos = new Coords(secondPosX, secondPosY);

    var expected = true;
    var actual = firstPos.equals(secondPos);
    equal(actual, expected);
});

test('Check 2 different Coords object', function () {
    var firstPosX = 10;
    var firstPosY = 25;
    var firstPos = new Coords(firstPosX, firstPosY);

    var secondPosX = 10;
    var secondPosY = 15;
    var secondPos = new Coords(secondPosX, secondPosY);

    var expected = false;
    var actual = firstPos.equals(secondPos);
    equal(actual, expected);
});

module('Coords.add');
test('Check adding coords from 1 Coords object to another', function () {
    var firstPosX = 10;
    var firstPosY = 25;
    var firstPos = new Coords(firstPosX, firstPosY);

    var secondPosX = 10;
    var secondPosY = 15;
    var secondPos = new Coords(secondPosX, secondPosY);
    
    var expectedX = firstPosX + secondPosX;
    var expectedY = firstPosY + secondPosY;
    firstPos.add(secondPos);
    equal(firstPos.X, expectedX);
    equal(firstPos.Y, expectedY);
});

module('Coords.subtract');
test('Test subtracting 2 Coords objects positions', function () {
    var firstPosX = 15;
    var firstPosY = 25;
    var firstPos = new Coords(firstPosX, firstPosY);

    var secondPosX = 10;
    var secondPosY = 15;
    var secondPos = new Coords(secondPosX, secondPosY);
    
    var expectedPos = firstPos.substract(firstPos, secondPos);
    var expectedX = firstPosX - secondPosX;
    var expectedY = firstPosY - secondPosY;
    equal(expectedX, expectedPos.X);
    equal(expectedY, expectedPos.Y);
});

module('Coords.changeTo');
test('Test changing positions of 2 Coords objects', function () {
    var firstPosX = 15;
    var firstPosY = 25;
    var firstPos = new Coords(firstPosX, firstPosY);

    var secondPosX = 10;
    var secondPosY = 15;
    var secondPos = new Coords(secondPosX, secondPosY);

    firstPos.changeTo(secondPos);
    equal(secondPos.X, firstPos.X);
    equal(secondPos.Y, firstPos.Y);
});

module('Wall.initialize');
test('When wall object is created, should set correct values', function () {
    var wallPosX = 10;
    var wallPosY = 25;
    var wallWidth = 10;
    var wallPosition = new Coords(wallPosX, wallPosY);

    var expectedColor = window.snakeConstants.colors.wallColor;
    var expectedCollisionType = window.snakeConstants.collisionObjectsTypes.wall;

    var wall = new gameObjectsNS.Wall(wallPosition, wallWidth);    
    equal(wall.position.X, wallPosX);
    equal(wall.position.Y, wallPosY);
    equal(wall.color, expectedColor);
    equal(wall.collisionType, expectedCollisionType);
    equal(wall.width, wallWidth);
});

module('Food.initialize');
test('When food object is created, should set correct values', function () {
    var foodPosX = 10;
    var foodPosY = 25;
    var foodWidth = 10;
    var foodPosition = new Coords(foodPosX, foodPosY);

    var expectedColor = window.snakeConstants.colors.foodColor;
    var expectedCollisionType = window.snakeConstants.collisionObjectsTypes.food;

    var food = new gameObjectsNS.Food(foodPosition, foodWidth);
    equal(food.position.X, foodPosX);
    equal(food.position.Y, foodPosY);
    equal(food.color, expectedColor);
    equal(food.collisionType, expectedCollisionType);
    equal(food.width, foodWidth);
});

module('Rock.initialize');
test('When rock object is created, should set correct values', function () {
    var rockPosX = 10;
    var rockPosY = 25;
    var rockWidth = 10;
    var rockPosition = new Coords(rockPosX, rockPosY);

    var expectedColor = window.snakeConstants.colors.rockColor;
    var expectedCollisionType = window.snakeConstants.collisionObjectsTypes.rock;

    var rock = new gameObjectsNS.Rock(rockPosition, rockWidth);
    equal(rock.position.X, rockPosX);
    equal(rock.position.Y, rockPosY);
    equal(rock.color, expectedColor);
    equal(rock.collisionType, expectedCollisionType);
    equal(rock.width, rockWidth);
});

module('SnakeHead.initialize');
test('When SnakeHead object is created, should set correct values', function () {
    var posX = 10;
    var posY = 15;
    var headPosition = new Coords(posX, posY);
    var width = 10;
    var direction = new Coords(1, 0);
    
    var expectedColor = window.snakeConstants.colors.snakeHeadColor;
    var expectedCollisionType = window.snakeConstants.collisionObjectsTypes.snakeHead;

    var snakeHead = new gameObjectsNS.SnakeHead(headPosition, width, direction);

    equal(snakeHead.position.X, posX);
    equal(snakeHead.position.Y, posY);
    equal(snakeHead.color, expectedColor);
    equal(snakeHead.collisionType, expectedCollisionType);
    equal(snakeHead.direction.X, 1);
    equal(snakeHead.direction.Y, 0);
});

module('SnakeHead.update');
test('SnakeHead position should change when updated. Move x coordinate.', function () {
    var posX = 10;
    var posY = 15;
    var headPosition = new Coords(posX, posY);
    var width = 10;
    var direction = new Coords(1, 0);

    var snakeHead = new gameObjectsNS.SnakeHead(headPosition, width, direction);
    snakeHead.update();

    equal(snakeHead.position.X, posX + 1);
    equal(snakeHead.position.Y, posY);
});

test('SnakeHead position should change when updated. Move y coordinate.', function () {
    var posX = 10;
    var posY = 15;
    var headPosition = new Coords(posX, posY);
    var width = 10;
    var direction = new Coords(0, 1);

    var snakeHead = new gameObjectsNS.SnakeHead(headPosition, width, direction);
    snakeHead.update();

    equal(snakeHead.position.X, posX);
    equal(snakeHead.position.Y, posY + 1);
});

module('TailPiece.initialize');
test('When TailPiece object is created, should set correct values', function () {
    var posX = 10;
    var posY = 15;
    var position = new Coords(posX, posY);    
    var width = 10;
    var direction = new Coords(0, 1);
    var expectedColor = snakeConstants.colors.snakeTailColor;

    var snakeHead = new gameObjectsNS.SnakeHead(position, width, direction);
    var tailPiece = new gameObjectsNS.TailPiece(position, width, snakeHead);

    equal(tailPiece.position.X, posX);
    equal(tailPiece.position.Y, posY);
    equal(tailPiece.prevPiece, snakeHead);
    equal(tailPiece.width, width);
    equal(tailPiece.direction.X, 0);
    equal(tailPiece.direction.Y, 0);
    equal(tailPiece.color, expectedColor);
});

module('TailPiece.update');
test('TailPiece update method test', function () {
    var posX = 10;
    var posY = 15;
    var headPosition = new Coords(posX, posY);
    var width = 10;
    var direction = new Coords(0, 1);
    var expectedCollisionsType = snakeConstants.collisionObjectsTypes.tail;
    var tailPosition = new Coords(posX, posY);

    var snakeHead = new gameObjectsNS.SnakeHead(headPosition, width, direction);
    var tailPiece = new gameObjectsNS.TailPiece(tailPosition, width, snakeHead);
    for (var i = 0; i <= width + 2; i++) {
        tailPiece.update();     
        snakeHead.update();        
    }

    equal(tailPiece.position.X, posX);
    equal(tailPiece.position.Y, posY);
    equal(tailPiece.collisionType, expectedCollisionsType);
});

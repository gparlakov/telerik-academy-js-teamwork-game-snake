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
    equal(expected, actual);
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
    equal(expected, actual);
});


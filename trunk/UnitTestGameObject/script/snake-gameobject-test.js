module('Coords.init');
test('When game object is created, should set correct values', function () {
    var posX = 10;
    var posY = 15;
    var position = new Coords(posX, posY);
    equal(position.X, posX);
    equal(position.Y, posY);
});
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
            this.collisionType = snakeConstants.collisionObjectsTypes.tail;
        },

        update: function () {
            var currPositionOfPrevCopy =
				new Coords(this.prevPiece.position.X, this.prevPiece.position.Y);

            this.bufferCoords.push(currPositionOfPrevCopy);
            if (this.bufferCoords.length > this.width + 2) {
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
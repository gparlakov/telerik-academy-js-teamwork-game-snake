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
    };
})(jQuery);
/// <reference path="jquery-ui-1.10.3.custom.js" />

var menuControllersNS = (function ($) {
    var MenuController = Class.create({
        initialize: function (menuHolderSelector) {
            this.menuHolder = $(menuHolderSelector);
            snakeConstants.gameMenuElementSelector = menuHolderSelector;

            this.menuHolder.get(0).menuControllerPointer = this;

            this.resultsHandler = new gameControllersNS.ResultsHandler();           

            this.initMenuEvents();
        },
        initMenuEvents: function () {
            var _startGame = $("#startGame");            

            _startGame.click(function () {
                $('.' + snakeConstants.gameVisualizingElementClass).show();
                $(snakeConstants.gameMenuElementSelector)
                    .get(0).menuControllerPointer.startGame();
                $("#startMenu").hide();
            });

            var startMenu = $("#startMenu");

            var startBtn = $("#startBtn>img");

            startBtn.on("click", function () {
                var $this = $(this);
                if ($this.data("clicked")) {
                    $("body").css({ 'backgroundImage': "url(img/tabletOff.jpg)" });
                    $this.data('clicked', false);
                    $("#startBtnImg").attr("src", "img/offBtn.jpg");
                    startMenu.hide();
                    canvas.hide();
                }
                else {
                    //Menu is on!
                    $this.data('clicked', true);
                    var startBtnImg = $("#startBtnImg");
                    startBtnImg.attr("src", "img/onBtn.jpg");
                    var body = $("body");
                    body.css({ 'backgroundImage': "url(img/tabletOn.jpg)" });
                    startMenu.show();
                    $("#showScores").hide();
                }
            });

            var scoreBtn = $("#scoreBoard");

            scoreBtn.on("click", this.showScores);

            var scoreBtnBack = $(".backTo");
            scoreBtnBack.on("click", function () {
                $("#showScores").hide();
            })

            //$("#instructions").click(function () {
            //    $("#instructions-holder").show();
            //    setTimeout(function () {
            //        $("#instructions-holder").hide();
            //    }, 5000);
            //});
        },
        startGame: function () {
            var drawer = new drawersNS.CanvasDrawer('#canvas');
            this.gameController = new gameControllersNS.GameController(drawer, this); 

            this.gameController.gameLoop();
        },
        gameOver: function (points) {
            //TODO: SUBMIT onclick??
            //this appends massage to div>span
            this.currentPoints = points;
            var massage = $("#gameOverMassage");
            massage.text("Game Over your points: " + points.countEaten);

            $('#submit-result').click(this.submitResult);
            var gameOverBar = $('div#gameOver');           

            //This calls the gameOver menu
            gameOverBar.show(500, function () {
                $(this).animate({ top: 250 }, 'slow');
            });

            //this appends tweet event to #tweetIt btn
            $("#tweetIt").click(function () {
                var tweetMassage = "I played snake :D";
                if (tweetMassage.length > 140) {
                    alert("tweets can't be so large");
                }
                else {
                    var tweetLink = 'http://twitter.com/home?status=' + encodeURIComponent(tweetMassage);
                    window.open(tweetLink, "_blank");
                }
            });

            $("#back").click(function () {
                $("#tweetIt").off();
                $("#back").off();
                gameOverBar.hide();
                $("#startMenu").show();
            });
        },
        submitResult: function () {
            var name = $("#player-name").val();
            var menuController =
                $(snakeConstants.gameMenuElementSelector).get(0).menuControllerPointer;

            menuController.resultsHandler.saveResult(name, menuController.currentPoints);
        },
        showScores: function () {
            var menuController =
               $(snakeConstants.gameMenuElementSelector).get(0).menuControllerPointer;
            var scoresElementSelector = "#showScores";
            menuController.updateScores(scoresElementSelector);

            $(scoresElementSelector).show();
        },
        updateScores: function (scoresSelector) {
            var currResults = this.resultsHandler.getResults();
            var hiscoresTable = $(scoresSelector);
            var backButtonRow = hiscoresTable.find("tr#backButton");
            hiscoresTable.find('tr').each(function () {
                if (this != backButtonRow.get(0) && this!= hiscoresTable.find('tr').get(0)) {
                    $(this).remove();
                }
            })

            for (var i = 0; i < 10; i++) {
                if (currResults[i]) {
                    var name = currResults[i].name;
                    var points = currResults[i].countEaten;
                    var timePlayed = currResults[i].timePlayed;
                }
                else{
                    name = "Anonymous";
                    points = 1;
                    timePlayed = 100;
                }

                hiscoresTable.find('table').append($("<tr><td>" + name + "<\/td><td>" +
                points + "<\/td><td>" + timePlayed + "</td><\/tr"));                
            }

            hiscoresTable.find('table').append(backButtonRow);
        }
           
        
    });

    return {
        MenuController: MenuController
    }
})(jQuery);
// RESTE A FAIRE : 
// PERDU SI LE SNAKE SE TOUCHE LUI MEME
// APPARITION DES MEALS
// INTERFACE (COUNTER, DIFFICULTE, TAILLE GRID, DESIGN)

var launchGameButton = document.getElementById("launchGameButton");

launchGameButton.addEventListener("click", function () {
    game.init()
});


document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 37:
            if (!game.isGameRunning()) {
                game.runGame();
            }
            game.setDirection('LEFT');
            break;
        case 38:
            if (!game.isGameRunning()) {
                game.runGame();
            }
            game.setDirection('UP');
            break;
        case 39:
            if (!game.isGameRunning()) {
                game.runGame();
            }
            game.setDirection('RIGHT');
            break;
        case 40:
            if (!game.isGameRunning()) {
                game.runGame();
            }
            game.setDirection('DOWN');
            break;
    }
});

var game = function () {
    var hasStarted = false,
        mealsNumber = 0,
        snakePositions = [],
        direction = "UP",
        moveFunctionInterval,
        scoreAmountElement = document.getElementById("score-amount"),
        currentMealPosition,
        shouldIncreaseSnakeSize = false,

        init = function () {
            if (hasStarted) {
                stopGame();
            } else {
                runGame();
            }
        }

    runGame = function () {
            hasStarted = true;
            launchGameButton.innerHTML = "STOP !"

            snakePositions.push("44"); // center square id

            generateNewMeal();
            move();
            moveFunctionInterval = setInterval(() => move(), 400);
        },

        move = function () {
            var headRowIndex = snakePositions[0][0];
            var headColumnIndex = snakePositions[0][1];
            headRowIndex = parseInt(headRowIndex);
            headColumnIndex = parseInt(headColumnIndex);
            shouldUpdate = true;
            switch (direction) {
                case "UP":
                    if (headRowIndex === 0) {
                        looseGame();
                        shouldUpdate = false;
                        break;
                    }
                    headRowIndex = (headRowIndex - 1).toString();
                    snakePositions.unshift(headRowIndex + headColumnIndex);
                    break;
                case "DOWN":
                    if (headRowIndex === 9) {
                        looseGame();
                        shouldUpdate = false;
                        break;
                    }
                    headRowIndex = (headRowIndex + 1).toString();
                    snakePositions.unshift(headRowIndex + headColumnIndex);
                    break;
                case "RIGHT":
                    if (headColumnIndex === 9) {
                        looseGame();
                        shouldUpdate = false;
                        break;
                    }
                    headColumnIndex = (headColumnIndex + 1).toString();
                    snakePositions.unshift(headRowIndex + headColumnIndex);
                    break;
                case "LEFT":
                    if (headColumnIndex === 0) {
                        looseGame();
                        shouldUpdate = false;
                        break;
                    }
                    headColumnIndex = (headColumnIndex - 1).toString();
                    snakePositions.unshift(headRowIndex + headColumnIndex);
                    break;
                default:
                    break;
            }

            if (shouldUpdate) {
                checkMealsEaten();
                increaseSnakeSize();
                checkSnakeSelfTouch();
                updateGridSnakePosition();
            }
        },

        generateNewMeal = function () {
            currentMealPosition = parseInt(Math.random() * 100).toString();
            if (currentMealPosition.length == 1) {
                currentMealPosition = "0" + currentMealPosition;
            }
            while (snakePositions.indexOf(currentMealPosition) !== -1) {
                generateNewMeal();
            }

            var element = document.getElementById(currentMealPosition);

            if (element == null) {
                console.warn(currentMealPosition);
            }

            element.classList.add("meal")
        },

        checkMealsEaten = function () {
            if (snakePositions[0] === currentMealPosition) {
                mealsNumber++;
                document.getElementById(currentMealPosition).classList.remove("meal");
                generateNewMeal();
                if ((mealsNumber % 3) === 0) {
                    shouldIncreaseSnakeSize=true;
                }
            }

            scoreAmountElement.style.fontSize = "24px";
            scoreAmountElement.innerHTML = mealsNumber;
        },

        increaseSnakeSize = function () {
            // increase snake's size every 3 meals
            if (shouldIncreaseSnakeSize) {
                shouldIncreaseSnakeSize = false;
            } else if (snakePositions.length > 3) {
                var elementRemoved = snakePositions.pop();
                document.getElementById(elementRemoved).classList.remove("fulfilled");
            }
        },

        updateGridSnakePosition = function () {
            for (var position of snakePositions) {
                document.getElementById(position).classList.add("fulfilled");
            }
        },

        checkSnakeSelfTouch = function () {
            var headPosition = snakePositions.shift();

            if (snakePositions.indexOf(headPosition) !== -1) {
                looseGame();
            }

            snakePositions.unshift(headPosition);
        },

        stopGame = function () {
            clearInterval(moveFunctionInterval);
            resetPositions();
            hasStarted = false;
            currentMealPosition = null;
            snakePositions = [];
            mealsNumber = 0;
            direction = "UP";
            launchGameButton.innerHTML = "JOUER !"
        },

        looseGame = function () {
            stopGame();
        },

        resetPositions = function () {
            for (var position of snakePositions) {
                document.getElementById(position).classList.remove("fulfilled");
            }

            document.getElementById(currentMealPosition).classList.remove("meal");
        },

        isGameRunning = function() {
            return hasStarted;
        }

        setDirection = function (newDirection) {
            direction = newDirection;
        };

    return {
        init: init,
        isGameRunning: isGameRunning,
        setDirection: setDirection,
        runGame: runGame
    }
}();
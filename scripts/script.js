"use strict";

let oGameData = {};

initGlobalObject();
prepGame();
/*
  Initerar det globala objektet med de attribut som ni skall använda er av.
 */
function initGlobalObject() {

    oGameData.gameField = ['', '', '', '', '', '', '', '', ''];

    //Indikerar tecknet som skall användas för spelare ett.
    oGameData.playerOne = "X";

    //Indikerar tecknet som skall användas för spelare två.
    oGameData.playerTwo = "O";

    //Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
    oGameData.currentPlayer = "";

    //Nickname för spelare ett som tilldelas från ett formulärelement,
    oGameData.nickNamePlayerOne = "";

    //Nickname för spelare två som tilldelas från ett formulärelement.
    oGameData.nickNamePlayerTwo = "";

    //Färg för spelare ett som tilldelas från ett formulärelement.
    oGameData.colorPlayerOne = "";

    //Färg för spelare två som tilldelas från ett formulärelement.
    oGameData.colorPlayerTwo = "";

    //Antalet sekunder för timerfunktionen
    oGameData.seconds = 5;

    //Timerns ID
    oGameData.timerId = null;

    //Från start är timern inaktiverad
    oGameData.timerEnabled = false;

    //Referens till element för felmeddelanden
    oGameData.timeRef = document.querySelector("#errorMsg");
}




function startGame() {

}

function prepGame() {
    // Göm spelplanen
    document.querySelector(`#gameArea`).classList.add(`d-none`);
    // lägga en lyssnare på "Starta spelet!"-knappen. klick anropar funktionen "initiateGame() först efter att "validateForm()" returnerat true
    document.querySelector(`#newGame`).addEventListener(`click`, () => {
        if (validateForm()) {
            initiateGame()
        }
    });
}

function validateForm() {
    const playerOneName = document.querySelector(`#nick1`)
    const playerOneColor = document.querySelector(`#color1`)
    const playerTwoName = document.querySelector(`#nick2`)
    const playerTwoColor = document.querySelector(`#color2`)

    // Användarnamnet måste vara mellan 3 och 10 tecken långt.
    try {


        if (playerOneName.value.length < 3 || playerOneName.value.length > 10) {
            throw {
                node: playerOneName,
                msg: `Användarnamnet måste vara mellan 3 och 10 tecken långt.`
            }
        } else if (playerTwoName.value.length < 3 || playerTwoName.value.length > 10) {
            throw {
                node: playerTwoName,
                msg: `Användarnamnet måste vara mellan 3 och 10 tecken långt.`
            }
        } else {
            // Den valda färgen får inte vara svart eller vit.

            if (playerOneColor.value === `#ffffff` || playerOneColor.value === `#000000`) {
                throw {
                    node: playerOneColor,
                    msg: `Den valda färgen får inte vara svart eller vit.`
                }
            } else if (playerTwoColor.value === `#ffffff` || playerTwoColor.value === `#000000`) {
                throw {
                    node: playerTwoColor,
                    msg: `Den valda färgen får inte vara svart eller vit.`
                }
            } else {
                return true;
            }
        }

    } catch (error) {
        error.node.value = ``;
        error.node.focus();
        document.querySelector(`#errorMsg`).textContent = error.msg;
    }


    // Lägg gärna till egna saker att kolla efter också.

}

function initiateGame() {

    const gameAreaRef = document.querySelector(`#gameArea`);
    // Göm formuläret
    document.querySelector(`#theForm`).classList.add(`d-none`);
    // Visa spelplanen
    gameAreaRef.classList.remove(`d-none`);
    // Ta bort textInnehållet
    document.querySelector(`#errorMsg`).textContent = ``;
    // Spara information om spelare ett 
    oGameData.nickNamePlayerOne = document.querySelector(`#nick1`).value;
    oGameData.colorPlayerOne = document.querySelector(`#color1`).value;
    // Spara information om spelare två
    oGameData.nickNamePlayerTwo = document.querySelector(`#nick2`).value;
    oGameData.colorPlayerTwo = document.querySelector(`#color2`).value;
    // Töm spelplanen
    gameAreaRef.querySelectorAll(`TD`).forEach(box => { box.textContent = ``; box.style.backgroundColor = `white` });
    // lokala variablerna 
    let playerChar = ``;
    let playerName = ``;
    // Slumpa vilken spelare som börjar 
    let randomNum = Math.random();
    if (randomNum < .5) {
        playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
        oGameData.currentPlayer = oGameData.playerOne;
    } else if (randomNum >= .5) {
        playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
        oGameData.currentPlayer = oGameData.playerTwo;
    }

    // Ändra texten i h1-elementet till aktuell spelare
    document.querySelector(`.jumbotron h1`).textContent = `Aktuell spelare är  ${playerName}. ${playerChar}`;

    // Lägg till en klicklyssnare på spelplanen. Vid klick skall funktionen "executeMove()" anropas.
    gameAreaRef.addEventListener(`click`, executeMove);
    // });

}

function executeMove(event) {
    const clickedBox = event.target;
    // Kontrollera att den klickade cellen är ledig.
    if (clickedBox.textContent === ``) {
        // Hämta ut attributet "data-id" från den klickade cellen,
        const boxId = clickedBox.getAttribute(`data-id`)
        // sätta "oGameData.gameField" på den hämtade positionen till nuvarande spelare
        oGameData.gameField[boxId] = oGameData.currentPlayer
        // Anropa funktionen "changePlayer()"
        changePlayer(clickedBox)
        // Anropa er rättningsfunktion
        const returnedNmbr = checkForGameOver()

        if (returnedNmbr !== 0) {
            gameOver(returnedNmbr)
        }

    }
}

function changePlayer(clickedBox) {
    let changePlayerMsg = ``;
    // Kontrollera vem som är nuvarande spelare, och utifrån det sätt bakgrundsfärgen
    if (oGameData.currentPlayer === oGameData.playerOne) {
        clickedBox.style.backgroundColor = oGameData.colorPlayerOne
        clickedBox.textContent = oGameData.playerOne
        oGameData.currentPlayer = oGameData.playerTwo
        changePlayerMsg = `${oGameData.nickNamePlayerTwo}, ${oGameData.playerTwo}`
    } else {
        clickedBox.style.backgroundColor = oGameData.colorPlayerTwo
        clickedBox.textContent = oGameData.playerTwo
        oGameData.currentPlayer = oGameData.playerOne
        changePlayerMsg = `${oGameData.nickNamePlayerOne}, ${oGameData.playerOne}`
    }

    document.querySelector(`.jumbotron h1`).textContent = `Aktuell spelare är ${changePlayerMsg}`
}

function checkWinner(playerIn) {
    let winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    return winningCombos.some(combo =>
        combo.every(position => oGameData.gameField[position] === playerIn));
}


//Kontrollera om alla platser i oGameData.GameField är fyllda. Om sant returnera true, annars false.
function checkForDraw() {
    return oGameData.gameField.every(position => position !== ``);
}

function checkForGameOver() {
    //Kontrollerar om "X" vunnit genom att köra rättningsfunktionerna, om så är fallet returneras 1
    if (checkWinner(`X`)) {
        return 1;
    }
    //Kontrollerar om "O" vunnit genom att köra rättningsfunktionerna, om så är fallet returneras 2
    if (checkWinner(`O`)) {
        return 2;
    }
    //Kontrollerar om spelet är oavgjort, returnerar isåfall 3
    if (checkForDraw()) {
        return 3;
    }
    //Annars returneras 0, och spelet fortlöper
    else {
        return 0;
    }
}

function gameOver(nmbr) {

    const gameAreaRef = document.querySelector(`#gameArea`);
    let gameOverMsg = ``;
    gameAreaRef.removeEventListener(`click`, executeMove);

    document.querySelector(`#theForm`).classList.remove(`d-none`);
    document.querySelector(`#gameArea`).classList.add(`d-none`);

    if (nmbr === 1) {
        gameOverMsg = `Grattis ${oGameData.nickNamePlayerOne}, du har vunnit!`
    } else if (nmbr === 2) {
        gameOverMsg = `Grattis ${oGameData.nickNamePlayerTwo}, du har vunnit!`

    } else if (nmbr === 3) {
        gameOverMsg = `Spelet slutade oavgjort`
    }
    document.querySelector(`.jumbotron h1`).innerHTML = `${gameOverMsg} <br> Spela igen?`;
    initGlobalObject()
}


function timer() {

}

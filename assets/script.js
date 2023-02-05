import Games from "./../Classes/Game.js";
import Persons from "./../Classes/Person.js";
import LinkedList from "./../DS/LinkedList.js";

const gamesName = document.querySelector(".games");
const addGames = document.querySelector(".addGame");
const fade = document.querySelector("#addGame");
const form = document.querySelector(`#addGameForm`);
const addBtn = document.querySelector(".add");
const closeBtn = document.querySelector("#closeAddGameForm");
const gameInp = document.querySelector("#gameInp");
const priceInp = document.querySelector("#priceInp");
const maxInp = document.querySelector("#maxInp");
const minInp = document.querySelector("#minInp");
const timeInp = document.querySelector("#timeInp");
const isEnableInp = document.querySelector("#isEnableInp");
const errors = document.querySelector(".errors");
const showLog = document.querySelector("#showLog");
const displays = document.querySelector(".displays");
const mainTimerDiv = document.querySelector(".mainTimer");
const saleTicketBtn = document.querySelector("#saleTicket");
const buyTicket = document.querySelector("#buyTicket");
const closeBuyTicket = document.querySelector("#closeBuyTicket");
const gamesBuyInput = document.querySelector("#gamesBuyInput");
const addTicket = document.querySelector("#addTicket");
const findPersonNC = document.querySelector("#findPersonNC");
const buyTicketNC = document.querySelector("#buyTicketNC");
const secondDisplay = document.querySelector("#secondDisplay");
const secondDisplayClose = document.querySelector("#secondDisplayClose");
const secondDisplayTitle = document.querySelector("#secondDisplayTitle");
const secondDisplayLogsDiv = document.querySelector("#secondDisplayLogsDiv");
const mainDisplay = document.querySelector("#mainDisplay");
const findedMainDiv = document.querySelector("#findedDivMain");
const findedBuyTicketDiv = document.querySelector("#findedBuyTicketDiv");
let Mode = "";
let GameToEdit = "";
const games = new Games();
const persons = new Persons();
let time = 0;
let secondDisplayLogs;
let tempShowLog;
let tempShowLogName;


const mainTimer = setInterval(() => {
    games.gamesProcess(time);
    changeMainDisplayData(games.buyTicketLogs.strFinishedLogs);
    if (secondDisplayLogs) {
        changeSecondDisplayData(secondDisplayLogs.showLogs)
    }
    let sec = time % 60;
    let min = Math.floor(time / 60);
    sec = sec < 10 ? `0${sec}` : sec
    min = min < 10 ? `0${min}` : min
    mainTimerDiv.textContent = `${min} : ${sec}`;
    time += 1;
}, 1000);


renderGames();


function renderGames() {
    gamesName.innerHTML = "";
    gamesBuyInput.innerHTML = "";
    let flagIsAddTicket = false;
    games.forEach((key, item) => {
        const gameBtn = makeGameBtn(item);
        gamesName.appendChild(gameBtn);
        const gameBuyInp = makeGameBuyInp(item);
        gamesBuyInput.appendChild(gameBuyInp);
        if (item.isEnable) flagIsAddTicket = true;
    });
    addTicket.disabled = !flagIsAddTicket;
}


// events
addGames.addEventListener("click", ev => {
    fade.classList.remove("hidden");
    showLog.classList.add("hidden");
    Mode = "add";
});
addBtn.addEventListener("click", ev => {
    if (Mode === "add") {
        const err = games.addGame(gameInp.value, priceInp.value, minInp.value, maxInp.value, timeInp.value, isEnableInp.checked);
        if (err) {
            errors.innerHTML = err;
            errors.classList.remove("hidden");
        } else {
            errors.classList.add("hidden");
            fade.classList.add("hidden");

            renderGames();
            resetForm();
        }
    } else if (Mode === "edit") {
        showLog.classList.add("hidden");
        const err = games.editGame(gameInp.value, priceInp.value, minInp.value, maxInp.value, timeInp.value, isEnableInp.checked, GameToEdit);
        if (err) {
            errors.innerHTML = err;
            errors.classList.remove("hidden");
        } else {
            errors.classList.add("hidden");
            fade.classList.add("hidden");
            renderGames();
            resetForm();
        }
    }
});
showLog.addEventListener("click", ev => {
    showSecondDisplay(tempShowLogName, tempShowLog)
});
saleTicketBtn.addEventListener("click", ev => {
    buyTicket.classList.remove("hidden");
});
closeBtn.addEventListener("click", ev => {
    fade.classList.add("hidden");
    resetForm();
});
secondDisplayClose.addEventListener("click", ev => {
    hiddenSecondDisplay()
})


findPersonNC.addEventListener("keyup", ev => {
    if (ev.target.value) {
        const listOfCode = persons.search(ev.target.value);
        findedMainDiv.innerHTML = "";
        if (listOfCode) {
            if (listOfCode.size > 0) {
                findedMainDiv.classList.remove("hidden");
            } else {
                findedMainDiv.classList.add("hidden");
            }
        } else {
            findedMainDiv.classList.add("hidden");
        }
        listOfCode?.forEach(code => {
            findedMainDiv.appendChild(makeFindedBtn(code, ev =>{
                showSecondDisplay(code, persons.findPerson(Number(code)));
            }));
        });
    } else {
        findedMainDiv.classList.add("hidden");
    }
});

buyTicketNC.addEventListener("keyup", ev => {
    if (ev.target.value) {
        const listOfCode = persons.search(ev.target.value);
        findedBuyTicketDiv.innerHTML = "";
        if (listOfCode) {
            if (listOfCode.size > 0) {
                findedBuyTicketDiv.classList.remove("hidden");
            } else {
                findedBuyTicketDiv.classList.add("hidden");
            }
        } else {
            findedBuyTicketDiv.classList.add("hidden");
        }
        listOfCode?.forEach(code => {
            findedBuyTicketDiv.appendChild(makeFindedBtn(code, ev =>{
                buyTicketNC.value = code;
                findedBuyTicketDiv.classList.add("hidden");
            }));
        });
    } else {
        findedBuyTicketDiv.classList.add("hidden");
    }
});


// costume node (use nodeForEach )
class InpNode {
    constructor(game, number) {
        this.game = game;
        this.number = number;
    }
}

addTicket.addEventListener("click", ev => {
    const tempList = new LinkedList(InpNode);
    let isAllOk = true;
    let code = buyTicketNC.value;
    let numCode = Number(code);
    games.forEach((key, game) => {
        let value = game.inp.value;
        value = Number(value);
        if (isNaN(value)) {
            isAllOk = false;
        }
        tempList.add_last(game, value);
    });
    if (code.length === 10 && !isNaN(numCode) && isAllOk) {
        games.buyTicketLogs.addLogObj(persons.buyTicket(tempList, numCode, time));
        resetFormBuyTicket()
    }

});
closeBuyTicket.addEventListener("click", ev => {
    buyTicket.classList.add("hidden");
    resetFormBuyTicket();
})


// Component
function makeGameBuyInp(item) {
    const divInp = document.createElement("div");
    divInp.classList.add("flex-row");
    const labelInp = document.createElement("label");
    labelInp.textContent = `${item.name}: `;
    divInp.appendChild(labelInp);
    divInp.appendChild(item.inp);
    return divInp;
}

function makeGameBtn(item) {
    const gameBtn = document.createElement("button");
    gameBtn.classList.add("btn");
    gameBtn.textContent = item.name;
    gameBtn.addEventListener("click", ev => {
        tempShowLog = item.logs;
        tempShowLogName = item.name;
        fade.classList.remove("hidden");
        addBtn.textContent = "Edit";
        Mode = "edit";
        GameToEdit = item.name;
        gameInp.value = item.name;
        priceInp.value = item.price;
        maxInp.value = item.max;
        minInp.value = item.min;
        timeInp.value = item.time;
        isEnableInp.checked = item.isEnable;
    });
    return gameBtn
}

function changeMainDisplayData(data) {
    mainDisplay.innerHTML = data;
}

function changeSecondDisplayData(data) {
    secondDisplayLogsDiv.innerHTML = data;
}

function showSecondDisplay(title, obj) {
    displays.classList.remove("hidden");
    secondDisplayTitle.textContent = title;
    changeSecondDisplayData(obj.showLogs);
    secondDisplayLogs = obj;

}

function makeFindedBtn(code, listener) {
    const btn = document.createElement("button");
    btn.textContent = code;
    btn.classList.add("btn");
    btn.addEventListener("click", listener);
    return btn
}

function hiddenSecondDisplay() {
    displays.classList.add("hidden");
    secondDisplayLogsDiv.innerHTML = "";
    secondDisplayTitle.textContent = "";
    secondDisplayLogs = undefined;
}


function resetForm() {
    addBtn.textContent = "Add";
    errors.innerHTML = "";
    errors.classList.add("hidden");
    showLog.classList.remove("hidden");
    displays.classList.add("hidden");
    gameInp.value = "";
    priceInp.value = "";
    maxInp.value = "";
    minInp.value = "";
    timeInp.value = "";
    isEnableInp.checked = false;
    if (GameToEdit) {
        document.querySelector(`#display-${GameToEdit}`)?.classList.add("hidden");
        document.querySelector(`#btn-${GameToEdit}`)?.remove();
    }
    GameToEdit = "";
}

function resetFormBuyTicket() {
    buyTicketNC.value = "";
    findedBuyTicketDiv.classList.add("hidden");
    games.forEach((key, value) => {
        value.inp.value = "0";
    });
    buyTicket.classList.add("hidden");
}
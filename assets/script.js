import Games from "../Classes/Game.js";

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
const isEnableInp = document.querySelector("#isEnableInp");
const errors = document.querySelector(".errors");
const showLog = document.querySelector("#showLog");
const displays = document.querySelector(".displays");
const mainTimerDiv = document.querySelector(".mainTimer");
const saleTicketBtn = document.querySelector("#saleTicket");
const buyTicket = document.querySelector("#buyTicket");
const closeBuyTicket = document.querySelector("#closeBuyTicket");
const gamesBuyElement = document.querySelector("#gamesBuyElement");

let Mode = "";
let ID = -1;
const games = new Games();
let time = 0;
const mainTimer = setInterval(()=>{
    let sec = time % 60;
    let min = Math.floor(time / 60);
    sec = sec < 10 ? `0${sec}` : sec
    min = min < 10 ? `0${min}` : min
    mainTimerDiv.textContent = `${min} : ${sec}`;
    time += 1;
},1000);
renderGames();

function renderGames() {
    gamesName.innerHTML = "";
    gamesBuyElement.innerHTML = "";
    games.forEach((item) => {

        const gameBtn = document.createElement("button");
        gameBtn.classList.add("btn");
        gameBtn.textContent = item.name;
        gameBtn.addEventListener("click", ev => {
            const btn = document.createElement("button");
            btn.classList.add("btn");
            btn.textContent = "Show Logs";
            btn.addEventListener("click", ev => {
                console.log(displays);
                displays.classList.remove("hidden");
                document.querySelector(`#display-${item.id}`).classList.remove("hidden");
                const temp = document.createElement("p");
                temp.textContent = "logged";
                console.log(`display-${item.id}`);
                document.querySelector(`#display-${item.id} > .logs`).appendChild(temp);
            });
            btn.id = `btn-${item.id}`;
            form.firstChild.before(btn);
            fade.classList.remove("hidden");
            addBtn.textContent = "Edit";
            Mode = "edit";
            ID = item.id;
            gameInp.value = item.name;
            priceInp.value = item.price;
            maxInp.value = item.max;
            minInp.value = item.min;
            isEnableInp.checked = item.isEnable;
        });
        gamesName.appendChild(gameBtn);
    });
}

function resetForm() {
    addBtn.textContent = "Add";
    errors.innerHTML = "";
    errors.classList.add("hidden");
    showLog.classList.add("hidden");
    displays.classList.add("hidden");
    gameInp.value = "";
    priceInp.value = "";
    maxInp.value = "";
    minInp.value = "";
    isEnableInp.checked = false;
    if(ID !== -1) {
        console.log(document.querySelector(`#display-${ID}`));
        document.querySelector(`#display-${ID}`).classList.add("hidden");
        document.querySelector(`#btn-${ID}`).remove();
    }
    ID = -1;
}

function resetFormBuyTicket(){

}

addGames.addEventListener("click", ev => {
    fade.classList.remove("hidden");
    Mode = "add";
    renderGames();
});

addBtn.addEventListener("click", ev => {
    if (Mode === "add") {
        const [err, id] = games.addGame(gameInp.value, priceInp.value, minInp.value, maxInp.value, isEnableInp.checked);
        if (err) {
            errors.innerHTML = err;
            errors.classList.remove("hidden");
        } else {
            errors.classList.add("hidden");
            fade.classList.add("hidden");
            const h3 = document.createElement("h3");
            h3.textContent = gameInp.value;
            const closeDisplay = document.createElement("button");
            closeDisplay.textContent = "X";
            closeDisplay.classList.add("btn");
            closeDisplay.classList.add("closeDisplay");
            closeDisplay.addEventListener("click", () => {
                document.querySelector(`#display-${id}`).classList.add("hidden");
                displays.classList.add("hidden");
            });

            const nameAndClose = document.createElement("div");
            nameAndClose.classList.add("nameAndClose");
            nameAndClose.appendChild(h3);
            nameAndClose.appendChild(closeDisplay);
            const logs = document.createElement("div");
            logs.classList.add("logs");
            const display = document.createElement("div");
            display.classList.add("display");
            display.appendChild(nameAndClose);
            display.appendChild(logs);
            display.id = `display-${id}`;
            display.classList.add("display");
            display.classList.add("hidden");
            displays.appendChild(display);
            renderGames();
            resetForm();
        }
    } else if (Mode === "edit") {
        const err = games.editGame(gameInp.value, priceInp.value, minInp.value, maxInp.value, isEnableInp.checked, ID);
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
})
saleTicketBtn.addEventListener("click",ev => {
    buyTicket.classList.remove("hidden");
});

closeBtn.addEventListener("click", ev => {
    fade.classList.add("hidden");
    resetForm();
});

closeBuyTicket.addEventListener("click", ev => {
    buyTicket.classList.add("hidden");
})
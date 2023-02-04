import Games from "./../Classes/Game.js";

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

let Mode = "";
let GameToEdit = "";
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
    gamesBuyInput.innerHTML = "";
    let flagIsAddTicket = false;
    games.forEach((key, item) => {
        const gameBuyInp = makeGameBtn(item);
        gamesName.appendChild(gameBuyInp);
        const gameBtn = makeGameBuyInp(item);
        gamesBuyInput.appendChild(gameBtn);
        if (item.isEnable) flagIsAddTicket = true;
    });
    addTicket.disabled = !flagIsAddTicket;
}


addGames.addEventListener("click", ev => {
    fade.classList.remove("hidden");
    Mode = "add";
});


addBtn.addEventListener("click", ev => {
    if (Mode === "add") {
        const [err, game] = games.addGame(gameInp.value, priceInp.value, minInp.value, maxInp.value, timeInp.value, isEnableInp.checked);
        if (err) {
            errors.innerHTML = err;
            errors.classList.remove("hidden");
        } else {
            errors.classList.add("hidden");
            fade.classList.add("hidden");
            const display = makeDisplay(game.name)
            displays.appendChild(display);
            renderGames();
            resetForm();
        }
    } else if (Mode === "edit") {
        const err = games.editGame(gameInp.value, priceInp.value, minInp.value, maxInp.value,timeInp.value, isEnableInp.checked, GameToEdit);
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
    resetFormBuyTicket();
})


// Component
function makeGameBuyInp(item){
    const divInp = document.createElement("div");
    divInp.classList.add("flex-row");
    const labelInp = document.createElement("label");
    labelInp.textContent = `${item.name}: `;
    divInp.appendChild(labelInp);
    const inp = document.createElement("input");
    inp.classList.add("inp");
    inp.type = "number";
    inp.min = "0";
    inp.value = "0";
    inp.disabled = !item.isEnable;
    inp.id = `gameInp-${item.name}`;
    divInp.appendChild(inp);
    return divInp;
}


function makeGameBtn(item){
    const gameBtn = document.createElement("button");
    gameBtn.classList.add("btn");
    gameBtn.textContent = item.name;
    gameBtn.addEventListener("click", ev => {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.textContent = "Show Logs";
        btn.addEventListener("click", ev => {
            displays.classList.remove("hidden");
            document.querySelector(`#display-${item.name}`).classList.remove("hidden");
            const temp = document.createElement("p");
            temp.textContent = "logged";
            document.querySelector(`#display-${item.name} > .logs`).appendChild(temp);
        });
        btn.name = `btn-${item.name}`;
        form.firstChild.before(btn);
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


function makeDisplay(name){
    const h3 = document.createElement("h3");
    h3.textContent = gameInp.value;
    const closeDisplay = document.createElement("button");
    closeDisplay.textContent = "X";
    closeDisplay.classList.add("btn");
    closeDisplay.classList.add("closeDisplay");
    closeDisplay.addEventListener("click", () => {
        document.querySelector(`#display-${name}`).classList.add("hidden");
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
    display.id = `display-${name}`;
    display.classList.add("display");
    display.classList.add("hidden");
    return display;
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
    timeInp.value = "";
    isEnableInp.checked = false;
    if(GameToEdit) {
        document.querySelector(`#display-${GameToEdit}`)?.classList.add("hidden");
        document.querySelector(`#btn-${GameToEdit}`)?.remove();
    }
    GameToEdit = "";
}

function resetFormBuyTicket(){
    buyTicketNC.value = "";
    games.forEach((key, value) => {
       document.querySelector(`#gameInp-${key}`).value = "0";
    });

}
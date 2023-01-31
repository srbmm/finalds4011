import Games from "../Classes/Game.js";
const gamesName = document.querySelector(".games");
const addGames = document.querySelector(".addGame");
const fade = document.querySelector(".fade");
const addBtn = document.querySelector(".add");
const closeBtn = document.querySelector(".close");
const gameInp = document.querySelector("#gameInp");
const priceInp = document.querySelector("#priceInp");
const maxInp = document.querySelector("#maxInp");
const minInp = document.querySelector("#minInp");
const isEnableInp = document.querySelector("#isEnableInp");
const errors = document.querySelector(".errors");
// test list of btns
const games = new Games();
renderGames()

function renderGames() {
    gamesName.innerHTML = "";
    games.forEach((item)=>{
        const gameBtn = document.createElement("button");
        gameBtn.classList.add("btn");
        gameBtn.textContent = item.name;
        gameBtn.addEventListener("click", ev => {
            fade.classList.remove("hidden");
            gameInp.value = item.name;
            priceInp.value = item.price;
            maxInp.value = item.max;
            minInp.value = item.min;
            isEnableInp.checked = item.isEnable;
        });
        gamesName.appendChild(gameBtn);
    })
}

function resetForm() {
    addBtn.textContent = "Add";
    errors.innerHTML = "";
    errors.classList.add("hidden");
    gameInp.value = "";
    priceInp.value = "";
    maxInp.value = "";
    minInp.value = "";
    isEnableInp.checked = false;
}
addGames.addEventListener("click", ev => {
    fade.classList.remove("hidden");
    renderGames();
})
addBtn.addEventListener("click", ev => {
    const err = games.addGame(gameInp.value, priceInp.value, minInp.value, maxInp.value, isEnableInp.checked);
    if(err){
        errors.innerHTML = err;
        errors.classList.remove("hidden");
    }else {
        errors.classList.add("hidden");
        fade.classList.add("hidden");
        renderGames();
        resetForm();
    }
})
closeBtn.addEventListener("click", ev => {
    fade.classList.add("hidden");
    resetForm();
})
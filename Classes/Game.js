import DynamicHashtable from "./../DS/DynamicHashtable.js";
import LinkedList from "./../DS/LinkedList.js";
import {Logs} from "./Log.js";


class Game {
    #isEnable;
    constructor(name, price, min, max, time, isEnable) {
        this.name = name;
        this.price = price;
        this.min = min;
        this.max = max;
        this.time = time;
        this.#isEnable = isEnable;
        this.isPlay = false;
        this.personsInGame = new LinkedList();
        this.lastAddedAgo = 0;
        this.gameQueue = new LinkedList();
        this.priority = new LinkedList();
        this.logs = new Logs("game");
        this.inp = this.makeGameBuyInp(this.#isEnable);
    };

    set isEnable(value) {
        this.#isEnable = value;
        this.inp.disabled = !value;
    }
    get isEnable(){
        return this.#isEnable
    }
    makeGameBuyInp(isEnable){
        const inp = document.createElement("input");
        inp.classList.add("inp");
        inp.type = "number";
        inp.min = "0";
        inp.value = "0";
        inp.disabled = !isEnable;
        return inp;
    }

    // mode : notEnough , enough , full , play , notEnabled
    get mode() {
        let mode = ""
        if (this.isEnable) {
            if (!this.isPlay) {
                if (this.personsInGame.size >= this.min) {
                    if (this.personsInGame.size === this.max) {
                        mode = "full";
                    } else {
                        mode = "enough";
                    }
                } else {
                    mode = "notEnough"
                }
            } else {
                mode = "play";
            }
        } else {
            mode = "notEnabled";
        }
        return mode;

    }

    gameProcess(time) {
        this.logs.logProcess(time);
        this.lastAddedAgo += 1;
        if (this.mode !== "notEnabled") {
            if (this.mode === "play") {
                if (this.logs.logs?.last?.value !== `${this.name} started`) {
                    this.isPlay = false;
                    this.personsInGame.forEach(item => {
                        this.exitGame(item, time);
                    });
                    return this.logs.addLog(`${this.name} ended`, undefined, time, time);
                }
            } else {
                if (this.mode === "full") {
                    this.isPlay = true;
                    return this.logs.addLog(`${this.name} started`, undefined, time, time + this.time);
                } else {
                    if (this.mode === "enough" && this.lastAddedAgo > 30) {
                        this.isPlay = true;
                        return this.logs.addLog(`${this.name} started`, undefined, time, time + this.time);
                    }
                }
            }

        }
    }

    addToQueue(ticket, time) {
        let log;
        if (this.mode === "enough" || this.mode === "notEnough") {
            this.gameQueue.add_first(ticket);
            log = this.logs.addLog(`Come to ${this.name} queue`, ticket.person, time, time);
            this.lastAddedAgo = 0;
            this.addToGame(ticket, time);
        }
        return log;
    }

    addToGame(ticket, time) {
        if (ticket.number <= this.max - this.personsInGame.size) {
            this.personsInGame.add_first(ticket);
            return this.logs.addLog(`Come to ${this.name} game`, ticket.person, time, time + (ticket.number * 5));
        } else {
            this.priority.add_first(ticket);
        }
        return undefined;
    }

    exitGame(ticket, time) {
        return this.logs.addLog(`Exit from ${this.name} game`, ticket.person, time, time + (ticket.number * 5));
    }

}

class Games {
    #gameList;
    constructor() {
        this.#gameList = new DynamicHashtable();
        this.buyTicketLogs = new Logs("game")
    }

    #isSameName(name) {
        return this.#gameList.find(name)
    }

    #checkValue(name, price, min, max, time, edit) {
        let err = "";
        if (name && price && min && max && time) {
            price = Number(price);
            min = Number(min);
            time = Number(time);
            max = Number(max);
            if (!edit) if (this.#isSameName(name)) err += "<br>Error: In Same name.";
            if (isNaN(price)) err += "<br>Error: Price is not a number.";
            if (isNaN(min)) err += "<br>Error: Min is not a number.";
            if (isNaN(max)) err += "<br>Error: Max is not a number.";
            if (isNaN(time)) err += "<br>Error: Time is not a number.";
            if (price < 0) err += "<br>Error: Price cannot be negative.";
            if (min <= 0) err += "<br>Error: Min cannot be zero or negative.";
            if (max <= 0) err += "<br>Error: Max cannot be zero or negative.";
            if (time <= 0) err += "<br>Error: Time cannot be zero or negative.";
            if (max < min) err += "<br>Error: Min cannot be bigger than max.";
        } else {
            err = "Please enter all input values."
        }
        return err;
    }

    addGame(name, price, min, max, time, check) {
        const err = this.#checkValue(name, price, min, max, time)
        let game = undefined;
        if (!err) {
            game = new Game(name, price, min, max, time, check)
            this.#gameList.add(name, game);
        }
        return err
    }

    editGame(editedName, price, min, max, time, check, name) {
        const err = this.#checkValue(name, price, min, max, time, true);
        if (!err) {
            const game = this.#gameList.find(name);
            if (game) {
                game.name = name;
                game.price = price;
                game.min = min;
                game.max = max;
                game.time = time;
                game.isEnable = check;
                return "";
            }
        }
        return err;
    }

    gamesProcess(time){
        this.buyTicketLogs.logProcess(time);
        this.#gameList.forEach(function(name, game){
            game.gameProcess(time);
        });
    }
    forEach(func) {
        this.#gameList.forEach(func)
    }
}

export default Games;
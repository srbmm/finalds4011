import DynamicHashtable from "./../DS/DynamicHashtable.js";
import LinkedList from "./../DS/LinkedList.js";
import {Logs} from "./Log.js";


class Game {
    #isEnable;

    constructor(name, price, min, max, time, isEnable) {
        this.name = name;
        this.price = Number(price);
        this.min = Number(min);
        this.max = Number(max);
        this.time = Number(time);
        this.#isEnable = isEnable;
        this.isPlay = false;
        this.personsInGame = new LinkedList();
        this.lastAddedAgo = 0;
        this.chekedPerson = new LinkedList();
        this.allTickets = 0;
        this.gameQueue = new LinkedList();
        this.priority = new LinkedList();
        this.priorityForQueue = new LinkedList();
        this.logs = new Logs("game");
        this.inp = this.makeGameBuyInp(this.#isEnable);
    };


    set isEnable(value) {
        this.#isEnable = value;
        this.inp.disabled = !value;
    }

    get isEnable() {
        return this.#isEnable
    }

    makeGameBuyInp(isEnable) {
        const inp = document.createElement("input");
        inp.classList.add("inp");
        inp.type = "number";
        inp.min = "0";
        inp.value = "0";
        inp.disabled = !isEnable;
        return inp;
    }


    gameRound(time) {
        if (!this.isPlay) {
            if (this.max === this.allTickets || (this.allTickets >= this.min && this.lastAddedAgo > 30)) {
                this.isPlay = true;
                this.logs.addLog(`Start Of ${this.name}`, undefined, time, time, () => {
                })
                this.logs.addLog(`End Of ${this.name}`, undefined, time, time + this.time, () => {
                })
                this.personsInGame.forEach((item) => {
                    this.lastAddedAgo = 0;
                    const ticket = this.personsInGame.delete_first().value;
                    this.logs.addLog(` Exit `, ticket, time, time + (ticket.number * 5), () => {
                    })
                });
                this.logs.addLog(`End ${this.name}`, undefined, time, time, () => {
                    this.isPlay = false;
                    this.allTickets = 0;
                })
            }
        }
    }


    gameProcess(time) {
        const log = this.logs.logProcess(time);
        this.gameRound(time);
        this.addToGame(time);
        this.lastAddedAgo += 1;
        return log;
    }

    addToQueue(ticket, time) {
        if (ticket.checked) {
            this.chekedPerson.add_first(ticket);
        } else {
            this.gameQueue.add_first(ticket);
        }
        this.logs.addLog(`Come to queue`, ticket, time, time, () => {
        });
        this.lastAddedAgo = 0;
    }

    addToGame(time) {
        if ((this.allTickets < this.max) && !this.isPlay) {
            let flagNotAdded = true;
            if (this.chekedPerson.size) {
                const ticket = this.chekedPerson.delete_last().value;
                if (ticket.number <= this.max - this.personsInGame.size) {
                    flagNotAdded = true;
                    this.logs.addLog(`Come to game`, ticket, time, time + (ticket.number * 5), () => {
                    });
                    this.allTickets += ticket.number;
                } else {
                    this.priority.add_last(ticket);
                    this.logs.addLog(`Go to next Queue`, ticket, time, time, () => {
                    });
                }
            }
            if (this.priority.size && flagNotAdded) {
                if ((this.priority.last.value.number <= this.max - this.allTickets)) {
                    flagNotAdded = false;
                    const ticket = this.priority.delete_last().value;
                    this.allTickets += ticket.number;
                    this.logs.addLog(`Come to game`, ticket, time, time + (ticket.number * 5), () => {
                    });
                    this.personsInGame.add_first(ticket);
                }
            } else {
                if (flagNotAdded && this.gameQueue.size) {
                    const ticket = this.gameQueue.delete_last().value;
                    if (ticket.number <= this.max - this.personsInGame.size) {
                        this.logs.addLog(`Come to game`, ticket, time, time + (ticket.number * 5), () => {
                        });
                        this.allTickets += ticket.number;
                        this.personsInGame.add_first(ticket);
                    } else {
                        this.logs.addLog(`Go to next Queue`, ticket, time, time, () => {
                        });
                        this.priority.add_first(ticket);
                    }
                }
            }
        }
        return undefined;
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

    findGame(name) {
        return this.#gameList.find(name)
    }

    addLog(msg) {
        this.buyTicketLogs.strFinishedLogs += msg;
    }

    editGame(editedName, price, min, max, time, check, name) {
        const err = this.#checkValue(name, price, min, max, time, true);
        if (!err) {
            const game = this.#gameList.find(name);
            if (game) {
                game.name = name;
                game.price = Number(price);
                game.min = Number(min);
                game.max = Number(max);
                game.time = Number(time);
                game.isEnable = check;
                return "";
            }
        }
        return err;
    }

    gamesProcess(time) {
        this.buyTicketLogs.logProcess(time);
        let temp = "";
        this.#gameList.forEach(function (name, game) {
            const item = game.gameProcess(time)?.logStr
            if (item) {
                temp += (`<br>${item}`);
            }
        });
        this.addLog(temp)
    }

    forEach(func) {
        this.#gameList.forEach(func)
    }
}

export default Games;
import DynamicHashtable from "./../DS/DynamicHashtable.js";
import LinkedList from "./../DS/LinkedList.js";
class Game {
    constructor(name, price, min, max,time, isEnable) {
        this.name = name;
        this.price = price;
        this.min = min;
        this.max = max;
        this.time = time;
        this.isEnable = isEnable;
        this.isPlay = false;
        this.gameQueue = new LinkedList();
    };

    addToQueue(){
        lin
    }

}

class Games {
    #gameList;
    constructor() {
        this.counter = 0;
        this.#gameList = new DynamicHashtable();
    }

    #isSameName(name) {
       return this.#gameList.find(name)
    }

    #checkValue(name, price, min, max,time, edit) {
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
            game = new Game(name, price, min, max,time, check)
            this.#gameList.add(name, game);
        }
        return [err, game]
    }

    editGame(editedName, price, min, max, time, check, name) {
        const err = this.#checkValue(name, price, min, max, time,true);
        if (!err) {
            const game = this.#gameList.find(name);
            if(game){
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
    forEach(func) {
        this.#gameList.forEach(func)
    }
}

export default Games;
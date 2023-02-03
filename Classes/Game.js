import LinkedList from "./../DS/LinkedList.js";
class Game {
    constructor(name, price, min, max,time, isEnable,id) {
        this.name = name;
        this.price = price;
        this.min = min;
        this.max = max;
        this.time = time;
        this.isEnable = isEnable;
        this.id = id;
    };
}

class Games {
    #gameList;
    constructor() {
        this.counter = 0;
        this.#gameList = new LinkedList();
    }

    #isSameName(name) {
        let flag = false;
        this.#gameList.forEach(item => {
            if (name === item.name) flag = true;
        });
        return flag;
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
        let id;
        if (!err) {
            id = this.counter++;
            this.#gameList.add_last(new Game(name, price, min, max,time, check, id));
        }
        return [err, id]
    }

    editGame(name, price, min, max, time, check, id) {
        const err = this.#checkValue(name, price, min, max, time,true);
        if (!err) {
            this.#gameList.forEach(game => {
                if (id === game.id){
                    game.name = name;
                    game.price = price;
                    game.min = min;
                    game.max = max;
                    game.time = time;
                    game.isEnable = check;
                    return "";
                }
            });
        }
        return err;
    }
    forEach(func) {
        this.#gameList.forEach(func)
    }
}

export default Games;
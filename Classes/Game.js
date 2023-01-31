class Game{
    constructor(name, price, min, max, isEnable) {
        this.name = name;
        this.price = price;
        this.min = min;
        this.max = max;
        this.isEnable = isEnable;
    };
}
class Games{
    #gameList;
    constructor() {
        this.#gameList = []
    }
    #isSameName(name){
        let flag = false;
        this.#gameList.forEach(item => {
            if(name === item.name) flag = true;
        });
        return flag;
    }
    addGame(name, price, min, max, check){
        let err = "";
        if(name && price && min && max) {
            price = Number(price);
            min = Number(min);
            max = Number(max);
            if (this.#isSameName(name)) err += "<br>Error: In Same name.";
            if (isNaN(price)) err += "<br>Error: Price is not a number.";
            if (isNaN(min)) err += "<br>Error: Min is not a number.";
            if (isNaN(max)) err += "<br>Error: Max is not a number.";
            if (price < 0) err += "<br>Error: Price cannot be negative.";
            if (min <= 0) err += "<br>Error: Min cannot be zero or negative.";
            if (max <= 0) err += "<br>Error: Max cannot be zero or negative.";
            if (max < min) err += "<br>Error: Min cannot be bigger than max.";
        }else {
            err = "Please enter all input values."
        }
        if(!err)
            this.#gameList.push(new Game(name, price, min, max, check));
        return err
    }
    forEach(func){
        this.#gameList.forEach(func)
    }
    get size() { return this.#gameList.length; }
}
export default Games;
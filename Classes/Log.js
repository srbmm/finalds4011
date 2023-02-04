class Log{
    constructor(type,game, start, end) {
        this.type = type;
        this.start = start;
        this.game = game;
        this.end = end;
    }

    get time(){
        return this.end - this.start;
    }

    #toMin(time){
        return [Math.floor(time/60), time%60]
    }
    isEnd(time){
        return this.end < time
    }
    #toString(time){
        let [min, sec] = this.#toMin(time);
        min = min < 10 ? `0${min}` : `${min}`
        sec = sec < 10 ? `0${sec}` : `${sec}`
        return [min, sec]
    }
    get startStr(){
        return this.#toString(this.start)
    }
    get endStr(){
        if(this.end !== undefined) return this.#toString(this.end)
        return undefined
    }
    get timeStr(){
        return this.#toString(this.time)
    }
    get logStr(){
        return `${this.type} for ${this.game} --- start: ${this.startStr} time-expend: ${this.timeStr}`
    }
}
export default Log;
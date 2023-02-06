import LinkedList from "../DS/LinkedList.js";

class Logs {

    constructor() {
        this.logs = new LinkedList();
        this.strFinishedLogs = "";
        this.isRun = false;
    }

    startNewLog(log, time) {
        log.end = time + (log.end - log.start);
        log.start = time;
    }

    addLog(type, ticket, start, end ,doAfter) {
        const log = new Log(type, ticket, start, end, doAfter);
        this.logs.add_first(log);
        return log;
    }

    addLogObj(log) {
        this.logs.add_first(log);
    }

    get last(){
        if(this.logs.last){
            return this.logs.last.value
        }
    }

    logProcess(time) {
        if (!this.isRun) {
            if (this?.last) {
                this.startNewLog(this.logs.last.value, time);
                this.isRun = true;
            }
        }else {
            if (this.last?.isEnd(time)) {
                this.isRun = false;
                const item = this.logs.delete_last().value;
                const msg = `<br>${item.logStr}`;
                item.ticket?.person.addLog(msg);
                item.doAfter(log => {
                    if(log instanceof Log) this.logs.add_last(log)
                });
                this.strFinishedLogs += msg;
                return item;
            }
        }
    }

    get showLogs() {
        return this.strFinishedLogs
    }
}

class Log {
    constructor(type, ticket, start, end, doAfter) {
        this.type = type;
        this.start = start;
        this.ticket = ticket;
        this.end = end;
        this.doAfter = doAfter;
    }

    get time() {
        return this.end - this.start;
    }

    #toMin(time) {
        return [Math.floor(time / 60), time % 60]
    }

    isEnd(time) {
        return this.end <= time
    }

    #toString(time) {
        let [min, sec] = this.#toMin(time);
        min = min < 10 ? `0${min}` : `${min}`
        sec = sec < 10 ? `0${sec}` : `${sec}`
        return `${min}:${sec}`
    }

    get startStr() {
        return this.#toString(this.start)
    }

    get endStr() {
        if (this.end !== undefined) return this.#toString(this.end)
        return undefined
    }

    get timeStr() {
        return this.#toString(this.time)
    }

    get logStr() {
        return `${this.startStr} - ${this.endStr} # ${this.ticket? this.ticket.person.code:""}  ${this?.type}  ${this?.ticket?.game ? "for " + this.ticket?.game?.name : ""} ${this?.ticket?.number ? this?.ticket?.number + " ticket" : ""} --- time-expend: ${this.timeStr}`
    }

}

export {Logs, Log};
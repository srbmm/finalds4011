import LinkedList from './../DS/LinkedList.js';
import DynamicHashtable from './../DS/DynamicHashtable.js';
import Ticket from "./Ticket.js";
import Log from "./Log.js";

class Person {
    constructor(code) {
        this.code = code;
        this.tickets = new DynamicHashtable();
        this.logs = new LinkedList();
    }

    add_ticket(game, number, time) {
        const item = this.tickets.find(game.name);
        if (item) {
            item.number += number;
        }
        else{
            this.tickets.add(game.name, new Ticket(game, number));
        }
        const log = new Log("buy", game, time, (time + (number * 2) + 5));
        this.logs.add_last(log);
        return log;
    }

    useTicket(game, number, time) {
        let log = undefined;
        const item = this.tickets.find(game.name);
            if (item) {
                if (number <= item.number) {
                    item.number -= number;
                    log = new Log("used", game, time, time + game.time);
                    this.logs.add_last(log);
                }
            }
        return log;
    }
}

export default Person;
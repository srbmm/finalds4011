import LinkedList from './../DS/LinkedList.js';
import Ticket from "./Ticket.js";
import Log from "./Log.js";
class Person{
    constructor(code) {
     this.code = code;
     this.tickets = new LinkedList();
     this.logs = new LinkedList();
    }

    add_ticket(game, number, time) {
        let flagAdd = false;
        this.tickets.forEach(function(item){
            if (game.name === item.game.name){
                item.number += number;
                flagAdd = true;
            }
        })
        if (!flagAdd){
            this.tickets.add_last(new Ticket(game, number));
        }
        const log = new Log("buy", game, time,(time + (number*2) + 5));
        this.logs.add_last(log);
        return log;
    }

    useTicket(game, number, time) {
        let log = undefined;
        this.tickets.forEach(function(item){
           if (game.name === item.game.name){
               if(number <= item.number){
                   item.number -= number;
                   log = new Log("used", game, time, time + game.time);
                   this.logs.add_last(log);
               }
           }
        });

        return log;
    }
}

export default Person;
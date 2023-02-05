import {Tickets, Ticket} from "./Ticket.js";
import DynamicHashtable from "./../DS/DynamicHashtable.js";
import TrieTree from "./../DS/TrieTree.js";
import {Log} from "./Log.js";
class Persons {
    constructor() {
        this.persons = new DynamicHashtable();
        this.personsTree = new TrieTree();
    }

    findPerson(code) {
        let person = this.persons.find(code);
        if (!person) {
            this.personsTree.add(String(code));
            person = this.persons.add(code, new Person(code));
        }
        return person;
    }

    search(strCode){
        return this.personsTree.search(strCode);
    }

    // game & number for each number
    buyTicket(listOfTickets, code, time) {
        const person = this.findPerson(+code);
        return new Log(" 5s wait ", new Ticket(undefined, undefined, person),time, time + 5, (repeat)=>{
            listOfTickets.nodeForEach((item) => {
                const ticket = new Ticket(item.game, item.number, person);
                repeat(person.addTicket(ticket, time));
              });
        });


    }

    useTicket(person, game, number, time) {
        const ticket = new Ticket(person, game, number);
        return person.use(ticket, time);
    }
}

class Person {
    constructor(code) {
        this.code = code;
        this.tickets = new Tickets(this);
        this.logs = "";
    }
    addTicket(ticket, time) {
        return new Log("buy", ticket, time, (time + (ticket.number * 2)), (repeat) => {
            this.tickets.addTicket(ticket);
        });
    }
    addLog(msg){
        this.logs += msg;
    }
    get showLogs(){
        return this.logs
    }
    personProcess(time) {
        this.logs.logProcess(time);
    }

    useTicket(ticket, time) {
        let log = undefined;
        ticket = this.tickets.useTicket(ticket);
        if (ticket) {
            return this.logs.addLog("used", ticket, time, time);
        }
        return log;
    }
}

export default Persons;
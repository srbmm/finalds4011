import {Tickets, Ticket} from "./Ticket.js";
import DynamicHashtable from "./../DS/DynamicHashtable.js";
import TrieTree from "./../DS/TrieTree.js";
import {Log} from "./Log.js";
import CostumeLinkedList from "./../DS/CostumeNode.js";
class Persons {
    constructor() {
        this.persons = new DynamicHashtable();
        this.personsTree = new TrieTree();
        this.bestPerson = new CostumeLinkedList(10);
    }

    findPerson(code) {
        let person = this.persons.find(code);
        if (!person) {
            this.personsTree.add(String(code));
            person = this.persons.add(code, new Person(code));
        }
        return person;
    }
    justFind(code){
        return this.persons.find(code);

    }

    search(strCode){
        return this.personsTree.search(strCode);
    }

    // game & number for each number
    buyTicket(listOfTickets, code, time, checked) {
        const person = this.findPerson(+code);
        return new Log(" 5s wait ", new Ticket(undefined, undefined, person),time, time + 5, (repeat)=>{
            listOfTickets.nodeForEach((item) => {
                const ticket = new Ticket(item.game, item.number, person, checked);
                repeat(person.addTicket(ticket, time));
                if(!this.bestPerson.size){
                    this.bestPerson.add(person);
                }else if ((this.bestPerson.last?.value.prices < person.prices )){
                    this.bestPerson.add(person);
                }
            });
        });
    }

    useTicket(person, game, number, time) {
        const ticket = person.useTicket(game, number);
        if(ticket) {
            game.addToQueue(ticket, time)
            return true;
        }
        return false;
    }
}

class Person {
    constructor(code) {
        this.code = code;
        this.tickets = new Tickets(this);
        this.logs = "";
        this.prices = 0;
    }
    addTicket(ticket, time) {
        return new Log("buy", ticket, time, (time + (ticket.number * 2)), (repeat) => {
            this.tickets.addTicket(ticket);
            this.prices += ticket.number * ticket.game.price;
        });
    }
    addLog(msg){
        this.logs += msg;
    }
    get showLogs(){
        return this.logs
    }


    useTicket(game, number) {
         return this.tickets.useTicket(game,number);
    }
}

export default Persons;
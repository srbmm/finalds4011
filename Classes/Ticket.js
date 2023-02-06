import DynamicHashtable from "./../DS/DynamicHashtable.js";

class Tickets {
    constructor(person) {
        this.person = person;
        this.tickets = new DynamicHashtable();
    }

    addTicket(ticket) {
        let oldTicket = this.tickets.find(ticket.game.name);
        if (oldTicket) {
            oldTicket.number += ticket.number;
        } else {
            this.tickets.add(ticket.game.name, ticket);
        }
    }

    useTicket(game, number) {
        const item = this.tickets.find(game.name);
        if (item) {
            const temp = {...item}
            if (number <= item.number) {
                item.number -= number;
                temp.number = number;
                return temp;
            }
        }
        return undefined;
    }
}

class Ticket {
    constructor(game, number, person, checked) {
        this.game = game;
        this.number = number;
        this.person = person;
        this.isCheked = checked;
    }
}

export {Tickets, Ticket};
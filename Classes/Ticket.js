class Ticket {
    #isUse;
    constructor(game, number) {
        this.game = game;
        this.number = number;
        this.#isUse = false;
    }
}

export default Ticket;
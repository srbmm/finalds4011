import LinkedList from "./LinkedList.js";
class PriorityQueue{
    constructor(size) {
        this.size = size;
        this.data = new LinkedList();
        for(let i = 0; i < this.size; i++) {
            this.data.add_last(undefined);
        }
    }

    inQueue() {
         this.data.nodeForEach(item => {
             item.data
         });
    }

    deQueue() {

    }
}
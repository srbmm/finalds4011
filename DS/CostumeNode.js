import LinkedList from "./LinkedList.js";

class Node {
    constructor(value) {
        this.next = undefined;
        this.before = undefined;
        this.value = value;
    }
}

class CostumeLinkedList {
    constructor(max) {
        this.max = max;
        this.size = 0;
        this.first = undefined;
        this.last = undefined;
    }

    add(value) {
        const node = new Node(value);
        if (this.size === 0) {
            this.first = node;
            this.last = node;
        } else {
            if (this.max === this.size) {
                this.last = this.last.before;
                this.last.next = undefined;
                this.size -= 1;
            }
            if (node.value.prices > this.first.value.prices) {
                node.next = this.first;
                this.first.before = node;
                this.first = node
            } else {
                let head = this.first;
                let isAdded = false;
                while (head !== undefined) {
                    if (head.value.prices < node.value.prices) {
                        node.next = head;
                        node.before = head.before;
                        node.before.next = node;
                        head.before = node;
                        isAdded = true;
                        break
                    }
                    head = head.next
                }
                if (!isAdded) {
                    this.last.next = node;
                    node.before = this.last;
                    this.last = node;
                }
            }
        }
        this.size++;
    }

    forEach(func) {
        let head = this.first
        while (head !== undefined) {
            func(head.value)
            head = head.next
        }
    }
}

export default CostumeLinkedList;
import DynamicHashtable from './../DS/DynamicHashtable.js';
class Person{
    constructor(code, factors) {
     this.factors = DynamicHashtable();
     this.code = code;
    }
}
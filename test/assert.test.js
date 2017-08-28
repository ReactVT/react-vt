const nodeStore = require('../src/nodeStore.js');
const assert = require('../src/assert.js');

nodeStore.storage = {"address":{"root,0":{"state":{"rows":[["","",""],["","",""],["","",""]],"turn":"X","gameList":[{"winner":"X","id":0,"createdAt":"2017-06-30T18:19:38.581Z"},{"winner":"X","id":1,"createdAt":"2017-06-30T18:19:38.634Z"},{"winner":"O","id":2,"createdAt":"2017-06-30T18:20:06.597Z"},{"winner":"O","id":3,"createdAt":"2017-06-30T18:20:06.719Z"},{"winner":"O","id":4,"createdAt":"2017-06-30T18:20:07.773Z"},{"winner":"O","id":5,"createdAt":"2017-06-30T18:20:37.108Z"},{"winner":"O","id":6,"createdAt":"2017-07-26T03:20:33.932Z"}]},"props":{},"name":"App","index":0},"root,0,0":{"state":null,"props":{},"name":"div","index":0},"board":{"state":null,"props":{},"name":"div","index":1},"board,0":{"state":null,"props":{"row":0,"letters":["","",""],"handleClick":"function"},"name":"Row","index":0},"board,0,0":{"state":null,"props":{"row":0,"square":0,"letter":"","handleClick":"function"},"name":"Square","index":0},"board,0,1":{"state":null,"props":{"row":0,"square":1,"letter":"","handleClick":"function"},"name":"Square","index":1},"board,0,2":{"state":null,"props":{"row":0,"square":2,"letter":"","handleClick":"function"},"name":"Square","index":2},"board,1":{"state":null,"props":{"row":1,"letters":["","",""],"handleClick":"function"},"name":"Row","index":1},"board,1,0":{"state":null,"props":{"row":1,"square":0,"letter":"","handleClick":"function"},"name":"Square","index":3},"board,1,1":{"state":null,"props":{"row":1,"square":1,"letter":"","handleClick":"function"},"name":"Square","index":4},"board,1,2":{"state":null,"props":{"row":1,"square":2,"letter":"","handleClick":"function"},"name":"Square","index":5},"board,2":{"state":null,"props":{"row":2,"letters":["","",""],"handleClick":"function"},"name":"Row","index":2},"board,2,0":{"state":null,"props":{"row":2,"square":0,"letter":"","handleClick":"function"},"name":"Square","index":6},"board,2,1":{"state":null,"props":{"row":2,"square":1,"letter":"","handleClick":"function"},"name":"Square","index":7},"board,2,2":{"state":null,"props":{"row":2,"square":2,"letter":"","handleClick":"function"},"name":"Square","index":8},"reset":{"state":null,"props":{"onClick":"function"},"name":"button","index":0},"clear":{"state":null,"props":{"onClick":"function"},"name":"button","index":1},"gameList":{"state":{"text":"first button"},"props":{"gameList":[{"winner":"X","id":0,"createdAt":"2017-06-30T18:19:38.581Z"},{"winner":"X","id":1,"createdAt":"2017-06-30T18:19:38.634Z"},{"winner":"O","id":2,"createdAt":"2017-06-30T18:20:06.597Z"},{"winner":"O","id":3,"createdAt":"2017-06-30T18:20:06.719Z"},{"winner":"O","id":4,"createdAt":"2017-06-30T18:20:07.773Z"},{"winner":"O","id":5,"createdAt":"2017-06-30T18:20:37.108Z"},{"winner":"O","id":6,"createdAt":"2017-07-26T03:20:33.932Z"}]},"name":"GameList","index":0},"gameList,0":{"state":null,"props":{},"name":"button","index":2},"gameList,1":{"state":null,"props":{},"name":"h3","index":0},"gameList,2":{"state":null,"props":{},"name":"ul","index":0},"gameList,2,0":{"state":null,"props":{},"name":"li","index":0},"gameList,2,1":{"state":null,"props":{},"name":"li","index":1},"gameList,2,2":{"state":null,"props":{},"name":"li","index":2},"gameList,2,3":{"state":null,"props":{},"name":"li","index":3},"gameList,2,4":{"state":null,"props":{},"name":"li","index":4},"gameList,2,5":{"state":null,"props":{},"name":"li","index":5},"gameList,2,6":{"state":null,"props":{},"name":"li","index":6}},"id":{"root":["root",0],"board":["board"],"reset":["reset"],"clear":["clear"],"gameList":["gameList"]},"class":{"row":[["board",0],["board",1],["board",2]],"square":[["board",0,0],["board",0,1],["board",0,2],["board",1,0],["board",1,1],["board",1,2],["board",2,0],["board",2,1],["board",2,2]]},"node":{"App":{"address":[["root",0]],"state":[{"rows":[["","",""],["","",""],["","",""]],"turn":"X","gameList":[{"winner":"X","id":0,"createdAt":"2017-06-30T18:19:38.581Z"},{"winner":"X","id":1,"createdAt":"2017-06-30T18:19:38.634Z"},{"winner":"O","id":2,"createdAt":"2017-06-30T18:20:06.597Z"},{"winner":"O","id":3,"createdAt":"2017-06-30T18:20:06.719Z"},{"winner":"O","id":4,"createdAt":"2017-06-30T18:20:07.773Z"},{"winner":"O","id":5,"createdAt":"2017-06-30T18:20:37.108Z"},{"winner":"O","id":6,"createdAt":"2017-07-26T03:20:33.932Z"}]}],"props":[{}]},"Row":{"address":[["board",0],["board",1],["board",2]],"state":[null,null,null],"props":[{"row":0,"letters":["","",""],"handleClick":"function"},{"row":1,"letters":["","",""],"handleClick":"function"},{"row":2,"letters":["","",""],"handleClick":"function"}]},"Square":{"address":[["board",0,0],["board",0,1],["board",0,2],["board",1,0],["board",1,1],["board",1,2],["board",2,0],["board",2,1],["board",2,2]],"state":[null,null,null,null,null,null,null,null,null],"props":[{"row":0,"square":0,"letter":"","handleClick":"function"},{"row":0,"square":1,"letter":"","handleClick":"function"},{"row":0,"square":2,"letter":"","handleClick":"function"},{"row":1,"square":0,"letter":"","handleClick":"function"},{"row":1,"square":1,"letter":"","handleClick":"function"},{"row":1,"square":2,"letter":"","handleClick":"function"},{"row":2,"square":0,"letter":"","handleClick":"function"},{"row":2,"square":1,"letter":"","handleClick":"function"},{"row":2,"square":2,"letter":"","handleClick":"function"}]},"GameList":{"address":[["gameList"]],"state":[{"text":"first button"}],"props":[{"gameList":[{"winner":"X","id":0,"createdAt":"2017-06-30T18:19:38.581Z"},{"winner":"X","id":1,"createdAt":"2017-06-30T18:19:38.634Z"},{"winner":"O","id":2,"createdAt":"2017-06-30T18:20:06.597Z"},{"winner":"O","id":3,"createdAt":"2017-06-30T18:20:06.719Z"},{"winner":"O","id":4,"createdAt":"2017-06-30T18:20:07.773Z"},{"winner":"O","id":5,"createdAt":"2017-06-30T18:20:37.108Z"},{"winner":"O","id":6,"createdAt":"2017-07-26T03:20:33.932Z"}]}]}},"tag":{"div":[["root",0,0],["board"]],"button":[["reset"],["clear"],["gameList",0]],"h3":[["gameList",1]],"ul":[["gameList",2]],"li":[["gameList",2,0],["gameList",2,1],["gameList",2,2],["gameList",2,3],["gameList",2,4],["gameList",2,5],["gameList",2,6]]}}

const assertMock = {"assertID":1,"type":"equal","selector":"node","selectorName":"Square","selectorModifier":"","source":"props","property":"letter","modifier":"","value":"X","dataType":"string","compName":"Square","loc":[["board",0,0]],"passed":""}
const assertMock2 = {"assertID":2,"type":"equal","selector":"node","selectorName":"Square","selectorModifier":"","source":"props","property":"letter","modifier":"","value":"X","dataType":"string","compName":"Square","loc":[["board",0,1]],"passed":""}
const assertMock3 = {"assertID":3,"type":"equal","selector":"component","selectorName":"Square","selectorModifier":".length","source":"","property":"","modifier":"","value":"X","dataType":"string","compName":"","loc":[],"passed":""}
const assertMock4 = {"assertID":4,"type":"equal","selector":"component","selectorName":"Row","selectorModifier":".length","source":"","property":"","modifier":"","value":"X","dataType":"string","compName":"","loc":[],"passed":""}
const assertMock5 = {"assertID":5,"type":"equal","selector":"tag","selectorName":"button","selectorModifier":".length","source":"","property":"","modifier":"","value":"3","dataType":"number","compName":"","passed":true,"actual":3}
const assertMock6 = {"assertID":6,"type":"equal","selector":"tag","selectorName":"h3","selectorModifier":".length","source":"","property":"","modifier":"","value":"1","dataType":"number","compName":"","passed":true,"actual":1}
const assertMock7 = {"assertID":7,"type":"equal","selector":"class","selectorName":"row","selectorModifier":".length","source":"","property":"","modifier":"","value":"3","dataType":"number","compName":"","passed":true,"actual":3}
const assertMock8 = {"assertID":7,"type":"equal","selector":"class","selectorName":"square","selectorModifier":".length","source":"","property":"","modifier":"","value":"9","dataType":"number","compName":"","passed":true,"actual":9}

describe('getLocation', () => {
    it('should return the correct location of an assert with a selector of node', () => {
        expect(assert.getLocation(assertMock)).toEqual(
        {"index": 0, "name": "Square", "props":{"row":0,"letter":"","handleClick":"function", "square":0}, "state": null}
        )
    })
    it('selector of node with identical name, but different location should return a different address', () => {
        expect(assert.getLocation(assertMock2)).not.toEqual(
        {"index": 0, "name": "Square", "props":{"row":0,"letter":"","handleClick":"function", "square":0}, "state": null}
        )
    })
    it('should return the correct location of an assert with a selector of component', () => {
        expect(assert.getLocation(assertMock3)).toEqual(
        {"address":[["board",0,0],["board",0,1],["board",0,2],["board",1,0],["board",1,1],["board",1,2],["board",2,0],["board",2,1],["board",2,2]],"props":[{"handleClick":"function","letter":"","row":0,"square":0},{"handleClick":"function","letter":"","row":0,"square":1},{"handleClick":"function","letter":"","row":0,"square":2},{"handleClick":"function","letter":"","row":1,"square":0},{"handleClick":"function","letter":"","row":1,"square":1},{"handleClick":"function","letter":"","row":1,"square":2},{"handleClick":"function","letter":"","row":2,"square":0},{"handleClick":"function","letter":"","row":2,"square":1},{"handleClick":"function","letter":"","row":2,"square":2}],"state":[null,null,null,null,null,null,null,null,null]}
        )
    })
    it('selector of component with different selectorName should return a different address', () => {
        expect(assert.getLocation(assertMock4)).not.toEqual(
        {"address":[["board",0,0],["board",0,1],["board",0,2],["board",1,0],["board",1,1],["board",1,2],["board",2,0],["board",2,1],["board",2,2]],"props":[{"handleClick":"function","letter":"","row":0,"square":0},{"handleClick":"function","letter":"","row":0,"square":1},{"handleClick":"function","letter":"","row":0,"square":2},{"handleClick":"function","letter":"","row":1,"square":0},{"handleClick":"function","letter":"","row":1,"square":1},{"handleClick":"function","letter":"","row":1,"square":2},{"handleClick":"function","letter":"","row":2,"square":0},{"handleClick":"function","letter":"","row":2,"square":1},{"handleClick":"function","letter":"","row":2,"square":2}],"state":[null,null,null,null,null,null,null,null,null]}
        )
    })
})

describe('convertResult', () => {
    it('should return true if type is equal and dataToTest and value are equal', () => {
        expect(assert.convertResult('equal', 1, 1)).toEqual(true)
    })
    it('should return false if type is equal and dataToTest and value are not equal', () => {
        expect(assert.convertResult('equal', 1, 2)).not.toEqual(true)
    })
    it('should return true if type is greaterthan and dataToTest is greater than value', () => {
        expect(assert.convertResult('greaterthan', 2, 1)).toEqual(true)
    })
    it('should return false if type is greaterthan and dataToTest is not greater than value', () => {
        expect(assert.convertResult('greaterthan', 1, 2)).not.toEqual(true)
    })
    it('should return true if type is lessthan and dataToTest is less than value', () => {
        expect(assert.convertResult('lessthan', 1, 2)).toEqual(true)
    })
    it('should return false if type is lessthan and dataToTest is not less than value', () => {
        expect(assert.convertResult('lessthan', 2, 1)).not.toEqual(true)
    })
    it('should return true if type is notequal and dataToTest and value are not equal', () => {
        expect(assert.convertResult('notequal', 1, 2)).toEqual(true)
    })
    it('should return false if type is notequal and dataToTest and value are equal', () => {
        expect(assert.convertResult('notequal', 1, 1)).not.toEqual(true)
    })
})

describe('convertType', () => {
    it('should return true if current.dataType is boolean and current.value is true', () => {
        expect(assert.convertType({'dataType': 'boolean', 'value': true})).toEqual(true)
    })
    it('should return false if current.dataType is boolean and current.value is false', () => {
        expect(assert.convertType({'dataType': 'boolean', 'value': false})).toEqual(false)
    })
    it('should return the correct number if current.dataType is number', () => {
        expect(assert.convertType({'dataType': 'number', 'value': 1})).toEqual(1)
    })
    it('should return null if current.dataType is null', () => {
        expect(assert.convertType({'dataType': 'null'})).toEqual(null)
    })
    it('should return null if current.dataType is undefined', () => {
        expect(assert.convertType({'dataType': 'undefined'})).toEqual(undefined)
    })
    it('should return the correct string if current.dataType is string', () => {
        expect(assert.convertType({'dataType': 'string', 'value': 'hello world'})).toEqual('hello world')
    })
    it('should return "Data type block failed" if current.dataType is not specified', () => {
        expect(assert.convertType({'value': 'hello world'})).toEqual('Data type block failed')
    })
})

describe('componentTest', () => {
    it('should return the correct length of the selectorName"s length', () => {
        expect(assert.componentTest(assertMock3)).toEqual(9)
    })
    it('should return a different length if the selectorName"s and length is different', () => {
        expect(assert.componentTest(assertMock4)).not.toEqual(9)
    })
})

describe('modifierController', () => {
    it('should return the correct data length if modifier is ".length"', () => {
        expect(assert.modifierController('.length',{'length': 2})).toEqual(2)
    })
})

describe('nodeTest', () => {
    it('should return the correct data to test if source is props', () => {
        expect(assert.nodeTest(assertMock)).toEqual('')
    })
})

describe('tagTest', () => {
    it('should return the correct length when selector is tag and selectorModifier is ".length"', () => {
        expect(assert.tagTest(assertMock5)).toEqual(3)
    })
    it('should return a different length when selectorName is different, selector is tag and selectorModifier is ".length"', () => {
        expect(assert.tagTest(assertMock6)).not.toEqual(3)
    })
})

describe('classTest', () => {
    it('should return the correct length when selector is class and selectorModifier is ".length"', () => {
        expect(assert.classTest(assertMock7)).toEqual(3)
    })
    it('should return a different length length when selectorName is different, selector is class, and selectorModifier is ".length"', () => {
        expect(assert.classTest(assertMock8)).not.toEqual(3)
    })
})
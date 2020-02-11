const NodeCache = require( "node-cache" );
const myCache = new NodeCache();



const obj1 = {
    userId:"lajsfbou3280hdo2u38hr0",
    front:[1,3,4,5,1.53,4.521,12.45,231.51,13.42,20],
    left:[1,3,4,5,4.22,9.213,123.41,123.41,9.123,123],
    right:[1,3,4,5,6.234,9.123,1.231,1425.23123,31.23],
    createdAt: Date.now()
};
const obj2 = {
    userId:"lajsfbou3280hdo2u38hr0",
    front:[1,3,4,5,1.53,4.521,12.45,231.51,13.42,20],
    left:[1,3,4,5,4.22,9.213,123.41,123.41,9.123,123],
    right:[1,3,4,5,6.234,9.123,1.231,1425.23123,31.23],
    createdAt: Date.now()
};
const obj3 = {
    userId:"lajsfbou3280hdo2u38hr0",
    front:[1,3,4,5,1.53,4.521,12.45,231.51,13.42,20],
    left:[1,3,4,5,4.22,9.213,123.41,123.41,9.123,123],
    right:[1,3,4,5,6.234,9.123,1.231,1425.23123,31.23],
    createdAt: Date.now()
};

const arr = [obj1,obj2,obj3];
myCache.del('any');
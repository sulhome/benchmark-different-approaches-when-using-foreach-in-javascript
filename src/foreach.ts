import * as randomstring from 'randomstring';
import * as benchmark from 'benchmark';
import * as lodash from 'lodash';
import * as underscore from 'underscore';

const totalItems = +process.argv[2] || 10000;
var suite = new benchmark.Suite;

let dummyArray = [];
for (let i = 0; i < totalItems; i++) {
    dummyArray.push(randomstring.generate(20));
}

console.log(`Total items in the array: ${totalItems}`);

function es6Foreach(arr: string[]) {
    let itemPlaceholder;
    for (let item of arr) {
        itemPlaceholder = item;
    }
}

function tailForeachWithCallback(arr, callback, start = 0) {
    if (0 <= start && start < arr.length) {
        callback(arr[start], start, arr);
        return tailForeachWithCallback(arr, callback, start + 1);
    }
}

function tailForeach(arr, start = 0) {
    let itemPlaceholder;
    if (0 <= start && start < arr.length) {
        itemPlaceholder = arr[start];
        return tailForeach(arr, start + 1);
    }
}

function lodashForeach(arr) {
    let itemPlaceholder;
    lodash.forEach(dummyArray, function (item) {
        itemPlaceholder = item;
    });
}

function underscoreForEach(arr) {
    let itemPlaceholder;
    underscore.each(dummyArray, function (item) {
        itemPlaceholder = item;
    });
}



// benchmark test
suite.add('es6Foreach', () => {
    es6Foreach(dummyArray);
})
    .add('tailForeach', () =>  {
        tailForeach(dummyArray);
    })
    .add('tailForeachWithCallback', () =>  {
        let itemPlaceholder;
        tailForeachWithCallback(dummyArray, (arrItem, index, actualArray) => { itemPlaceholder = arrItem; });
    })
    .add('underscoreForEach', () => {
        underscoreForEach(dummyArray);
    })
    .add('lodashForEach', () => {
        lodashForeach(dummyArray);
    })    
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });
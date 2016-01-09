/**
* Created by Alex on 6/29/14.
*/


// comment
/*
block
comment
*/


console.log("hello world");

function turnOn () {
  toggleLight(1); // 1, HIGH, true
}

function turnOff () {
  toggleLight(0); // 0, LOW, false
}

function toggleLight (status) {
  digitalWrite(C6,status);
}

function knipperen () {
  toggleLight(1); // 1, HIGH, true
  var func = function () {toggleLight(0); console.log("OFF!");};
  setTimeout (func, 1000);
}



var a = 1;
var b = 2;
if (a == b) {console.log("yeee1");}
if (a != b) {console.log("yeee2");}
if (a > b) {console.log("yeee3");}
if (a >= b) {console.log("yee4e");}
if (a < b) {console.log("yeee5");}
if (a <= b) {console.log("yeee6");}
if (a < b || a > b) {console.log("y8eee");}
if (a <= b && a > b) {console.log("ye9ee");}

if (a == b) {
  // bla
}
else if (a > b) {
  //bla bla
}
else {

}

for (var i = 0; i < 10; i++) {
  console.log(i);
}

var j = 0;
var k = 0;
var l = 0;

while (j < 10) {
  j += 1; // == j = j + 1;
//  j -= 1; // == j = j - 1;
//  j *= 1; // == j = j * 1;
//  j /= 2; // == j = j / 2;
  k = k + 1;
  l++;
}

var banana = 'banana';
console.log(banana.length);
var tree = 'tree';
var bananaTree = banana + tree;
console.log(bananaTree);

var myArray = [1,2,3];
console.log(myArray);
myArray.push([1,2,4]);
console.log(myArray);

myArray[3].push('231')
console.log(myArray);

for (var i = 0; i < myArray.length; i++) {
  console.log(myArray[i]);
}


var jsonObject = {};
jsonObject['a'] = 2;
console.log(jsonObject);

var jsonObject2 = {a: 2, b: 3, c:'1234', d:[],e: {}};
console.log(jsonObject2);

var idIndex = "a";
console.log(jsonObject[idIndex]);

var worldObj = {ocean: {fish:54, monkeys:5}, land: {trees:3,bananans:5}};
console.log(worldObj.ocean);

for (var index in worldObj) {
  if (worldObj.hasOwnProperty(index)) {
    console.log(index, worldObj[index]);
  }
}

















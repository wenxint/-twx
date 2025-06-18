let arr = [1, 2, 3, 4, 5];
let newArr = [];
let size = 2;
for (let i = 0; i < arr.length; i += size) {
  console.log(arr.slice(i, i + size));
  newArr.push(arr.slice(i, i + size));
}
console.log(newArr);
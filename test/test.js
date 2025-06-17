const target = {
  name: '目标对象',
  getName() {
    return this.name; // this指向会动态变化
  }
};

const proxy = new Proxy(target, {});
console.log(target,'target');
console.log(target.name,'target.name');
console.log(proxy,'proxy');
console.log(proxy.name,'proxy.name');


console.log(target.getName()); // '目标对象'（this指向target）
console.log(proxy.getName());  // undefined（this指向proxy，而proxy没有name属性）
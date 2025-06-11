/**
 * 链表节点类
 * @class Node
 */
class Node {
  /**
   * 链表节点类
   * @class Node
   */
  /**
   * 创建链表节点
   * @param {any} data - 节点存储的数据
   */
  constructor(data) {
    this.data = data; // 存储当前节点的数据
    this.next = null; // 指向下一个节点的引用，初始为null
  }
}

/**
 * 单向链表类
 * @class LinkedList
 */
class LinkedList {
  /**
   * 单向链表类
   * @class LinkedList
   */
  /**
   * 创建一个空链表
   */
  constructor() {
    this.head = null; // 链表头节点引用
    this.size = 0; // 链表节点数量
  }

  /**
   * 在链表末尾添加节点
   * @param {any} data - 要添加的数据
   */
  append(data) {
    const newNode = new Node(data); // 创建新节点

    if (!this.head) { // 链表为空时
      this.head = newNode; // 头节点指向新节点
    } else {
      let current = this.head; // 从头部开始遍历
      while (current.next) { // 找到最后一个节点
        current = current.next;
      }
      current.next = newNode; // 最后一个节点的next指向新节点
    }

    this.size++; // 链表长度加1
  }

  /**
   * 在指定位置插入节点
   * @param {any} data - 要插入的数据
   * @param {number} position - 插入位置（从0开始）
   * @return {boolean} 插入是否成功
   */
  /**
   * 在指定位置插入节点
   * @param {any} data - 要插入的数据
   * @param {number} position - 插入位置（从0开始）
   * @return {boolean} 插入是否成功
   */
  insert(data, position) {
    if (position < 0 || position > this.size) { // 检查位置有效性
      return false;
    }

    const newNode = new Node(data); // 创建新节点

    if (position === 0) { // 插入到头部
      newNode.next = this.head; // 新节点的next指向原头节点
      this.head = newNode; // 头节点更新为新节点
    } else {
      let current = this.head; // 当前节点指针
      let previous = null; // 前一个节点指针
      let index = 0;

      while (index < position) { // 遍历到目标位置
        previous = current;
        current = current.next;
        index++;
      }

      newNode.next = current; // 新节点的next指向当前节点
      previous.next = newNode; // 前一个节点的next指向新节点
    }

    this.size++; // 链表长度加1
    return true;
  }

  /**
   * 移除指定位置的节点
   * @param {number} position - 要移除的位置
   * @return {any} 被移除节点的数据，如果删除失败则返回null
   */
  removeAt(position) {
    if (position < 0 || position >= this.size || !this.head) {
      return null;
    }

    let current = this.head;

    if (position === 0) {
      this.head = current.next;
    } else {
      let previous = null;
      let index = 0;

      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }

      previous.next = current.next;
    }

    this.size--;
    return current.data;
  }

  /**
   * 查找元素的索引
   * @param {any} data - 要查找的数据
   * @return {number} 元素的索引，如果不存在则返回-1
   */
  indexOf(data) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.data === data) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * 移除指定元素
   * @param {any} data - 要移除的数据
   * @return {any} 被移除的数据，如果不存在则返回null
   */
  remove(data) {
    const index = this.indexOf(data);
    return this.removeAt(index);
  }

  /**
   * 判断链表是否为空
   * @return {boolean} 链表是否为空
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * 获取链表大小
   * @return {number} 链表中的节点数量
   */
  getSize() {
    return this.size;
  }

  /**
   * 获取链表的字符串表示
   * @return {string} 链表的字符串表示
   */
  toString() {
    if (!this.head) {
      return '';
    }

    let string = `${this.head.data}`;
    let current = this.head.next;

    while (current) {
      string = `${string},${current.data}`;
      current = current.next;
    }

    return string;
  }
}

// 调用示例
const list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);
console.log(list);

// console.log(list.toString()); // "10,20,30"

list.insert(15, 1);
// console.log(list.toString()); // "10,15,20,30"

// console.log(list.removeAt(2)); // 20
// console.log(list.toString()); // "10,15,30"

// console.log(list.indexOf(15)); // 1
// console.log(list.remove(15)); // 15
// console.log(list.toString()); // "10,30"

// console.log(list.isEmpty()); // false
// console.log(list.getSize()); // 2
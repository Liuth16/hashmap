class HashMap {
  constructor(slots) {
    this.arr = new Array(slots).fill(null);
  }

  checkCapacity() {
    return this.arr.filter((slot) => slot !== null).length;
  }

  increaseCapacity() {
    const filledSlots = this.checkCapacity();
    if (filledSlots / this.arr.length >= 0.75) {
      this.arr.push(...new Array(this.arr.length).fill(null));
    }
  }

  clear() {
    this.arr.fill(null, 0, this.arr.length);
  }

  hash(key) {
    let hashCode = 0;
    const stringKey = key.toString();
    const primeNumber = 31;

    for (let i = 0; i < stringKey.length; i++) {
      hashCode =
        (primeNumber * hashCode + stringKey.charCodeAt(i)) % this.arr.length;
    }
    return hashCode;
  }

  set(key, value) {
    this.increaseCapacity();
    const index = this.hash(key);

    const existing = this.findIdInArray(key);
    if (existing) {
      const { arrayIndex, listPosition } = existing;
      this.arr[arrayIndex] = this.replaceValue(
        key,
        value,
        listPosition,
        this.arr[arrayIndex]
      );
    } else {
      const newNode = this.createNode(key, value, null);
      if (!this.arr[index]) {
        this.arr[index] = newNode;
      } else {
        let current = this.arr[index];
        while (current.next) {
          current = current.next;
        }
        current.next = newNode;
      }
    }
  }

  findIdInArray(targetValue) {
    for (let i = 0; i < this.arr.length; i++) {
      let current = this.arr[i];
      let position = 0;

      while (current) {
        if (current.id === targetValue) {
          return {
            arrayIndex: i,
            listPosition: position,
            storedValue: current.name,
          };
        }
        current = current.next;
        position++;
      }
    }
    return null;
  }

  length() {
    let total = 0;
    this.arr.forEach((slot) => {
      let current = slot;
      while (current) {
        current = current.next;
        total++;
      }
    });
    return total;
  }

  get(key) {
    const result = this.findIdInArray(key);
    return result ? result.storedValue : null;
  }

  has(key) {
    return !!this.findIdInArray(key);
  }

  keys() {
    const keyList = [];
    this.arr.forEach((slot) => {
      let current = slot;
      while (current) {
        keyList.push(current.id);
        current = current.next;
      }
    });
    return keyList;
  }

  values() {
    const valueList = [];
    this.arr.forEach((slot) => {
      let current = slot;
      while (current) {
        valueList.push(current.name);
        current = current.next;
      }
    });
    return valueList;
  }

  entries() {
    const entriesList = [];
    this.arr.forEach((slot) => {
      let current = slot;
      while (current) {
        entriesList.push([current.id, current.name]);
        current = current.next;
      }
    });
    return entriesList;
  }

  remove(key) {
    const obj = this.findIdInArray(key);
    if (obj) {
      const { arrayIndex, listPosition } = obj;
      if (listPosition === 0) {
        this.arr[arrayIndex] = this.arr[arrayIndex].next;
        return true;
      }
      let current = this.arr[arrayIndex];
      let count = 0;
      while (current && count < listPosition - 1) {
        current = current.next;
        count++;
      }
      if (current && current.next) {
        current.next = current.next.next;
        return true;
      }
    }
    return false;
  }

  createNode(id = null, name = null, next = null) {
    return { id, name, next };
  }

  replaceValue(id, value, index, head) {
    if (index === 0) {
      return this.createNode(id, value, head.next);
    }
    let current = head;
    let count = 0;
    while (current && count < index - 1) {
      current = current.next;
      count++;
    }
    if (!current || !current.next) {
      throw new Error("Index out of bounds");
    }
    current.next = this.createNode(id, value, current.next.next);
    return head;
  }
}

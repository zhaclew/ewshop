 /**
  *  在这里存一些好用的方法
  */
 
 
 
 // 根据传入的对象来获得对应的值或键
export function getkeyFromvalue(object, value) {
  for (let ob in object) {
    if (object.hasOwnProperty(ob)) {
      if (object[ob] === value) return ob;
    }
  }
}
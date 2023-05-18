import { isObject } from "@vue/shared";

const enum ReactiveFlags {
  IS_REACTIVE = "_v_isReactive",
}
const reactiveMap = new WeakMap(); //将target和proxy做一个映射，用作处理重复代理时候都指向同一个对象 使用waekmap在对象不用的时候可以回收，防止内存泄露
const mutableHandlers = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  },

  set(target, key, newValue, receiver) {
    console.log(`output->set了属性值`);
    target[key] = newValue;
    return Reflect.set(target, key, newValue, receiver);
  },
};

function createReactiveObject(target) {
  if (!isObject) return target;
  const exitstingProxy = reactiveMap.get(target);
  // 通过缓存防止同个对象多次代理
  if (exitstingProxy) {
    return exitstingProxy;
  }
  // 通过加标识防止已经代理过的对象再次被代理 !!!标识并未添加到target上，只是通过一个获取标识的逻辑拦截掉了
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}

export function reactive(target: object) {
  return createReactiveObject(target);
}

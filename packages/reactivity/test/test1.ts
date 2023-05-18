// 为什么要使用receiver
const target = {
  name: "HDX",
  get alisaName() {
    return this.name + "__Ali";
  },
};

const state = new Proxy(target, {
  get(target, key, receiver) {
    console.log(`output->get属性值`);
    // return target[key];
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    console.log(`output->set了属性值`);
    target[key] = newValue;
    // return target[key];
    return Reflect.set(target, key, newValue, receiver);
  },
});

//伪代码
//_________START
// effect(()=>{
//     console.log(`output->alisaName.`, state.alisaName);
// })

//target.name = "test"; // 在更改了name属性后，希望effect中的alisaName也跟着改变
// —————————END


// 使用target[key]的时候 this==> state.alisaName = target.name + "__Ali" //无法监听到target的属性改变
// 使用recevier时候 this==> state.alisaName = state.name + "__Ali" // 这里又通过代理对象访问了name 所以name变化的时候可以被监听到

import { activeEffect } from "./effect"

export const enum ReactiveFlags {
	IS_REACTIVE = "_v_isReactive",
}
export const mutableHandlers = {
	get(target, key, receiver) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return true
		}
		track(target, key)
		return Reflect.get(target, key, receiver)
	},

	set(target, key, newValue, receiver) {
		const oldValue = target[key]
		target[key] = newValue
		if (newValue !== oldValue) {
			trigger(target, key, newValue, oldValue)
		}
		return Reflect.set(target, key, newValue, receiver)
	},
}

// 做依赖收集
// {target=>key=>effect}
//{map1: map2}
// map1=> {target: key}
// map2=> {key: effect}
// {{target:key} : {key:effect}}
const targetMap = new WeakMap()
function track(target, key) {
	if (activeEffect) {
		let depsMap = targetMap.get(target)
		if (!depsMap) {
			targetMap.set(target, (depsMap = new Map()))
		}
		let dep = depsMap.get(key)
		if (!dep) {
			depsMap.set(key, (dep = new Set()))
		}
		const shouldTrack = !dep.has(activeEffect)
		if (shouldTrack) {
			dep.add(activeEffect) // 收集effect
			activeEffect.deps.push(dep) //收集变量Set
		}
	}
}

// 触发更新
function trigger(target, key, newValue, oldValue) {
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		return
	}
	let effects = depsMap.get(key)
	if (effects) {
		effects = [...effects]

		effects.forEach((effect) => {
			if (effect !== activeEffect) {
				effect.run()
			}
		})
	}
}

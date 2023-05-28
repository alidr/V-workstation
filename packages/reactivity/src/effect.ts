export let activeEffect = undefined
function cleanEffect(effect) {
	const deps = effect.deps
	for (let i = 0; i < deps.length; i++) {
		deps[i].delete(effect)
	}
	effect.deps.length = 0
}
class ReactiveEffect {
	public parentEffect = undefined
	deps = []
	constructor(public fn) {}
	run() {
		try {
			this.parentEffect = activeEffect
			activeEffect = this
			cleanEffect(this)
			this.fn()
		} finally {
			activeEffect = this.parentEffect
			this.parentEffect = undefined
		}
	}
}

export function effect(fn) {
	const _effect = new ReactiveEffect(fn)
	_effect.run()
}

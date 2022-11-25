import Msg from './Msg.vue'

const obj = {}

obj.install = (Vue) => {
	const instance = Vue.extend(Msg)
	const msg = new instance()
	document.body.appendChild(msg.$mount().$el)
	Vue.prototype.$msg = msg
}

export default obj
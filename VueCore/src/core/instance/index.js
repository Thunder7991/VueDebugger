import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

//定义Vue函数

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue) //保证了无法直接通过Vue()去调用，只能通过new的方式去创建实例
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  
  this._init(options)
}



//new Vue（）对象都干了什么？ 初始化init
initMixin(Vue) //定义原型上的init方法（内部方法）  里面有比较重要的 mergeOptions 

stateMixin(Vue) //定义原型上跟数据相关的属性方法   定义 $set $delete $watch
eventsMixin(Vue) //定义原型上跟事件相关的属性方法  定义 $emit $on $off $once
lifecycleMixin(Vue) //定义原型上跟生命周期相关的方法 定义了 $forceUpdate $destroy _update
renderMixin(Vue) // 定义渲染相关的函数  定义了 $nextTick  __render


export default Vue

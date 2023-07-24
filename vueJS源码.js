const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
//重写原型方法
methodsToPatch.forEach(item => {
    switch (method) {
      case 'push':
        arrayMethods['push'].apply(this.arguments)
        break;
      default:
        break;
    }
    //派发更新
    const ob = this.__ob__
    ob.dep.notify()
})

class TCVue {
  //获取options.data
  constructor() {
    this.$options = options;
    this.$data = options.data;
    this.$el = options.el;

    //数据响应式Observer

    //每个data属性对应这一个Dep对象
    //初次的时候Dep.target 为 null
    new Observer(this.$data);

    //处理el
    //此时
    this.$mount(this.$el);
  }

  // initData(options) {
  //   if (!options.data) {
  //     return;
  //   }

  // }
  $mount(el) {
    //添加订阅者
    const updateView = (_) => {
      let innerHtml = document.querySelector(el).innerHtml;
      let key = innerHtml.match(/{(\w+)}/)[1];
      document.querySelector(el).innerHtml = this.options.data[key];
    };
    new Watcher(updateView, true);
  }
}

class Observer {
  constructor(data) {
    //遍历data
    if (
      !data ||
      !Object.prototype.toString.call(data).indexOf('Object') ||
      Object.getOwnPropertyDescriptor(obj).configurable === false
    ) {
      throw new Error('data错误');
    }
    if (Array.isArray(data)) {
      Object.setPrototypeOf(data,arrayProto)

    } else {
      this.walk(data);
    }
  
  }
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      //defineReactive :真实的数据响应式
      defineReactive(obj, keys[i]);
    }
  }

  
}
const defineReactive = function (obj, val) {
  //判断obj是否符合存取属性描述
  //添加响应之前添加dep依赖, 因为每个keys[i]会被多个watcher使用

  const dep = new Dep();
  Object.defineProperty(obj, val, {
    configurable: true,
    enumerbale: true,
    get() {
      if (Dep.target) {
        dep.depend(Dep.target);
      }
      return val;
    },
    set(nv) {
      if (nv === val) {
        return;
      }
      val = nv;
      dep.notify()
    },
  });
};
//依赖
let uuid = 0;
class Dep {
  constructor() {
    this.id = uuid++;
    this.subs = [];
  }
  //添加依赖
  depend(sub) {
    this.subs.push(sub);
  }
  //派发更新
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
Dep.target = null;

//watcher 订阅数据变化,绑定更新函数
//挂载的时候,get函数触发,解析el中的模板中的指令
//此时 getter函数,会触发$data中属性的get操作,
//将订阅者Watcher添加到Dep中
class Watcher {
  constructor(expOrFn, isRenderWatcher) {
    this.getter = expOrFn;
    //更新状态
    this.get();
  }
  get() {
    //每个
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }
  update() {
    this.get();
  }
}

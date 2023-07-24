//实现简单的patch （不包含Key）


//测试数据
const oldVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '1' },
    { type: 'p', children: '2' },
    { type: 'p', children: '3' },
  ],
};

const newVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '4' },
    { type: 'p', children: '5' },
    { type: 'p', children: '6' },
  ],
};

function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    //省略代码
  } else if (Array.isArray(n2.children)) {
    //重新实现两组子节点的更新方式
    //新旧 children
    const oldChildren = n1.children;
    const newChildren = n2.children;

    //旧的一组子节点的长度
    const oldLen = oldChildren.length;
    //新的一组子节点的长度
    const newLen = newChildren.length;
    //两组子节点的公共长度，即两者中较短的一组子节点的长度
    const commonLength = Math.min(oldLen, newLen);
    //遍历 commonLength
    for (let i = 0; i < commonLength.length; i++) {
      //调用path函数逐个调用子节点
      patch(oldChildren[i], newChildren[i]);
    }
    //如果newLen > oldLen 说明新子节点需要挂载
    if (newLen > oldLen) {
      for (let i = commonLength; i < newLen; i++) {
        patch(null, newChildren[i], container);
      }
    } else if (oldLen > newLen) {
      //如果oldLen 》 newLen 说明旧子节点需要卸载
      for (let i = commonLength; i < newLen; i++) {
        unmount(oldChildren[i]);
      }
    }
  } else {
    //省略代码
  }
}

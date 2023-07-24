
//测试数据
const oldVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '1',key:1 },
    { type: 'p', children: '2',key:2 },
    { type: 'p', children: '3',key:3 },
  ],
};

const newVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '4',key:3 },
    { type: 'p', children: '5',key:1 },
    { type: 'p', children: '6',key:2 },
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

    //用来存储寻找过程中遇到的最大索引值
    let lastIndex = 0
    //遍历新的children
    for (let i = 0; i < newChildren.length; i++) {
      const newVnode = newChildren[i];

      //在第一层循环中，定义变量find， 代表是否在旧的一组子节点中找到可复用的节点
      //初始值为false， 代表没找到
      let find = false
      //遍历旧的children
      for (let j = 0; j < oldChildren.length; j++) {
        const oldVnode = oldChildren[j];
      
        //如果找到了具有相同的key值的两个节点，说明可以复用，但仍然需要调用patch函数更新
        if (newVnode.key === oldVnode.key) {
          patch(oldVnode, newVnode, container);
          //在旧children中寻找具有相同key值的节点过程中，遇到的最大索引值。
          //如果 在后续寻找的过程中，存在索引值比当前遇到的最大索引值还要小的节点，则意味着该节点需要移动

          if (j < lastIndex) {
            //如果当前找到的节点在旧Children中的索引小于最大索引值 lastIndex，
            //说明该节点对应的真是DOM需要移动
            //先获取newVnode的前一个vnode ji prvVnode
            const prevVnode = newChildren[i - 1]
            //如果prevVnode不存在说明当前Vnode是第一个节点不需要移动
            if (prevVnode) {
              //由于我们需要建newVnode对应的真是DOM移动到prevVNode所对应的真是DOM后面，
              //所以我们需要获取prevNode对应的真是DOM的下一个兄弟节点，并将其作为描点
              const anchor = prevVnode.el.nextSibling
              //调用insert方法将newVnode对应的真是DOM插入到描点元素前面， 也就是prevVnode对应的真是DOM后面
              insert(newVnode.el,container,anchor)
            }
          }else {
            //如果当前找到的节点在旧children中的索引不小于最大索引值
            //则更新lastIndex的值
          }
          break; //这里需要break?
        }
      }
    }
  } else {
    //省略代码
  }
}

// 移动节点指的是，移动一个虚拟节点所对应的真实的DOM节点，并不是移动虚拟节点本身
function patchElement(n1,n2) {
  //新的vnode也引用了真是的DOM元素
  const el =n2.el = n1.el

}
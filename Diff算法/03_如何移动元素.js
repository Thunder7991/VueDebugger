
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

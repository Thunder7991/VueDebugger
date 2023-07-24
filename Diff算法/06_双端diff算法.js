//测试数据
const oldVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 },
    { type: 'p', children: '3', key: 3 },
  ],
};

const newVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '4', key: 3 },
    { type: 'p', children: '5', key: 1 },
    { type: 'p', children: '6', key: 2 },
  ],
};

function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {
    //省略代码
  } else if (Array.isArray(n2.children)) {
    //封装函数 patchKeyedArray 函数处理两组子节点
  } else {
    //省略代码
  }
}

function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children;
  const newChildren = n2.children;

  //四个索引值
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  //四个索引值对应的vnode节点
  let oldStartIdxVnode = oldChildren[oldStartIdx];
  let oldEndIdxVnode = oldChildren[oldEndIdx];
  let newStartIdxVnode = newChildren[newStartIdx];
  let newEndIdxVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartIdxVnode.key === newStartIdxVnode.key) {
      //第一步
      //只需要补丁
      patch(oldStartIdxVnode,newStartIdxVnode,container)
      oldStartIdxVnode = oldChildren[++oldStartIdx]
      newStartIdxVnode = newChildren[++newStartIdx]
    } else if (oldStartIdxVnode.key === newEndIdxVnode.key) {
      //第二步
      //调用 patch函数 在oldstartVnode 和 newStartVnode 之间打补丁
      patch(oldStartIdxVnode, newEndIdxVnode, container);

      insert(oldStartIdxVnode.el, container, oldEndIdxVnode.el.nextSibling);

      oldStartIdxVnode = oldChildren[++oldStartIdx];
      newEndIdxVnode = newChildren[--newEndIdx];
    } else if (oldEndIdxVnode.key === newEndIdxVnode.key) {
      //第三步
      //节点在新的顺序中仍然处于尾部，不需要移动，但需要打补丁
      patch(oldEndIdxVnode, newEndIdxVnode, container);
      //更新索引和头尾节点变量
      oldEndIdxVnode = oldChildren[--oldEndIdx];
      newEndIdxVnode = newChildren[-newEndIdx];
    } else if (oldEndIdxVnode.key === newStartIdxVnode.key) {
      //第四步
      //首先需要调用patch函数进行补丁
      patch(oldEndIdxVnode, newStartIdxVnode, container);
      //移动DOM操作
      // oldEndIdxVnode.el 移动到oldStartIdxVnode 前面
      insert(oldEndIdxVnode.el, container, oldStartIdxVnode);

      oldEndIdxVnode = oldChildren[--oldEndIdx];
      newStartIdxVnode = newChildren[++newStartIdx];
    }
  }
}

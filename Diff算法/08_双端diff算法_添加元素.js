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
  let oldStartVnode = oldChildren[oldStartIdx];
  let oldEndVnode = oldChildren[oldEndIdx];
  let newStartVnode = newChildren[newStartIdx];
  let newEndVnode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    //增加两个判断分支，如果头尾部为undefined， 则说明该节点被处理过，直接跳到下一个位置
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = newChildren[--oldEndVnode];
    } else if (oldStartVnode.key === newStartVnode.key) {
      //第一步
      //只需要补丁
      patch(oldStartVnode, newStartVnode, container);
      oldStartVnode = oldChildren[++oldStartIdx];
      newStartVnode = newChildren[++newStartIdx];
    } else if (oldStartVnode.key === newEndVnode.key) {
      //第二步
      //调用 patch函数 在oldstartVnode 和 newStartVnode 之间打补丁
      patch(oldStartVnode, newEndVnode, container);

      insert(oldStartVnode.el, container, oldEndVnode.el.nextSibling);

      oldStartVnode = oldChildren[++oldStartIdx];
      newEndVnode = newChildren[--newEndIdx];
    } else if (oldEndVnode.key === newEndVnode.key) {
      //第三步
      //节点在新的顺序中仍然处于尾部，不需要移动，但需要打补丁
      patch(oldEndVnode, newEndVnode, container);
      //更新索引和头尾节点变量
      oldEndVnode = oldChildren[--oldEndIdx];
      newEndVnode = newChildren[--newEndIdx];
    } else if (oldEndVnode.key === newStartVnode.key) {
      //第四步
      //首先需要调用patch函数进行补丁
      patch(oldEndVnode, newStartVnode, container);
      //移动DOM操作
      // oldEndVnode.el 移动到oldStartVnode 前面
      insert(oldEndVnode.el, container, oldStartVnode);

      oldEndVnode = oldChildren[--oldEndIdx];
      newStartVnode = newChildren[++newStartIdx];
    } else {
      //遍历旧的一组子节点，视图寻找于newStartVnode拥有相同Key值的节点
      //idxInOld 就是新的一组子节点的头部节点在旧的一组节点中的索引
      const idxInOld = oldChildren.findIndex(
        (node) => node.key === newStartVnode.key,
      );
      //如果idxInOld大于0 说明已经找到了可以复用的节点， 并且需要将其对应的DOM移动到头部
      if (indxInOld > 0) {
        const vnodeToMove = oldChildren[idxInOld];
        //不要忘记移除移动操作外还应该打补丁
        patch(vnodeToMove, newStartVnode, container);
        //将vnodetoMove。el 移动到头部节点oldStartVnode.el之前 因此需要后者作为描点
        insert(vnodeToMove.el, container, oldStartVnode.el);

        oldChildren[idxInOld] = undefined;
        // //更新 newStartIdx到下一个位置
        // newStartVnode = newChildren[++newStartIdx]
      } else {
        //添加元素
        // 将newStartVnode作为新的节点挂载到头部，使用当前头部节点oldStartVnode.el作为描点
        patch(null, newStartVnode, container, oldStartVnode.el);
      }
      //更新 newStartIdx到下一个位置
      newStartVnode = newChildren[++newStartIdx];
    }
  }

  if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
    //如果满足条件说明有新增的节点遗漏，需要挂载他们
    for (let i = newStartIdx; i < newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVnode.el);
    }
  }
}

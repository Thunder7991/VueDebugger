function patchKeyedChildren(n1, n2, container) {
  const newChildren = n2.children;
  const oldChildren = n1.children;

  //处理相同的前置节点
  //索引 j 指向新旧两组子节点的开头
  let j = 0;
  let oldVnode = oldChildren[j];
  let newVnode = newChildren[j];
  //while循环向后遍历， 直到遇到拥有不同key值的节点为止
  while (oldVnode.key === newVnode.key) {
    //调用patch进行更新
    patch(oldVnode, newVnode, container);
    //更新J ，让其递增
    j++;
    oldVnode = oldChildren[j];
    newVnode = newChildren[j];
  }

  //更新相同的后置节点
  let oldEnd = oldChildren.length - 1;
  let newEnd = newChildren.length - 1;
  oldVnode = oldChildren[oldEnd];
  newVnode = newChildren[newEnd];
  //while 循环从后往前遍历， 直到遇到不同key值为止
  while (oldVnode.key === newVnode.key) {
    //调用patch进行更新
    patch(oldVnode, newVnode, container);
    //递减
    oldEnd--;
    newEnd--;
    oldVnode = oldChildren[oldEnd];
    newVnode = newChildren[newEnd];
  }
  //预处理完毕之后， 如果满足如下条件， 则说明 j --> nextEnd之间的节点应作为新节点插入
  if (j > oldEnd && j <= newEnd) {
    //描点的索引
    const anchorIndex = newEnd + 1;
    const anchor =
      anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
    //采用 while循环，调用patch函数 逐个挂载新增节点
    while (j <= newEnd) {
      patch(null, newChildren[j++], container, anchor);
    }
  } else if (j > newEnd && j <= oldEnd) {
    // j => oldEnd之间的节点应该被卸载
    while (j <= oldEnd) {
      unmount(oldChildren[j++]);
    }
  } else {
    //处理 非理想情况
    // 构建 source 数组
    // 新的一组子节点中剩余未处理节点的数量
    const count = newEnd - j + 1;
    const source = new Array(count);
    source.fill(-1);
    //oldStart  newStart 分别为其实索引，即 j
    const oldStart = j;
    const newStart = j;
    //新增两个变量
    let moved = false;
    let pos = 0; // 遍历过程中遇到的最大索引值key

    // 构建索引表
    const keyIndex = {};
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i;
    }
    //新增 patched 变量，代表更新过的节点数量
    let patched = 0;
    //遍历旧的子节点
    for (let i = oldStart; i <= oldEnd; i++) {
      const oldVnode = oldChildren[i];
      if (patched <= count) {
        //通过索引表快速找到新的一组子节点具有相同key值的节点位置
        const k = keyIndex[oldVnode.key];
        if (typeof k !== 'undefined') {
          const newVnode = newChildren[k];
          patch(oldVnode, newVnode, container);
          //没更新一个节点 都将patched 变量 + 1
          patched++;
          source[k - newStart] = i;
          //判断节点是否需要移动
          if (k < pos) {
            moved = true;
          } else {
            pos = k;
          }
        } else {
          //没找到
          unmount(oldVnode);
        }
      } else {
        //如果更新过的节点数量 大于需要更新的节点数量 则卸载多余的节点
        unmount(oldVnode);
      }
    }
    if (moved) {
      //如果moved 为true 则需要移动dom
      const seq = lis(source);
      //S 指向 最长递归子序列的最后一个元素
      let s = seq.length - 1;

      //i 指向新的一个子节点的最后一个元素
      let i = count - 1;
      //for 循环使得I递减，
      for (i; i >= 0; i--) {
        if (source[i] === -1) {
          //说明索引为I的节点为全新的节点， 应该将其挂载
          //获取该节点在新的children中的真实位置索引
          const pos = i + newStart;
          const newVnode = newChildren[pos];
          //该节点的下一个节点的位置索引
          const nextPos = pos + 1;

          //描点
          const anchor =
            nextPos < newChildren.length ? newChildren[nextPos].el : null;
          //挂载
          putch(null, newVnode, container, anchor);
        } else if (i !== seq[s]) {
          //如果节点的索引 i，不等于seq[s] 的值，说明该节点需要移动
          // 获取新的节点的真实位置
          const pos = i+newStart
          const newVnode = newChildren[pos]
          //该节点的下一个节点的位置索引
          const nextPos = pos + 1
          //描点
          const anchor = nextPos < newChildren.length?newChildren[nextPos].el : null
          // 移动
          insert(newVnode.el,container,anchor)

        } else {
          //如果节点的索引 i，等于seq[s] 的值，说明该节点不需要移动
          //只需要让S指向下一个指针
          s--;
        }
      }
    }
  }
}

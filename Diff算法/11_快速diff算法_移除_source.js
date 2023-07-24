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
  
    //遍历旧的子节点
    for (let i = oldStart; i <= oldEnd; i++) {
        const oldVnode = oldChildren[i];
        //遍历新的一组子节点
        for (let k = newStart; k <= newEnd; k++) {
            const newVnode = newChildren[k];
            //找到相同key值的可复用节点
            if (oldVnode.key=== newVnode.key) {
                    //patch 跟心
                    patch(oldVnode,newVnode,container)
                    //最后填充source数组
                    source[k - newStart] = i
            }   

            
        }
        
    }
  }
}

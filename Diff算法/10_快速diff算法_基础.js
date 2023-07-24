function patchKeyedChildren(n1,n2,container) {
    const newChildren = n2.children
    const oldChildren = n1.children

    //处理相同的前置节点
    //索引 j 指向新旧两组子节点的开头
    let j = 0
    let oldVnode = oldChildren[j]
    let newVnode = newChildren[j]
    //while循环向后遍历， 直到遇到拥有不同key值的节点为止
    while(oldVnode.key === newVnode.key) {
        //调用patch进行更新
        patch(oldVnode,newVnode,container)
        //更新J ，让其递增
        j++
        oldVnode = oldChildren[j]
        newVnode = newChildren[j]
    }

    //更新相同的后置节点
    let oldEnd = oldChildren.length -1 
    let newEnd = newChildren.length - 1
    oldVnode = oldChildren[oldEnd]
    newVnode = newChildren[newEnd]
    //while 循环从后往前遍历， 直到遇到不同key值为止
    while(oldVnode.key === newVnode.key) {
        //调用patch进行更新
        patch(oldVnode,newVnode,container)
        //递减
        oldEnd--
        newEnd--
        oldVnode = oldChildren[oldEnd]
        newVnode = newChildren[newEnd]
    }

    //预处理完毕之后， 如果满足如下条件， 则说明 j --> nextEnd之间的节点应作为新节点插入
    if (j>oldEnd && j <=newEnd) {
        //描点的索引
        const anchorIndex = newEnd + 1
        const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null

        //采用 while循环，调用patch函数 逐个挂载新增节点

        while (j <= newEnd) {
            patch(null,newChildren[j++],container,anchor)
        }
        
        
    }
    
}
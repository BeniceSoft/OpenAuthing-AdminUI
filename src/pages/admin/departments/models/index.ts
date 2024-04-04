import { useCallback, useEffect, useState } from "react"
import TreeNode from "@/@types/TreeNode"
import DepartmentService from "@/services/department.service"


const addChildrenToTree = (tree: TreeNode[], parentId: string, children: TreeNode[]) => {
    if (typeof parentId === 'undefined' || parentId === '' || parentId === null) return children
    return tree.map(node => {
        if (node.key === parentId) {
            node.children = children;
        } else if (node.children) {
            node.children = addChildrenToTree(node.children, parentId, children);
        }
        return node;
    });
}

export default () => {
    const [loading, setLoading] = useState(false)
    const [departmentTree, setDepartmentTree] = useState<TreeNode[]>([])

    const fetchDepartments = async (parentId?: string) => {
        if (parentId) {
            const data = await DepartmentService.getAll(parentId)
            let children = data?.map((x: any) => ({ ...x, key: x.id, title: x.name }))
            const tree = addChildrenToTree(departmentTree as TreeNode[], parentId, children || [])
            setDepartmentTree(tree)

            return
        }

        setLoading(true)
        try {
            const data = await DepartmentService.getAll(parentId)
            const tree = data?.map((x: any) => ({ ...x, key: x.id, title: x.name }))
            setDepartmentTree(tree || [])
        } finally {
            setLoading(false)
        }
    }

    const clear = () => {
        setDepartmentTree([])
    }


    return {
        loading,
        departmentTree,
        clear,
        fetchDepartments
    }
}
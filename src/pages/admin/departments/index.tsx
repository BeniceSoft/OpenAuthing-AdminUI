import PageHeader from "@/components/PageHeader"
import Tree from "@/components/Tree"
import { useEffect, useRef, useState } from "react"
import TreeNode from "@/@types/TreeNode"
import { history, useModel } from "umi"
import DepartmentDialog, { DepartmentDialogRef } from "./components/DepartmentDialog"
import classNames from "classnames"
import DepartmentService from "@/services/department.service"
import Message from "@/components/Message"
import { confirm } from '@/components/Modal'
import AddMemberDialog from "./components/AddMemberDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, MoreHorizontal, Plus, Search, XCircle } from "lucide-react"
import DepartmentMemberTable, { DepartmentMemberTableRef } from "./components/DepartmentMemberTable"
import { Button } from "@/components/ui/button"
import DepartmentAndUserList from "./components/DepartmentAndUserList"
import toast from "react-hot-toast"

interface OrgManagementPageProps {
}

export default ({
}: OrgManagementPageProps) => {
    const [searchKey, setSearchKey] = useState('')
    const [selectedNode, setSelectedNode] = useState<TreeNode>()
    const [expandedKeys, setExpendedKeys] = useState(new Set<string>())
    const [messageQueue, setMessageQueue] = useState<Array<{ node: TreeNode, type: 'expand' | 'collapse' }>>([]);
    const [isOrgProcessing, setOrgProcessing] = useState(false)
    const [addMemberDialogOpened, setAddMemberDialogOpened] = useState<boolean>()

    const tableRef = useRef<DepartmentMemberTableRef>(null)
    const departmentDialogRef = useRef<DepartmentDialogRef>(null)

    const {
        loading: isLoadingRootDepartment,
        departmentTree,
        fetchDepartments,
        clear
    } = useModel("admin.departments.index")

    useEffect(() => {
        fetchDepartments()

        return clear
    }, [])

    // 消费消息队列中的消息
    useEffect(() => {
        if (messageQueue.length > 0) {
            const message = messageQueue.shift();
            if (!message) return

            const newExpandedKeys = new Set(expandedKeys);
            if (message.type === 'expand') {
                setExpendedKeys(newExpandedKeys.add(message.node.key));
            } else if (message.type === 'collapse') {
                newExpandedKeys.delete(message.node.key)
                setExpendedKeys(newExpandedKeys);
            }
        }
    }, [messageQueue]);

    const onSearchKeyChange = (e: any) => {
        setSearchKey(e.target.value.trim())
    }

    // 部门切换时
    const onSelect = (node: TreeNode) => {
        setSelectedNode(node)
    }

    // 处理展开/折叠操作，并将操作封装为消息放入队列中
    const onExpand = (node: TreeNode, expanded: boolean) => {
        setMessageQueue([...messageQueue, { type: expanded ? 'expand' : 'collapse', node }])
    }

    // 加载子部门列表
    const onLoadData = async ({ key, children }: TreeNode) => {
        console.log('load data', key)

        if (children) return

        await fetchDepartments(key)
    }

    // 打开新建/编辑组织弹窗
    const openDepartmentDialog = (departmentId?: string) => {
        let action: any = 'create'
        let data = undefined
        if (departmentId) {
            action = 'update'
            data = {
                id: departmentId
            }
        }

        departmentDialogRef.current?.open(action, data)
    }

    // 关闭新建/编辑部门弹窗
    const closeDepartmentDialog = () => {
        departmentDialogRef.current?.close()
    }

    // 处理创建/修改部门
    const handleCreateOrUpdateDepartment = async (actionType: string, value: any) => {
        const { id = '' } = value
        setOrgProcessing(true)
        try {
            if (actionType === 'update' && id !== '') {
                const data = await DepartmentService.update(id, { ...value })
                if (data) {
                    Message.success('更新成功')
                }
            } else {
                const data = await DepartmentService.create({ ...value })
                if (data) {
                    Message.success('新建成功')
                }
            }

            closeDepartmentDialog()
            return true
        }
        catch {
            return false
        }
        finally {
            setOrgProcessing(false)
            await fetchDepartments()
        }
    }

    const handleDeleteDepartment = (node: TreeNode) => {
        confirm({
            title: `确定删除「${node.title}」吗?`,
            content: '删除后将无法恢复，请谨慎操作！',
            onOK: () => {
                console.log('delete')
            }
        })
    }

    const handleAddMembers = async (userIds: string[]) => {
        const addedCount = await DepartmentService.addDepartmentMembers({
            departmentId: selectedNode?.key!,
            userIds,
        })

        setAddMemberDialogOpened(false)

        if (addedCount) {

            toast.success(`已添加 ${addedCount} 个成员`)
            await tableRef.current?.refresh()
        }
    }

    const renderTreeNodeMenu = (node: TreeNode, selected: boolean) => {
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild={true}>
                    <button className={classNames(
                        "group w-6 h-6 rounded transition-colors flex items-center justify-center",
                        selected ? "text-white hover:bg-gray-200 hover:text-black" : "text-block hover:bg-white/80",
                        'text-gray-700 hidden group-hover:flex aria-expanded:flex'
                    )}>
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-2 text-sm text-gray-600">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <span>添加子部门</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDepartmentDialog(node.key)}>
                            <span>编辑部门</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDepartment(node)}>
                            <span>删除部门</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <>
            <div className="w-full h-full overflow-y-hidden flex flex-col">
                <PageHeader title="组织管理" description="维护组织内多层级部门，并管理成员的部门隶属关系。" rightRender={() => (
                    <div className="flex gap-x-4">
                        <Button variant="secondary">
                            成员入职
                        </Button>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild={true}>
                                <Button variant="secondary" className="gap-x-1">
                                    组织成员导入
                                    <ChevronDownIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-32 text-gray-500">
                                <DropdownMenuItem onClick={() => history.push("/admin/org/departments/importexcel")}>
                                    Excel 导入
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )} />
                <div className="flex w-full flex-1 mt-6 overflow-y-hidden">
                    <div className="flex flex-col w-64 min-w-[256px] border-r overflow-y-hidden">
                        <div className="flex h-8 w-full mb-2 items-center justify-start pr-5">
                            <div className="flex-1 flex mr-1 w-44 h-full items-center justify-start rounded bg-gray-100 px-2 gap-x-1">
                                <Search className="w-4 h-4 stroke-gray-400" />
                                <input className="border-none px-0 flex-1 min-w-0 bg-transparent focus:ring-0 text-sm placeholder:text-gray-400"
                                    value={searchKey} type="search"
                                    onChange={onSearchKeyChange}
                                    placeholder="搜索成员、部门" />
                            </div>
                            <button onClick={() => openDepartmentDialog()}
                                className="px-1 gap-x-0 flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 rounded text-sm hover:bg-gray-200 focus-visible:outline-none transition-colors">
                                <Plus className="w-3 h-3" />
                                <span>新建</span>
                            </button>
                        </div>
                        {searchKey === '' ?
                            <Tree className="flex-1 w-full overflow-y-auto pr-5"
                                isLoading={isLoadingRootDepartment}
                                selectedKey={selectedNode?.key} expandedKeys={expandedKeys}
                                onSelect={onSelect} onLoadData={onLoadData} onExpand={onExpand}
                                treeData={departmentTree}
                                renderMoreMenu={renderTreeNodeMenu} /> :
                            <DepartmentAndUserList loading={true} />
                        }
                    </div>
                    <div className="flex-1 pl-8">
                        <DepartmentMemberTable ref={tableRef}
                            isNone={typeof selectedNode === 'undefined' || selectedNode === null}
                            departmentId={selectedNode?.key!}
                            departmentName={selectedNode?.title}
                            onAddMember={() => setAddMemberDialogOpened(true)}
                        />
                    </div>
                </div>
            </div>
            <DepartmentDialog ref={departmentDialogRef}
                isProcessing={isOrgProcessing}
                onConfirm={handleCreateOrUpdateDepartment} />
            <AddMemberDialog open={addMemberDialogOpened} onOpenChange={setAddMemberDialogOpened}
                department={{ ...selectedNode }}
                onAdd={handleAddMembers} />
        </>
    )
}
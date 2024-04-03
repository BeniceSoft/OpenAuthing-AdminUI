import { DepartmentMember, UserDepartment } from "@/@types/department"
import Empty from "@/components/Empty"
import { Table, ColumnType } from "@/components/Table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { enabledStatusDescription } from "@/lib/utils"
import DepartmentService from "@/services/department.service"
import { MoreHorizontalIcon, Plus, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { history, useRequest } from "umi"

export interface UserTableProps {
    isNone?: boolean
    departmentId?: string
    departmentName?: string
    onAddMember?: () => void
    tableRef?: React.MutableRefObject<any>
}

export default ({
    isNone = true,
    departmentId,
    departmentName,
    tableRef,
    onAddMember
}: UserTableProps) => {
    const [onlyDirectUsers, setOnlyDirectUsers] = useState(false)

    // 部门切换时重新拉取部门用户列表
    useEffect(() => {
        if (!departmentId) return

        tableRef?.current?.resetPagination()

        fetchDepartmentUsers({
            pageIndex: 1,
            pageSize: 20,
        })

    }, [onlyDirectUsers, departmentId])

    const { loading, data, run: fetchDepartmentUsers, mutate } = useRequest(
        (params: { pageIndex: number, pageSize: number }) => DepartmentService.getDepartmentMembers({ ...params, departmentId, onlyDirectUsers }),
        { manual: true, initialData: { totalCount: 0, items: [] } }
    )

    const { loading: setLeaderLoading, run: setLeader, } = useRequest(
        async (userId: string, isLeader: boolean) => DepartmentService.setLeader({ departmentId: departmentId!, userId, isLeader }),
        {
            manual: true, onSuccess: (result, params) => {
                console.log(result)
                if (result) {
                    toast.success(`已${params[1] ? '设为' : '取消'}部门负责人`);
                    mutate((x: { totalCount: number, items: DepartmentMember[] }) => {

                        const items = x.items.map(item => {
                            if (item.id === params[0]) {
                                item.isLeader = params[1]
                            }
                            return item
                        })

                        return {
                            ...x,
                            items
                        }
                    })
                }
            },
        }
    )

    const handlePageChanged = async (pagination: { pageSize: number, pageIndex: number }) => {
        fetchDepartmentUsers({
            ...pagination
        })
    }

    const columns: ColumnType<DepartmentMember>[] = [{
        title: '用户',
        dataIndex: 'nickname',
        key: 'nickname',
        render: (value, record) => {
            return (
                <div className="inline-flex items-center gap-x-3 cursor-pointer"
                    onClick={() => history.replace(`/admin/org/users/${record.id}`)}>
                    <div className="flex items-center gap-x-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={record.avatar}
                                alt="avatar" />
                            <AvatarFallback>
                                <User className="w-5 h-5 stroke-gray-500" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-gray-900 font-medium">{value}</h3>
                            <p className="text-xs">{record.userName}</p>
                        </div>
                    </div>
                    {record.isLeader &&
                        <Badge size="xs" variant="violet">负责人</Badge>
                    }
                </div>
            )
        }
    }, {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 'w-40'
    }, {
        title: '所属部门',
        dataIndex: 'departments',
        key: 'departments',
        width: 'w-48',
        render: (value?: UserDepartment[]) => {
            const displayValue = value?.map(x => x.departmentName).join('、') ?? '-'
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild={true}>
                            <div className="cursor-default inline-block max-w-full truncate ...">{displayValue}</div>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent align="start" className="p-3 w-48">
                                <div className="space-y-2">
                                    {value?.map(item => (
                                        <div key={item.departmentId} className="space-x-2">
                                            <span>{item.departmentName}</span>
                                            {item.isMain &&
                                                <Badge size="xs" variant="destructive">主部门</Badge>
                                            }
                                        </div>
                                    ))}
                                    <TooltipArrow />
                                </div>
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                </TooltipProvider >
            )
        }
    }, {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
        width: 'w-24',
        render: (value: boolean) => (
            <Badge variant={value ? 'default' : 'destructive'}>{enabledStatusDescription(value)}</Badge>
        )
    }, {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        width: 'w-20',
        render: (value, record, index) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 p-2 text-gray-500">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex gap-x-2">
                                <span>{enabledStatusDescription(!record.enabled)}账号</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>办理离职</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>变更部门</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>设置主部门</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLeader(value, !record.isLeader)}>
                                <span>{record.isLeader ? '取消' : '设为'}负责人</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>设置岗位</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },]

    return (
        <Empty isEmpty={isNone}
            description="选择部门来管理成员">
            <div className="flex w-full h-full flex-col overflow-hidden">
                {loading || setLeaderLoading ?
                    <Skeleton className="h-10 mb-1 w-full" /> :
                    <div className="flex items-center justify-between h-8 mb-2 text-sm">
                        <div className="flex-1 flex gap-x-4">
                            <span className="font-semibold">{departmentName}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center text-gray-400 gap-x-1 text-xs ">
                                            <Users className="w-4 h-4" />
                                            {data?.totalCount}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div>{data?.totalCount} 成员</div>
                                        <TooltipArrow />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <label className="select-none flex items-center gap-x-1">
                                <input type="checkbox" checked={onlyDirectUsers}
                                    className=""
                                    onChange={e => { setOnlyDirectUsers(e.target.checked) }} />
                                仅展示部门的直属成员
                            </label>
                        </div>
                        <Button variant="link"
                            onClick={onAddMember}>
                            <Plus className="w-4 h-4" />
                            <span>添加成员</span>
                        </Button>
                    </div>
                }
                <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                    <Table<DepartmentMember> ref={tableRef}
                        columns={columns} isLoading={loading || setLeaderLoading}
                        {...data}
                        onPageChanged={handlePageChanged} />
                </div>
            </div>
        </Empty>
    )
}
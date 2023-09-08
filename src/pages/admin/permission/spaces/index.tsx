import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import { Table } from "@/components/Table"
import { Link, history, useRequest } from "umi"
import { SearchIcon } from "lucide-react"
import PermissionSpaceService from "@/services/permission-space.service"
import { ChangeEvent, useState } from "react"
import { Badge } from "@/components/ui/badge"

export default () => {
    const { loading, data, run: fetch } = useRequest((searchKey?: string) => {
        const params = { searchKey }
        return PermissionSpaceService.getAll(params)
    }, {
        debounceInterval: 500
    })

    const onSearchKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchKey = e.target.value
        fetch(searchKey)
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <PageHeader title="权限空间" description="可以在权限空间中创建角色、资源、管理权限，不同权限空间中的角色和资源相互独立。" rightRender={() => (
                <Button onClick={() => history.push('/admin/permission/spaces/create')}>
                    创建权限空间
                </Button>
            )} />

            <div className="flex-1 flex flex-col overflow-hidden gap-y-4 text-sm">
                <div className="bg-gray-100 p-2 rounded w-1/3 max-w-sm flex gap-x-2 items-center">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input className="flex-1 bg-transparent focus:outline-none placeholder:text-gray-400"
                        placeholder="搜索权限空间名称"
                        maxLength={100}
                        onChange={onSearchKeyChange} />
                </div>
                <Table<any> isLoading={loading}
                    showPagination={false}
                    items={data}
                    columns={[{
                        title: '空间名称',
                        dataIndex: 'displayName',
                        key: 'displayName',
                        render: (value, record) => (
                            <div className="flex gap-x-1 items-center">
                                <Link to={`/admin/permission/spaces/detail/${record.id}`}
                                    className="text-blue-600">
                                    {value}
                                </Link>
                                {record.isSystemBuiltIn &&
                                    <Badge variant="violet">系统内置</Badge>
                                }
                            </div>
                        )
                    }, {
                        title: '空间标识',
                        dataIndex: 'name',
                        key: 'name'
                    }, {
                        title: '描述',
                        dataIndex: 'description',
                        key: 'description',
                        width: 'w-80'
                    }, {
                        title: '操作',
                        dataIndex: 'id',
                        key: 'id',
                        width: 'w-20',
                        render: (value) => (
                            <div></div>
                        )
                    }]} />
            </div>
        </div>
    )
}
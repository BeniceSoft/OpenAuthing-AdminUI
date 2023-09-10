import { Table } from "@/components/Table"

export default () => {
    return (
        <div className="flex-1 overflow-hidden">
            <Table<any> columns={[{
                title: '导入时间', dataIndex: 'importTime', key: 'importTime'
            }, {
                title: '新建部门', dataIndex: 'newDepartmentsCount', key: 'newDepartmentsCount'
            }, {
                title: '新增成员', dataIndex: 'newMembersCount', key: 'newMembersCount'
            }, {
                title: '更新部门', dataIndex: 'updateDepartmentsCount', key: 'updateDepartmentsCount'
            }, {
                title: '更新成员', dataIndex: 'updateMembersCount', key: 'updateMembersCount'
            }, {
                title: '导入结果', dataIndex: 'result', key: 'result'
            }, {
                title: '操作', dataIndex: 'id', key: 'id'
            }]} />
        </div>
    )
}
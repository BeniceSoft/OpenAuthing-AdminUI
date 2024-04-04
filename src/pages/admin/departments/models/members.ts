import { DepartmentMember } from "@/@types/department";
import DepartmentService from "@/services/department.service"
import { useState } from "react"
import toast from "react-hot-toast";
import { useRequest } from "umi"

export default () => {

    const { loading: fetchMembersLoading, data: membersData, run: fetchMembers, mutate } = useRequest(
        (params: { pageIndex: number, pageSize: number, departmentId: string, onlyDirectUsers: boolean }) => DepartmentService.getDepartmentMembers(params),
        { manual: true, initialData: { totalCount: 0, items: [] } }
    );

    const { loading: setLeaderLoading, run: setLeader, } = useRequest(
        async (departmentId: string, userId: string, isLeader: boolean) => DepartmentService.setLeader({ departmentId, userId, isLeader }),
        {
            manual: true, onSuccess: (result, params) => {
                if (result) {
                    const isLeader = params[2]

                    toast.success(`已${isLeader ? '设为' : '取消'}部门负责人`);
                    mutate((x: { totalCount: number, items: DepartmentMember[] }) => {

                        const items = x.items.map(item => {
                            if (item.id === params[1]) {
                                item.isLeader = isLeader
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

    const { loading: setMainLoading, run: setMain, } = useRequest(
        async (departmentId: string, userId: string, isMain: boolean) => DepartmentService.setMain({ departmentId, userId, isMain }),
        {
            manual: true, onSuccess: (result, params) => {
                if (result) {
                    const isMain = params[2]
                    toast.success(`已${isMain ? '设为' : '取消'}主部门`);
                }
            },
        }
    )

    return {
        loading: fetchMembersLoading || setLeaderLoading || setMainLoading,
        membersData,
        fetchMembers,
        setLeader,
        setMain
    }
}
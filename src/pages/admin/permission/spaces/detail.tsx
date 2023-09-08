import Spin from "@/components/Spin"
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsNav, TabsTrigger } from "@/components/ui/tabs";
import PermissionSpaceService from "@/services/permission-space.service";
import { ArrowLeftIcon } from "lucide-react";
import { Suspense, lazy, useEffect } from "react";
import { history, useParams, useRequest } from "umi"

const BasicInfo = lazy(() => import('./components/BasicInfoTab'))
const RoleAndResource = lazy(() => import('./components/RoleAndResourceTab'))
const Authorization = lazy(() => import('./components/AuthorizationTab'))

export default () => {
    const { loading, data: space, run } = useRequest((id: string) => PermissionSpaceService.getDetail(id), {
        manual: true
    })

    const { id } = useParams()
    const fetch = () => id && run(id)
    useEffect(() => {
        fetch()
    }, [id])

    return (
        <div className="w-full">
            <Spin spinning={loading ?? false}>
                <div className="mb-2">
                    <span onClick={history.back}
                        className="cursor-pointer inline-flex items-center text-sm gap-x-1 text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <ArrowLeftIcon className="w-4 h-4" />
                        返回
                    </span>
                </div>
                {space &&
                    <>
                        <div className="flex gap-x-2 items-center mb-2">
                            <h1 className="text-xl font-semibold">
                                {space.displayName}
                            </h1>
                            {space.isSystemBuiltIn &&
                                <Badge variant="violet">系统内置</Badge>
                            }
                        </div>

                        <Tabs defaultValue="basic">
                            <TabsNav className="border-b mb-6">
                                <TabsTrigger value="basic">基础信息</TabsTrigger>
                                <TabsTrigger value="role-and-resource">角色和资源</TabsTrigger>
                                <TabsTrigger value="authorization">授权管理</TabsTrigger>
                            </TabsNav>
                            <Suspense fallback={<Spin spinning={true} />}>
                                <TabsContent value="basic">
                                    <BasicInfo id={id!} info={space} />
                                </TabsContent>
                                <TabsContent value="role-and-resource">
                                    <RoleAndResource />
                                </TabsContent>
                                <TabsContent value="authorization">
                                    <Authorization />
                                </TabsContent>
                            </Suspense>
                        </Tabs>
                    </>
                }
            </Spin>
        </div>
    )
}
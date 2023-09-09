import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import { Tabs, TabsContent, TabsNav, TabsTrigger } from "@/components/ui/tabs"
import { history } from "umi"
import { Suspense, lazy } from "react"
import Spin from "@/components/Spin"

const ResourceManagement = lazy(() => import("./resources/management"))

export default () => {
    return (
        <div className="w-full h-full flex flex-col">
            <PageHeader title="常规资源权限"
                description="常规资源权限用于管理你的业务系统中以 API 为代表的类型资源，你可以创建资源、定义操作，并将资源与操作授权给角色。"
                rightRender={() => (
                    <Button onClick={() => history.push('/admin/permission/general/resources/create')}>
                        创建常规资源
                    </Button>
                )} />

            <Tabs className="flex-1 flex flex-col overflow-hidden gap-y-4" defaultValue="management">
                <TabsNav className="border-b">
                    <TabsTrigger value="management">常规资源</TabsTrigger>
                    <TabsTrigger value="auth">授权管理</TabsTrigger>
                </TabsNav>
                <Suspense fallback={<Spin spinning={true} />}>
                    <TabsContent asChild value="management">
                        <ResourceManagement />
                    </TabsContent>
                    <TabsContent asChild value="auth">
                        auth
                    </TabsContent>
                </Suspense>
            </Tabs>
        </div>
    )
}
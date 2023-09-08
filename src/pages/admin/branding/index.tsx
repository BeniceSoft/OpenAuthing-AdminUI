import { Tabs, TabsContent, TabsNav, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/PageHeader"
import { Suspense } from "react"
import Spin from "@/components/Spin"
import React from "react"

const GlobalStylingSetting = React.lazy(() => import('./components/GlobalStylingSetting'))
const LoginPageStylingSetting = React.lazy(() => import('./components/LoginPageStylingSetting'))

export default () => {
    return (
        <div className="w-full h-full flex flex-col">
            <PageHeader title="品牌化"
                description="个性化配置系统，打造一个鲜明的品牌形象" />

            <Tabs className="flex-1 flex flex-col overflow-hidden gap-y-4" defaultValue="global">
                <TabsNav className="border-b">
                    <TabsTrigger value="global">全局配置</TabsTrigger>
                    <TabsTrigger value="login-page">登录页样式</TabsTrigger>
                </TabsNav>
                <Suspense fallback={<Spin spinning={true} />}>
                    <TabsContent asChild value="global">
                        <GlobalStylingSetting />
                    </TabsContent>
                    <TabsContent asChild value="login-page">
                        <LoginPageStylingSetting />
                    </TabsContent>
                </Suspense>
            </Tabs>
        </div>
    )
}
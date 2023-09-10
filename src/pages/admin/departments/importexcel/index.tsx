import Spin from "@/components/Spin"
import { Tabs, TabsContent, TabsNav, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon } from "lucide-react"
import { Suspense, lazy } from "react"
import { history } from 'umi'

const ImportTab = lazy(() => import('./components/ImportTab'))
const HistoryTab = lazy(() => import('./components/HistoryTab'))

export default () => {
    return (
        <div className="w-full h-full flex flex-col">
            <Spin spinning={false}>
                <div className="mb-2">
                    <span onClick={history.back}
                        className="cursor-pointer inline-flex items-center text-sm gap-x-1 text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <ArrowLeftIcon className="w-4 h-4" />
                        返回
                    </span>
                </div>
                <div className="flex gap-x-2 items-center mb-4">
                    <h1 className="text-xl font-semibold">
                        Excel 导入
                    </h1>
                </div>
                <main className="flex-1 overflow-hidden">
                    <Tabs className="h-full overflow-hidden flex flex-col" defaultValue="import">
                        <TabsNav className="border-b mb-4">
                            <TabsTrigger value="import">导入部门及成员</TabsTrigger>
                            <TabsTrigger value="history">历史记录</TabsTrigger>
                        </TabsNav>
                        <Suspense fallback={<Spin spinning={true} />}>
                            <TabsContent value="import">
                                <ImportTab />
                            </TabsContent>
                            <TabsContent asChild value="history">
                                <HistoryTab />
                            </TabsContent>
                        </Suspense>
                    </Tabs>
                </main>
            </Spin>
        </div>
    )
}
import Spin from "@/components/Spin"
import { Tabs, TabsContent, TabsNav, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon } from "lucide-react"
import { Suspense } from "react"
import { useParams } from "umi"

export default () => {

    const { id } = useParams()

    return (
        <div className="w-full">
            <Spin spinning={false}>
                <div className="mb-2">
                    <span onClick={history.back}
                        className="cursor-pointer inline-flex items-center text-sm gap-x-1 text-gray-400 hover:text-blue-600 transition-colors duration-300">
                        <ArrowLeftIcon className="w-4 h-4" />
                        返回
                    </span>
                </div>
                <>
                    <div className="flex gap-x-2 items-center mb-2">
                        <h1 className="text-xl font-semibold">
                            asdgdsgds
                        </h1>
                    </div>

                    <Tabs defaultValue="basic">
                        <TabsNav className="border-b mb-6">
                            <TabsTrigger value="basic">基础信息</TabsTrigger>
                            <TabsTrigger value="rule">授权规则</TabsTrigger>
                        </TabsNav>
                        <Suspense fallback={<Spin spinning={true} />}>
                            <TabsContent value="basic">
                                sdfdsf
                            </TabsContent>
                            <TabsContent value="rule">
                                fdgfdgf
                            </TabsContent>
                        </Suspense>
                    </Tabs>
                </>

            </Spin>
        </div>
    )
}
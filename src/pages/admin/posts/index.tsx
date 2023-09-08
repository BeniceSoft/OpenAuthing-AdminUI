import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"

export default () => {
    return (
        <div className="w-full h-full flex flex-col">
            <PageHeader title="岗位管理" description="员工岗位的统一管理，以帮助准确快速地在用户列表中维护员工任职信息。" rightRender={() => (
                <Button>
                    创建岗位
                </Button>
            )} />
        </div>
    )
}
import { Button } from "@/components/ui/button"
import { FileDownIcon, FileUpIcon } from "lucide-react"

export default () => {
    return (
        <div className="text-sm grid gap-y-8">
            <div className="">
                <h2 className="mb-4 text-gray-600">1. 下载模版</h2>
                <div className="">
                    <Button variant="secondary" className="rounded-sm bg-secondary/50 gap-x-1">
                        <FileDownIcon className="w-4 h-4" />
                        下载组织机构 Excel 部门及成员表
                    </Button>
                    <p className="mt-2 text-xs text-gray-400">
                        按格式修改导入。部门及成员表的主要功能为导入成员、编辑成员的账号信息、编辑成员与组织机构的关系等。
                    </p>
                </div>
            </div>
            <div className="">
                <h2 className="mb-4 text-gray-600">2. 上传文件<i className="text-destructive">*</i></h2>
                <div className="">
                    <div className="border border-gray-300 rounded border-dashed box-border w-80 h-28 flex flex-col gap-y-2 items-center justify-center cursor-pointer transition-colors hover:bg-secondary/50">
                        <FileUpIcon className="w-4 h-4" />
                        <p className="text-xs text-gray-400">
                            <span className="text-primary">拖拽文件</span>到此处或<span className="text-primary">点击此处</span>上传文件
                        </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                        执行导入前将对表中所有数据做整体校验，请保证表中每一条都符合规范，否则将会导入失败。
                    </p>
                </div>
            </div>
            <div>
                <Button disabled={true}>导入</Button>
            </div>
        </div>
    )
}
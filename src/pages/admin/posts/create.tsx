import Spin from "@/components/Spin"
import { Button } from "@/components/ui/button"
import { Input, InputLabel } from "@/components/ui/input"
import { ArrowLeftIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { history } from 'umi'

export default () => {
    const { register } = useForm()

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
                <div className="mb-4">
                    <h1 className="text-xl font-semibold mb-3">创建岗位</h1>
                </div>
                <main>
                    <form className="w-1/2 flex flex-col gap-y-4">
                        <InputLabel text="岗位名称" required>
                            <Input type="text" variant="solid"
                                placeholder="请输入岗位名称" />
                        </InputLabel>
                        <InputLabel text="岗位标识" required>
                            <Input type="text" variant="solid"
                                placeholder="请输入岗位标识" />
                        </InputLabel>
                        <InputLabel text="岗位描述" required>
                            <textarea rows={1} maxLength={200}
                                className="border-gray-200 rounded bg-gray-100 w-full max-h-40 min-h-[38px] dark:bg-gray-700 text-sm transition duration-300 aria-invalid:ring-red-500 disabled:cursor-not-allowed focus:bg-white"
                                // aria-invalid={errors.description ? 'true' : 'false'}
                                placeholder="请输入岗位描述"
                                {...register('description')} />
                        </InputLabel>
                        <div className="flex gap-x-4">
                            <Button>创建</Button>
                            <Button variant="secondary">取消</Button>
                        </div>
                    </form>
                </main>
            </Spin>
        </div>
    )
}
import { Button } from "@/components/ui/button"
import { Input, InputLabel } from "@/components/ui/input"
import PermissionSpaceService from "@/services/permission-space.service"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { history, useRequest } from "umi"

export default () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' })
    const { run, loading } = useRequest((req: any) => PermissionSpaceService.create(req), {
        manual: true
    })

    const onValid = async (value: any) => {
        const id = await run(value)
        if (id) {
            toast.success('创建成功')
            history.replace(`/admin/permission/spaces/detail/${id}`)
        }
    }

    return (
        <div className="w-full">
            <div className="mb-2">
                <span onClick={history.back}
                    className="cursor-pointer inline-flex items-center text-sm gap-x-1 text-gray-400 hover:text-blue-600 transition-colors duration-300">
                    <ArrowLeft className="w-4 h-4" />
                    返回
                </span>
            </div>
            <div className="mb-4">
                <h1 className="text-xl font-semibold">创建权限空间</h1>
            </div>
            <main className="grid grid-cols-2">
                <form onSubmit={handleSubmit(onValid)}>
                    <div className="max-w-2xl flex flex-col gap-y-4">
                        <InputLabel text="空间名称" required>
                            <Input type="text" variant="solid" placeholder="请输入空间名称"
                                invalid={!!errors.displayName}
                                {...register("displayName", { required: true })} />
                        </InputLabel>
                        <InputLabel text="空间标识" required>
                            <Input type="text" variant="solid" placeholder="请输入空间标识"
                                invalid={!!errors.name}
                                {...register("name", { required: true })} />
                        </InputLabel>
                        <InputLabel text="空间描述">
                            <textarea rows={4} maxLength={200}
                                className="w-full border-none rounded max-h-40 min-h-[50px] bg-gray-100 dark:bg-gray-700 text-sm transition duration-300 focus:bg-transparent focus:ring-1 aria-invalid:ring-red-500"
                                placeholder="请输入空间描述"
                                {...register("description")} />
                        </InputLabel>

                        <div className="mt-4 flex gap-x-4">
                            <Button aria-disabled={loading} variant="default" type="submit" disabled={!isValid}>确定</Button>
                            <Button aria-disabled={loading} variant="secondary" type="button" onClick={history.back}>取消</Button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
}
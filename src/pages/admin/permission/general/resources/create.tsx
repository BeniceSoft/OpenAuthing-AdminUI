import { confirm } from "@/components/Modal/ConfirmModal"
import PermissionSpaceSelect from "@/components/PermissionSpaceSelect"
import { Button } from "@/components/ui/button"
import { Input, InputErrorMessage, InputLabel } from "@/components/ui/input"
import { ArrowLeftIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { history, useRequest } from 'umi'
import ActionListInput from "./components/ActionListInput"
import GeneralResourceService from "@/services/general-resource.service"
import toast from "react-hot-toast"

export default () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm()
    const { loading, run } = useRequest((data: any) => GeneralResourceService.create(data), { manual: true })

    const onCancel = () => {
        confirm({
            title: '确定离开此页面？',
            content: '本次修改未保存，确定离开？',
            onOK: () => history.back(),
            okButton: {
                text: '确定离开',
                className: 'bg-secondary text-secondary-foreground'
            },
            closeButton: {
                text: '继续配置',
                className: 'bg-primary text-primary-foreground',
            }
        })
    }

    const handleCreate = async (value: any) => {
        const id = await run(value)
        if (id) {
            toast.success('创建成功')
            history.replace(`/admin/permission/general/resources/detail/${id}`)
        }
    }

    return (
        <div className="w-full">
            <div className="mb-2">
                <span onClick={onCancel}
                    className="cursor-pointer inline-flex items-center text-sm gap-x-1 text-gray-400 hover:text-blue-600 transition-colors duration-300">
                    <ArrowLeftIcon className="w-4 h-4" />
                    返回
                </span>
            </div>
            <div className="mb-7 flex items-center gap-x-1">
                <h1 className="text-xl font-semibold">创建常规资源</h1>
            </div>
            <main className="w-full flex flex-col gap-y-6 mt-4">
                <form onSubmit={handleSubmit(handleCreate)}
                    className="md:w-1/2 flex flex-col gap-y-6">
                    <InputLabel text="资源名称" required>
                        <Input type="text" variant="solid"
                            placeholder="请输入资源名称"
                            invalid={!!errors.name}
                            {...register("name", { required: true })} />
                        {errors.name &&
                            <InputErrorMessage message="请输入资源名称" />
                        }
                    </InputLabel>
                    <InputLabel text="资源标识" required>
                        <Input type="text" variant="solid"
                            placeholder="请输入资源标识"
                            invalid={!!errors.code}
                            {...register("code", { required: true })} />
                        {errors.code &&
                            <InputErrorMessage message="请输入资源标识" />
                        }
                    </InputLabel>
                    <InputLabel text="权限空间" required>
                        <Controller name="premissionSpaceId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <PermissionSpaceSelect invalid={!!errors.premissionSpaceId} {...field} />
                            )} />
                        {errors.premissionSpaceId &&
                            <InputErrorMessage message="请选择权限空间" />
                        }
                    </InputLabel>
                    <InputLabel text="资源路径" required>
                        <Input type="text" variant="solid"
                            placeholder="请输入用于标识访问资源的路径，例如：/api/v1/users"
                            invalid={!!errors.path}
                            {...register("path", { required: true })} />
                        {errors.path &&
                            <InputErrorMessage message="请输入资源路径" />
                        }
                    </InputLabel>
                    <InputLabel text="资源描述">
                        <textarea rows={3}
                            placeholder="请输入资源描述"
                            className="min-h-[38px] max-h-32 border-gray-200 ring-0 bg-gray-100 rounded text-sm w-full focus:bg-white focus:border-primary" />
                    </InputLabel>
                    <InputLabel text="资源操作">
                        <Controller name="actions"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <ActionListInput {...field} />
                            )} />
                    </InputLabel>

                    <div className="flex gap-x-4">
                        <Button type="submit">创建</Button>
                        <Button variant="secondary" type="button" onClick={onCancel}>取消</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
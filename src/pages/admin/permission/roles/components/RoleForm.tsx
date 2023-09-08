import PermissionSpaceSelect from "@/components/PermissionSpaceSelect"
import { Input, InputErrorMessage, InputLabel } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"

export interface RoleFormProps {
    initValue?: any
    isBusy?: boolean
    disabled?: boolean
    isEdit?: boolean
    onSubmit?: (value: any) => Promise<void>
}

const RoleForm = ({
    initValue,
    isBusy = false,
    disabled = false,
    isEdit = false,
    onSubmit
}: RoleFormProps) => {
    const { handleSubmit, register, formState: { errors }, control } = useForm({ values: initValue })

    const onValid = async (value: any) => {
        onSubmit && await onSubmit(value)
    }

    return (
        <form onSubmit={handleSubmit(onValid)}>
            <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                <InputLabel text="角色显示名" required>
                    <Input type="text" variant="solid"
                        disabled={disabled || isBusy}
                        invalid={!!errors.displayName}
                        placeholder="请输入角色显示名"
                        {...register('displayName', { required: true })} />
                    {errors.displayName &&
                        <InputErrorMessage message="请输入「角色显示名」" />
                    }
                </InputLabel>
                <InputLabel text="角色名" required>
                    <Input type="text"
                        variant="solid"
                        disabled={disabled || isBusy}
                        invalid={!!errors.name}
                        placeholder="请输入角色名"
                        {...register('name', { required: true })} />
                    {errors.name &&
                        <InputErrorMessage message="请输入「角色名」" />
                    }
                </InputLabel>
                <InputLabel text="权限空间" required>
                    <Controller name="permissionSpaceId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PermissionSpaceSelect disabled={disabled || isBusy || isEdit}
                                invalid={!!errors.permissionSpaceId}
                                {...field} />
                        )} />
                    {errors.permissionSpaceId &&
                        <InputErrorMessage message="请选择权限空间" />
                    }
                </InputLabel>
                <InputLabel text="描述">
                    <textarea rows={1} maxLength={200}
                        disabled={disabled || isBusy}
                        className="border-gray-200 rounded bg-gray-100 w-full max-h-40 min-h-[38px] dark:bg-gray-700 text-sm transition duration-300 aria-invalid:ring-red-500 disabled:cursor-not-allowed focus:bg-white"
                        aria-invalid={errors.description ? 'true' : 'false'}
                        placeholder="请输入描述"
                        {...register('description')} />
                </InputLabel>
            </div>
            <div className="mt-6">
                <button type="submit"
                    disabled={disabled || isBusy}
                    className="rounded bg-blue-600 text-white py-1.5 px-6 text-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
                    {!disabled && isBusy ?
                        <span className="flex gap-x-1 items-center">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            保存中
                        </span>
                        : '保存'}
                </button>
            </div>
        </form>
    )
}

export default RoleForm
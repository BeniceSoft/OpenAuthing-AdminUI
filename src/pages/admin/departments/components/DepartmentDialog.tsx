import DepartmentSelect from "@/components/DepartmentSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, InputLabel } from "@/components/ui/input";
import { forwardRef, useImperativeHandle, useState } from "react"
import { useForm } from "react-hook-form"

interface DepartmentDialogRefProps {
    isProcessing?: boolean,
    onConfirm?: (actionType: 'create' | 'update', value: any) => Promise<boolean>;
}

const ACTION_TEXTS = {
    'update': { title: '编辑', btn: '保存' },
    'create': { title: '新建', btn: '确认' },
}

export type DepartmentDialogRef = {
    open: (action: 'update' | 'create', data?: any) => void,
    close: () => void
}

const DepartmentDialog = forwardRef<DepartmentDialogRef, DepartmentDialogRefProps>(({
    isProcessing,
    onConfirm
}, ref) => {
    const [isOpen, setOpen] = useState<boolean>(false)
    const [actionType, setActionType] = useState<'create' | 'update'>('create')

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useImperativeHandle(ref, () => ({
        open: (action: 'update' | 'create', data?: any) => {
            if (isOpen) return

            setActionType(action)
            reset(data)
            setOpen(true)
        },
        close: () => {
            reset()
            setOpen(false)
        }
    }), [])

    const onSubmit = async (value: any) => {
        if (onConfirm && await onConfirm(actionType, value)) {
            reset()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {ACTION_TEXTS[actionType].title}部门
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register('id')} />
                    <div>
                        <div className="flex flex-col gap-y-6 w-80">
                            <InputLabel text="上级部门">
                                <DepartmentSelect />
                            </InputLabel>
                            <InputLabel text="部门名称" required>
                                <Input type="text"
                                    placeholder="请输入部门名称"
                                    disabled={isProcessing}
                                    aria-invalid={errors.name ? 'true' : 'false'}
                                    {...register('name', { required: true })} />
                            </InputLabel>
                            <InputLabel text="部门标识">
                                <Input type="text"
                                    placeholder="请输入部门标识"
                                    disabled={isProcessing}
                                    aria-invalid={errors.code ? 'true' : 'false'}
                                    {...register('code', { required: false })} />
                            </InputLabel>
                            <InputLabel text="部门描述">
                                <textarea
                                    className="w-full border-none rounded bg-gray-100 dark:bg-gray-700 text-sm focus:bg-white transition duration-300 placeholder:text-gray-300"
                                    placeholder="请输入部门描述"
                                    disabled={isProcessing}
                                    {...register('description')} />
                            </InputLabel>
                        </div>
                    </div>
                    <DialogFooter className="pt-8">
                        <DialogClose asChild={true}>
                            <Button variant="secondary"
                                disabled={isProcessing}>
                                取消
                            </Button>
                        </DialogClose>

                        <Button type="submit"
                            disabled={isProcessing}>
                            {ACTION_TEXTS[actionType].btn}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
})


export default DepartmentDialog
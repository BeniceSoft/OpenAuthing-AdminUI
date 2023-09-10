import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, InputLabel } from "@/components/ui/input";
import { Fragment, forwardRef, useEffect, useImperativeHandle, useState } from "react"
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
    const [isOpen, setOpen] = useState(false)
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
                        {ACTION_TEXTS[actionType].title}组织
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register('id')} />
                    <div>
                        <div className="flex flex-col gap-y-8 w-full">
                            <InputLabel text="组织名称" required>
                                <Input type="text"
                                    placeholder="请输入组织名称"
                                    disabled={isProcessing}
                                    aria-invalid={errors.name ? 'true' : 'false'}
                                    {...register('name', { required: true })} />
                            </InputLabel>
                            <InputLabel text="组织标识" required>
                                <Input type="text"
                                    placeholder="请输入组织标识"
                                    disabled={isProcessing}
                                    aria-invalid={errors.code ? 'true' : 'false'}
                                    {...register('code', { required: true })} />
                            </InputLabel>
                            <InputLabel text="组织描述">
                                <textarea
                                    className="w-full border-none rounded bg-gray-100 dark:bg-gray-700 text-sm focus:bg-white transition duration-300 placeholder:text-gray-300"
                                    placeholder="请输入组织描述"
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { debounce } from "lodash";
import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { forwardRef, useCallback } from "react";

type Action = {
    code?: string
    description?: string
}

type Props = {
    value?: Action[],
    onChange: (value?: any) => void
}

export default forwardRef<any, Props>((props, _) => {
    const {
        value: items = [],
        onChange
    } = props

    const debounceChange = useCallback(debounce(onChange, 300), [])

    const onAddItem = () => {
        const newItems = items.concat([{}])
        onChange(newItems)
    }

    const onRemoveItem = (index: number) => {
        const filteredItems = items.filter((_, i) => i !== index)
        onChange(filteredItems)
    }

    const onUpdateItem = (name: string, value: string, index: number) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    [name]: value
                }
            }
            return item
        })

        debounceChange(newItems)
    }

    return (
        <div className="">
            <div className="flex flex-col gap-y-2 mb-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-x-1">
                        <div className="flex-1 grid grid-cols-5 gap-x-2">
                            <Input variant="solid" type="text" className="col-span-2"
                                placeholder="动作，例如：read"
                                defaultValue={item.code}
                                onChange={e => onUpdateItem("code", e.target.value, index)} />
                            <Input variant="solid" type="text" className="col-span-3"
                                placeholder="描述，例如：读取用户信息"
                                defaultValue={item.description}
                                onChange={e => onUpdateItem("description", e.target.value, index)} />
                        </div>
                        <Button variant="ghost" type="button"
                            onClick={() => onRemoveItem(index)}>
                            <MinusCircleIcon className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div>
                <div className="bg-secondary/50 text-secondary-foreground inline-flex gap-x-1 rounded items-center px-2 py-1.5 cursor-pointer transition-colors hover:bg-secondary"
                    onClick={onAddItem}>
                    <PlusIcon className="w-4 h-4" />
                    <span>添加操作</span>
                </div>
            </div>
        </div>
    )
})
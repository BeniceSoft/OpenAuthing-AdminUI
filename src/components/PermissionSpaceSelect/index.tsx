import PermissionSpaceService from "@/services/permission-space.service";
import { forwardRef } from "react";
import { useRequest } from "umi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

type Props = {
    invalid?: boolean
    disabled?: boolean
    value?: any
    onChange?: (value: any) => void
}


export default forwardRef<any, Props>(({ invalid, disabled, value, onChange }, _) => {
    const { loading, data } = useRequest(() => PermissionSpaceService.getAll({}))

    const onValueChange = (value: string) => {
        onChange && onChange(value)
    }

    return (
        <div className="max-w-full">
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger disabled={disabled}
                    className={cn(
                        "bg-gray-100 ring-primary border-gray-200 h-[38px] max-w-full focus:bg-white",
                        invalid ? "border-destructive" : "border-gray-200")}>
                    <SelectValue placeholder={<span className="text-gray-400">请选择权限空间</span>} />
                </SelectTrigger>
                <SelectContent className="overflow-hidden">
                    <div className="max-h-80 overflow-auto">
                        {data?.length && data.map((item: any) => (
                            <SelectItem key={item.id} value={item.id}>
                                <span className="truncate ...">
                                    <span>{item.displayName}</span>
                                    <span className="text-gray-400 ml-1 text-xs">({item.name})</span>
                                </span>
                            </SelectItem>
                        ))}
                    </div>
                </SelectContent>
            </Select>
        </div>
    )
})
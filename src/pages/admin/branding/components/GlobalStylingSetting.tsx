import { Input, InputLabel } from "@/components/ui/input"
import { forwardRef } from "react"
import { useForm } from "react-hook-form"

export default forwardRef(({ }, _) => {
    const { register } = useForm()

    return (
        <form>
            <div className="w-1/2">
                <div>
                </div>
                <InputLabel text="品牌名" className="flex items-center gap-x-4">
                    <Input type="text"
                        {...register("brandName")} />
                </InputLabel>
            </div>
        </form>
    )
})
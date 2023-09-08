import { Button } from "@/components/ui/button"
import { Input, InputLabel } from "@/components/ui/input"
import { useForm } from "react-hook-form"

type Props = {
    id: string
    info: {
        displayName: string,
        name: string,
        description: string | null
    }
}

export default ({ info }: Props) => {
    const { register, handleSubmit, formState: { } } = useForm({ values: info })

    const onUpdate = () => { }

    return (
        <form onSubmit={handleSubmit(onUpdate)}>
            <div className="grid grid-cols-2 gap-y-6 gap-x-16">
                <InputLabel text="空间名称" required>
                    <Input type="text"
                        variant="solid"
                        disabled={true}
                        {...register("displayName")} />
                </InputLabel>

                <InputLabel text="空间标识" required>
                    <Input type="text"
                        variant="solid"
                        disabled={true}
                        {...register("name")}
                    />
                </InputLabel>

                <InputLabel text="空间描述">
                    <Input type="text"
                        variant="solid"
                        {...register("description")}
                    />
                </InputLabel>
            </div>

            <div className="mt-6">
                <Button type="submit">保存</Button>
            </div>
        </form>
    )
}
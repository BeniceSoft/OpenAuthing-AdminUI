import PageHeader from "@/components/PageHeader"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { MailIcon, MessageSquareIcon, SquareAsteriskIcon } from "lucide-react"
import React from "react"

type MfaMethodItemProps = {
    title: string,
    description: string,
    icon: React.ReactNode,
    iconContainerClassname?: string,
}

const MfaMethodItem = ({
    title,
    description,
    icon,
    iconContainerClassname
}: MfaMethodItemProps) => {
    return (
        <div className="h-28 w-full p-7 bg-gray-100/80">
            <div className="flex gap-x-4 text-sm">
                <div className={cn("w-14 h-14 flex items-center justify-center rounded", iconContainerClassname)}>
                    {icon}
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                    <h2 className="font-bold">{title}</h2>
                    <p className="text-gray-500">{description}</p>
                </div>
                <div className="flex items-center">
                    <Switch />
                </div>
            </div>
        </div>
    )
}

const MfaMethods = [{
    title: '短信验证码',
    description: '使用短信形式接收验证码认证登录',
    icon: <MessageSquareIcon className="w-6 h-6" />,
    iconContainerClassname: 'bg-primary text-primary-foreground'
}, {
    title: '电子邮箱验证',
    description: '使用邮件形式接收验证码认证登录',
    icon: <MailIcon className="w-6 h-6" />,
    iconContainerClassname: 'bg-violet-600 text-white'
}, {
    title: 'OTP 口令',
    description: '使用 OTP 一次性口令密码认证登录',
    icon: <SquareAsteriskIcon className="w-6 h-6" />,
    iconContainerClassname: 'bg-green-600 text-white'
}]

export default () => {
    return (
        <div className="w-full h-full flex flex-col">
            <PageHeader title="多因素认证" description="配置除用户名和密码之外的第二次身份验证，加强用户账号安全。" />

            <div className="mt-4 grid grid-cols-2 gap-6">
                {MfaMethods.map((item, index) => (
                    <MfaMethodItem key={index} {...item} />
                ))}
            </div>
        </div>
    )
}
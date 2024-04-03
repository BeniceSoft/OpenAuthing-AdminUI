import greetImg from '@/assets/images/greet-bg.png'
import StartStep from "./components/StartStep"
import { Link, useModel } from 'umi'
import { HelpCircle, Sun, Sparkles, Sunrise, Sunset, MoonStar, LineChartIcon } from 'lucide-react'
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useOidcUser } from '@axa-fr/react-oidc'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'

const GreetingIcon = () => {
    const hour = dayjs().hour()

    const className = "w-8 h-8";


    if (hour >= 6 && hour <= 8) {
        return <Sunrise className={cn("stroke-orange-500 fill-orange-400", className)} />
    }

    if (hour > 8 && hour < 18) {
        return <Sun className={cn("stroke-orange-700 fill-orange-600", className)} />;
    }

    if (hour >= 18 && hour <= 20) {
        return <Sunset className={cn("stroke-amber-800 fill-amber-500", className)} />
    }


    return <MoonStar className={cn("stroke-blue-800 fill-blue-600", className)} />

}

const StartSteps = [{
    title: '设置登录页',
    description: '品牌化登录界面',
    linkText: '去设置',
    redirectTo: '/admin/branding',
    index: 1
}, {
    title: '维护组织',
    description: '管理组织部门结构、员工关系',
    linkText: '去维护',
    redirectTo: '/admin/org/departments',
    index: 2
}, {
    title: '添加角色',
    description: '设置用户角色以便管理权限',
    linkText: '去添加',
    redirectTo: '/admin/permission/roles',
    index: 3
}, {
    title: '体验登录',
    description: '完成设置后体验一下登录吧',
    linkText: '去体验',
    redirectTo: '/',
    index: 4
}]

const DashboardPage = () => {
    const { oidcUser } = useOidcUser()
    const { data } = useModel('admin.dashboard.dashboard')

    return (
        <div className="flex flex-col w-full gap-y-4 pt-16">
            <div className="w-full rounded-lg p-4 bg-blue-100 dark:bg-slate-800 flex relative">
                <div className="flex-1 flex flex-col gap-y-5">
                    <h1 className="text-2xl font-bold flex items-center gap-x-1">
                        <GreetingIcon />
                        欢迎使用
                    </h1>
                    <p className="pl-1 font-medium text-gray-600 tracking-wide">
                        Hi,&nbsp;
                        <span className="font-bold text-slate-700">
                            {oidcUser?.nickname ?? '管理员'}
                        </span>
                        <span className="ml-2 text-sm text-slate-500">
                            祝您工作愉快！
                        </span>
                    </p>
                </div>
                <div className="w-64 opacity-80">
                    <img src={greetImg} className="w-64 h-36 absolute bottom-4" />
                </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-50/80 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-gray-500 font-bold text-base flex items-center gap-x-1">
                        <Sparkles className="w-5 h-5 text-orange-400" />
                        快速开始使用
                    </h2>
                    <Link className="text-xs text-primary/50 flex items-center transition-all hover:text-primary"
                        to="/">
                        <HelpCircle className="w-3 h-3" />
                        更多帮助
                    </Link>
                </div>
                <div className="grid grid-cols-4 gap-x-4 h-24">
                    {StartSteps.map((step, index) => (
                        <StartStep key={index} {...step} />
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50/80 dark:bg-slate-800">
                <div className="mb-6">
                    <h2 className="text-gray-500 font-bold text-base flex items-center gap-x-1">
                        <LineChartIcon className="w-5 h-5 stroke-green-600" />
                        登录数据
                    </h2>
                </div>
                <div className="flex-1">
                    <ResponsiveContainer className="w-full h-96">
                        <LineChart data={data}>
                            <CartesianGrid stroke='#e3e3e3' vertical={false} />
                            <XAxis angle={-30} fontSize={12} tickLine={false} dataKey="date" />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} />
                            <Tooltip />
                            <Line dot={false} dataKey="登录人次" stroke="#8884d8" />
                            <Line dot={false} dataKey="登录人数" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
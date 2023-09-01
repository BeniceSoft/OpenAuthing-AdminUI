import { ChevronRight } from "lucide-react"
import React from "react"
import { Link } from "umi"

type StartStepProps = {
    title: string
    description: string
    redirectTo: string
    linkText: string
    index: number
}

const StartStep: React.FC<StartStepProps> = ({
    title, description, redirectTo, linkText, index
}) => {
    return (
        <div className="h-full max-h-full relative p-4 bg-blue-50/80 dark:bg-slate-900 rounded-md overflow-hidden group">
            <div className="flex flex-col items-start justify-between h-full">
                <div className="flex items-baseline gap-1 z-10">
                    <h2 className="text-base">{title}</h2>
                    <p className="text-xs text-gray-400">{description}</p>
                </div>
                <Link to={redirectTo} className="flex items-center text-xs text-primary">
                    <span className="relative after:content-[''] after:block after:bottom-0 after:left-0 after:w-0 after:transition-['width'] after:h-[1px] after:bg-primary group-hover:after:w-full">{linkText}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
            <i className="select-none text-9xl absolute text-blue-100/50 transition-colors group-hover:text-blue-200 top-0 right-4">{index}</i>
        </div>
    )
}

export default StartStep
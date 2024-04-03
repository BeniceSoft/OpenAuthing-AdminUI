import { PaginationValues } from "@/@types/pagination"
import Empty from "@/components/Empty"
import Pagination from "@/components/Pagination"
import classNames from "classnames"
import { Loader } from "lucide-react"
import React, { useEffect, useImperativeHandle, useState } from "react"

export interface ColumnType<TRecord> {
    title: string
    dataIndex: string
    key: string
    width?: string
    render?: (value: any | undefined, record: TRecord, index: number) => React.ReactNode
}

export interface TableProps<TRecord> {
    showPagination?: boolean
    isLoading?: boolean,
    totalCount?: number
    items?: TRecord[],
    columns: ColumnType<TRecord>[]
    emptyDescription?: React.ReactNode
    onPageChanged?: ({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) => Promise<void>
}

export type TableRef = {
    currentPagination: () => PaginationValues
    resetPagination: () => void
}

function Table<TRecord extends {}>({
    showPagination = true,
    isLoading = false,
    totalCount,
    items = [],
    columns,
    emptyDescription,
    onPageChanged
}: TableProps<TRecord>, ref?: React.ForwardedRef<TableRef>) {
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(20)

    useImperativeHandle(ref, () => ({
        currentPagination() {
            return new PaginationValues(pageIndex, pageSize)
        },
        resetPagination() {
            setPageIndex(1)
        }
    }), [])

    const handlePageChange = async (pageIndex: number, pageSize?: number) => {
        setPageIndex(pageIndex)

        try {
            onPageChanged && await onPageChanged({ pageIndex, pageSize: pageSize ?? 20 })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            <div className="flex-1 flex flex-col w-full text-sm overflow-x-auto overflow-y-hidden text-left text-gray-500 dark:text-gray-400">
                <div className="flex text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    {columns.map(({ key, title, width }) => (
                        <div key={key} className={classNames(
                            "px-1 py-2",
                            width ?? 'flex-1'
                        )}>
                            {title}
                        </div>
                    ))}
                </div>
                <div className="flex-1 overflow-auto">
                    <Empty isEmpty={items.length == 0} description={emptyDescription}>
                        <>
                            {items.map((item: any, rowIndex) => (
                                <div key={rowIndex} className="flex bg-white border-b items-center dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {columns.map(({ dataIndex, key, width, render }) => {
                                        const value = item[dataIndex]

                                        return (
                                            <div key={key} className={classNames(
                                                "px-1 py-3",
                                                width ?? 'flex-1'
                                            )}>
                                                {render ?
                                                    render(value, item, rowIndex) :
                                                    <span>
                                                        {value?.toString() ?? '-'}
                                                    </span>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </>
                    </Empty>
                </div>
            </div>
            {showPagination &&
                <div className="bg-white flex-initial pt-2 h-12 sticky bottom-0 flex justify-end dark:bg-gray-700 dark:text-gray-400">
                    <Pagination pageIndex={pageIndex} pageSize={pageSize} totalCount={totalCount ?? 0}
                        onPageChange={handlePageChange} />
                </div>
            }
            {isLoading &&
                <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-white/70 flex justify-center flex-col">
                    <div className="flex h-20 items-center justify-center gap-x-1">
                        <Loader className="w-5 h-5 animate-spin"/>
                        <span className="text-sm">正在加载数据...</span>
                    </div>
                </div>
            }
        </div>
    )
}

const ForwardedTable = React.forwardRef(Table) as <TRecord>(
    props: TableProps<TRecord> & { ref?: React.Ref<TableRef> }
) => React.ReactElement;

export { ForwardedTable as Table }; 
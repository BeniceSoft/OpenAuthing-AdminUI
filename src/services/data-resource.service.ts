import { request } from "@/lib/request"

const DataResourceService = {
    query: async (params: { searchKey?: string, pageIndex?: number, pageSize?: number }) => {
        const { data } = await request('/api/admin/dataresources', {
            method: 'GET',
            params
        })
        return data
    }
}

export default DataResourceService
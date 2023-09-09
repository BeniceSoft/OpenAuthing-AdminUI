import { request } from "@/lib/request"

const ApplicationService = {
    getAll: async (searchKey?: string) => {
        console.log(searchKey)
        const { data } = await request(`/api/applications?searchKey=${searchKey ?? ''}`)
        return data
    },

    create: async (application: any) => {

        const { data } = await request('/api/applications', {
            method: 'POST',
            data: application
        })
        return data
    }
}

export default ApplicationService
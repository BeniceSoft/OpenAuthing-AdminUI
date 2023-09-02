import { request } from "@/lib/request"

const ROOT_URL = "/api/admin/permissionspaces";

const PermissionSpaceService = {
    getPagedList: (params: any) => {
        return request(ROOT_URL, {
            params
        })
    },

    create: (req: any) => {
        return request(ROOT_URL, {
            method: 'POST',
            data: req
        })
    }
}

export default PermissionSpaceService
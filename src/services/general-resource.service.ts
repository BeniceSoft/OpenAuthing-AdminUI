import { request } from "@/lib/request"

const ROOT_URL = "/api/generalresources"

const GeneralResourceService = {
    create: (input: any) => {
        return request(ROOT_URL, {
            method: 'POST',
            data: input
        })
    }
}

export default GeneralResourceService
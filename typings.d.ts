import 'umi/typings';
import { OidcClient } from '@axa-fr/oidc-client'

declare global {

    interface QianKun {
        getOidc: (configurationName?: string) => OidcClient
    }

    interface Window {
        __POWERED_BY_QIANKUN__: boolean
        qiankun: QianKun
    }

    const SHOW_OIDC_LOGGING: boolean

    const OPEN_SOURCE_URL: string

    /**
     * AM Admin API 地址
     */
    const AM_ADMIN_API_BASE_URL: string

    const AM_ODIC_AUTHORITY: string
    const AM_ODIC_CLIENT_ID: string
    const AM_ODIC_CLIENT_SECRET: string

    /**
     * 用户信息页面 url
     */
    const AM_USER_PROFILE_URL: string
}
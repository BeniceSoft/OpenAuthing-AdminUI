import { OidcClient } from "@axa-fr/oidc-client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function enabledStatusDescription(enabled: boolean) {
    return enabled ? '启用' : '禁用'
}

export const getOidc = (configurationName?: string) => {
    return window.__POWERED_BY_QIANKUN__ ?
        window.qiankun.getOidc(configurationName)
        : OidcClient.get(configurationName)
}
import { Fetch, OidcConfiguration, OidcProvider } from '@axa-fr/react-oidc';
import { CustomHistory } from '@axa-fr/react-oidc/dist/core/routes/withRouter';
import { OidcClient, getFetchDefault } from '@axa-fr/oidc-client'
import OidcRoutes from '@axa-fr/react-oidc/dist/core/routes/OidcRoutes';
import { ComponentType, FC, PropsWithChildren, useEffect, useState } from 'react';
import CallBackSuccess from './CallBackSuccess';
import Authenticating from './Authenticating';
import AuthenticatingError from './AuthenticatingError';
import SessionLost from './SessionLost';


export type oidcContext = {
    (name?: string): OidcClient;
};

const defaultEventState = { name: '', data: null };

export type OidcProviderProps = {
    callbackSuccessComponent?: ComponentType<any>;
    sessionLostComponent?: ComponentType<any>;
    authenticatingComponent?: ComponentType<any>;
    authenticatingErrorComponent?: ComponentType<any>;
    loadingComponent?: ComponentType<any>;
    serviceWorkerNotSupportedComponent?: ComponentType<any>;
    configurationName?: string;
    configuration: OidcConfiguration;
    children: any;
    onSessionLost?: () => void;
    onLogoutFromAnotherTab?: () => void;
    onLogoutFromSameTab?: () => void;
    withCustomHistory?: () => CustomHistory;
    onEvent?: (configuration: string, name: string, data: any) => void;
    getFetch?: () => Fetch;
};

export type OidcSessionProps = {
    configurationName: string;
    loadingComponent: PropsWithChildren<any>;
};

const OidcSession: FC<PropsWithChildren<OidcSessionProps>> = ({ loadingComponent, children, configurationName }) => {
    const [isLoading, setIsLoading] = useState(true);
    const getOidc = OidcClient.get;
    const oidc = getOidc(configurationName);
    useEffect(() => {
        let isMounted = true;
        if (oidc) {
            oidc.tryKeepExistingSessionAsync().then(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });
        }
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [configurationName]);
    const LoadingComponent = loadingComponent;
    return (
        <>
            {isLoading
                ? (
                    <LoadingComponent configurationName={configurationName} />
                )
                : (
                    <>{children}</>
                )}
        </>
    );
};

const Switch = ({ isLoading, loadingComponent, children, configurationName }: any) => {
    const LoadingComponent = loadingComponent;
    if (isLoading) {
        return <LoadingComponent configurationName={configurationName}>{children}</LoadingComponent>;
    }
    return <>{children}</>;
};

export const QiankunOidcProvider: FC<PropsWithChildren<OidcProviderProps>> = (props) => {
    const {
        children,
        configuration,
        configurationName = 'default',
        getFetch
    } = props

    const getOidc = (configurationName = 'default') => {
        return window.__POWERED_BY_QIANKUN__ ?
            window.qiankun.getOidc(configurationName) :
            OidcClient.getOrCreate(getFetch ?? getFetchDefault)(configuration, configurationName);
    };

    if (window.__POWERED_BY_QIANKUN__) {
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <OidcProvider {...props} >
            {children}
        </OidcProvider>
    )
};

export default QiankunOidcProvider;

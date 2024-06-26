import Spin from '@/components/Spin';
import Authenticating from '@/components/oidc/Authenticating';
import AuthenticatingError from '@/components/oidc/AuthenticatingError';
import CallBackSuccess from '@/components/oidc/CallBackSuccess';
import SessionLostComponent from '@/components/oidc/SessionLost';
import { OidcConfiguration, OidcProvider, TokenRenewMode } from '@axa-fr/react-oidc';
import { OidcClient } from '@axa-fr/oidc-client'
import { Toaster, toast } from 'react-hot-toast';
import { Outlet } from 'umi';

const configuration: OidcConfiguration = {
  authority: ODIC_AUTHORITY,
  client_id: ODIC_CLIENT_ID,
  redirect_uri: window.location.origin + '/admin/login',
  silent_redirect_uri: window.location.origin + '/admin/silent-login',
  // silent_redirect_uri: window.location.origin + '/authentication/silent-callback', // Optional activate silent-signin that use cookies between OIDC server and client javascript to restore the session
  scope: 'openid profile phone roles offline_access',
  // service_worker_relative_url: '/OidcServiceWorker.js',
  service_worker_only: false,
  service_worker_convert_all_requests_to_cors: true,
  storage: localStorage,
  token_renew_mode: TokenRenewMode.access_token_invalid,
};

export default function Layout() {

  const handleOidcEvent = (configName: string, eventName: string, data: any) => {

    // SHOW_OIDC_LOGGING && console.log(`oidc:${configName}:${eventName}: ${JSON.stringify(data)}`)

    if (eventName === OidcClient.eventNames.refreshTokensAsync_end &&
      data.success) {
      toast.success('访问令牌刷新成功')
    }
  }

  return (
    <OidcProvider
      configuration={configuration}
      loadingComponent={Spin}
      authenticatingComponent={Authenticating}
      authenticatingErrorComponent={AuthenticatingError}
      callbackSuccessComponent={CallBackSuccess}
      sessionLostComponent={SessionLostComponent}
      onEvent={handleOidcEvent}>
      <Toaster />
      <Outlet />
    </OidcProvider>
  );
}

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import * as csv from 'csvtojson';
import { currency, locale } from 'locale-service';
import { phonecodes } from 'phonecodes';
import { alert, confirm } from 'ui-alert';
import { loading } from 'ui-loading';
import { resources as uiresources, UIService } from 'ui-plus';
import { toast } from 'ui-toast';
import { storage } from 'uione';
import { resources as vresources } from 'validation-core';
import { DefaultCsvService, resources } from 'web-clients';
import { resources as locales } from '@core/resources'
import { config } from '@service/config';
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import LayoutPage from '@core/layout'

let isInit = false;
export function init() {
  if (isInit) {
    return;
  }
  isInit = true;
  storage.setConfig(config);
  resources.csv = new DefaultCsvService(csv);
  resources.config = {
    list: 'list'
  };
  storage.navigator = global.navigator;
  if (storage.home == null || storage.home === undefined) {
    storage.home = '/home';
  }
  storage.home = '/home';
  // storage.token = getToken;
  storage.moment = true;
  storage.setResources(locales);
  storage.setLoadingService(loading);
  storage.setUIService(new UIService());
  storage.currency = currency;
  storage.locale = locale;
  storage.alert = alert;
  storage.confirm = confirm;
  storage.message = toast;

  const resource = storage.resource();
  vresources.phonecodes = phonecodes;
  uiresources.currency = currency;
  uiresources.resource = resource;
}
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps, router }: AppPropsWithLayout) {
  init()
  if (router.pathname.startsWith('/signin')
    || router.pathname.startsWith('/signin')
    || router.pathname.startsWith('/change-password')
    || router.pathname.startsWith('/reset-password')
    || router.pathname.startsWith('/forgot-password')
    || router.pathname.startsWith('/about')
    || router.pathname.startsWith('/authentication')) return (
      <>  <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
        <Component {...pageProps} />
      </>
    )
  else
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <LayoutPage>
          <Component {...pageProps} />
        </LayoutPage>
      </>
    )
}

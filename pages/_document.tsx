import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { init } from './_app'

export default function Document() {
    return (
        <Html>
            <Head >
                <meta charSet="utf-8" />
                <link rel="icon" href="./favicon.ico" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="description"
                    content="Web site created using create-react-app"
                />
                <link rel="apple-touch-icon" href="./logo192.png" />
                <link rel="manifest" href="./manifest.json" />
               
            </Head >
            <body className='full-header' id="sysBody" >
                <div id="sysToast" className="toast-message alert-success"></div>
                <div id="sysLoading" className="loader-wrapper" style={{ display: "none" }}>
                    <div className="loader-sign">
                        <div className="loader"></div>
                        {/* <!-- <div className="loader-text">Please wait</div> --> */}
                    </div>
                </div>
                <div id="sysAlert" className="alert-wrapper">
                    <div className="alert">
                        <div>
                            <div id="sysIcon" className="alert-icon"></div>
                            <h4 id="sysMessageHeader"></h4>
                            <p id="sysMessage"></p>
                        </div>
                        <footer>
                            <button type='button' className='btn-cancel' id='sysNo' name='btnCancel' />
                            <button type='submit' className='btn-accept' id='sysYes' name='btnAccept' />
                        </footer>
                    </div>
                </div>
                <script type="text/javascript" src="/static/script.js"></script>
               
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
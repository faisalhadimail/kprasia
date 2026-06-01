'use client'

import { useEffect } from 'react'

interface SEO {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  customHeadScript?: string
  customBodyScript?: string
}

export default function AnalyticsScripts() {
  useEffect(() => {
    // Fetch SEO data
    fetch('/api/seo')
      .then(res => res.json())
      .then((data: SEO) => {
        // Google Tag Manager (Head)
        if (data.googleTagManagerId) {
          const gtmScript = document.createElement('script')
          gtmScript.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${data.googleTagManagerId}');
          `
          document.head.appendChild(gtmScript)

          // GTM noscript
          const gtmNoscript = document.createElement('noscript')
          gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${data.googleTagManagerId}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          document.body.insertBefore(gtmNoscript, document.body.firstChild)
        }

        // Google Analytics 4
        if (data.googleAnalyticsId) {
          const gaScript = document.createElement('script')
          gaScript.async = true
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${data.googleAnalyticsId}`
          document.head.appendChild(gaScript)

          const gaConfig = document.createElement('script')
          gaConfig.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${data.googleAnalyticsId}');
          `
          document.head.appendChild(gaConfig)
        }

        // Facebook Pixel
        if (data.facebookPixelId) {
          const fbScript = document.createElement('script')
          fbScript.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${data.facebookPixelId}');
            fbq('track', 'PageView');
          `
          document.head.appendChild(fbScript)

          // FB Pixel noscript
          const fbNoscript = document.createElement('noscript')
          fbNoscript.innerHTML = `<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${data.facebookPixelId}&ev=PageView&noscript=1"/>`
          document.body.insertBefore(fbNoscript, document.body.firstChild)
        }

        // Custom Head Script
        if (data.customHeadScript) {
          const customHeadDiv = document.createElement('div')
          customHeadDiv.innerHTML = data.customHeadScript
          customHeadDiv.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.head.appendChild(newScript)
          })
          customHeadDiv.querySelectorAll('meta, link').forEach(el => {
            document.head.appendChild(el.cloneNode(true))
          })
        }

        // Custom Body Script
        if (data.customBodyScript) {
          const customBodyDiv = document.createElement('div')
          customBodyDiv.innerHTML = data.customBodyScript
          customBodyDiv.querySelectorAll('script').forEach(script => {
            const newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.body.appendChild(newScript)
          })
        }
      })
      .catch(err => console.error('Failed to load analytics:', err))
  }, [])

  return null
}
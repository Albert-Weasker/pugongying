'use client'

import Script from 'next/script'

export default function CloudflareAnalytics() {
  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "737e8638f7f548388ab0030bd7e28c51"}'
      strategy="afterInteractive"
    />
  )
}

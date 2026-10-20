declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
      push?: unknown;
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: unknown[]) => void;
    };
  }
}
export type PublicConfig = { whatsappNumber: string; gaId: string; metaPixelId: string };
export const consentKey = 'ecomlik-analytics-consent';
export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(consentKey) === 'accepted';
  } catch {
    return false;
  }
}
export function setAnalyticsConsent(accepted: boolean) {
  try {
    localStorage.setItem(consentKey, accepted ? 'accepted' : 'declined');
  } catch {
    /* A storage-restricted browser can still use the site. */
  }
}
export function track(event: string, properties: Record<string, string> = {}) {
  if (!hasAnalyticsConsent()) return;
  window.dataLayer ??= [];
  window.dataLayer.push({ event, ...properties });
  window.gtag?.('event', event, properties);
  if (event === 'lead_submit_success') window.fbq?.('track', 'Lead');
}
export function initializeAnalytics(config: PublicConfig) {
  if (!hasAnalyticsConsent()) return;
  if (config.gaId && !document.getElementById('ecomlik-ga')) {
    window.dataLayer ??= [];
    window.gtag = function () {
      window.dataLayer!.push(arguments as unknown as Record<string, unknown>);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.gaId, { send_page_view: false });
    const script = document.createElement('script');
    script.id = 'ecomlik-ga';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
    document.head.append(script);
  }
  if (config.metaPixelId && !document.getElementById('ecomlik-meta')) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    }) as NonNullable<Window['fbq']>;
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    const script = document.createElement('script');
    script.id = 'ecomlik-meta';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(script);
    window.fbq('init', config.metaPixelId);
    window.fbq('track', 'PageView');
  }
  track('page_view', { page: 'home' });
}

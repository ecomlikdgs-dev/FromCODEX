declare global {
  interface Window {
    dataLayer?: unknown[];
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
const recordedPageViews = new Set<string>();
let activeGaId = '';
let memoryConsent: boolean | undefined;

export function hasAnalyticsConsent() {
  if (memoryConsent !== undefined) return memoryConsent;
  try {
    return localStorage.getItem(consentKey) === 'accepted';
  } catch {
    return false;
  }
}
export function setAnalyticsConsent(accepted: boolean) {
  memoryConsent = accepted;
  try {
    localStorage.setItem(consentKey, accepted ? 'accepted' : 'declined');
  } catch {
    /* Consent remains effective for this visit if persistent storage is unavailable. */
  }
}
function pageContext() {
  const page = new URL(window.location.href);
  const safeQuery = new URLSearchParams();
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = page.searchParams.get(key);
    if (value) safeQuery.set(key, value.slice(0, 120));
  }
  page.search = safeQuery.toString();
  page.hash = '';
  let referrer = '';
  try {
    const source = new URL(document.referrer);
    if (source.protocol === 'https:' || source.protocol === 'http:')
      referrer = source.origin + source.pathname;
  } catch {
    /* A direct visit has no referrer. */
  }
  return {
    page_location: page.href,
    page_referrer: referrer,
    page_title: document.title,
    page_path: page.pathname,
  };
}

export function track(event: string, properties: Record<string, string> = {}) {
  if (!hasAnalyticsConsent()) return;
  window.dataLayer ??= [];
  window.dataLayer.push({ event, ...properties });
  const destination = activeGaId ? { send_to: activeGaId } : {};
  window.gtag?.('event', event, { ...properties, ...destination });
  if (event === 'lead_submit_success') {
    window.gtag?.('event', 'generate_lead', {
      form_id: 'ecomlik-academy',
      method: 'enrolment_request',
      ...destination,
    });
    window.fbq?.('track', 'Lead');
  }
}
export function initializeAnalytics(config: PublicConfig) {
  if (!hasAnalyticsConsent()) return;
  if (/^G-[A-Z0-9]+$/.test(config.gaId)) {
    window.dataLayer ??= [];
    window.gtag ??= function () {
      window.dataLayer!.push(arguments);
    };
    activeGaId = config.gaId;
    const existing = document.getElementById('ecomlik-ga') as HTMLScriptElement | null;
    if (!existing || existing.dataset.measurementId !== config.gaId) {
      existing?.remove();
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      window.gtag('js', new Date());
      window.gtag('config', config.gaId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...pageContext(),
      });
      const script = document.createElement('script');
      script.id = 'ecomlik-ga';
      script.dataset.measurementId = config.gaId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
      document.head.append(script);
    }
    const context = pageContext();
    const key = `${config.gaId}:${context.page_location}`;
    if (!recordedPageViews.has(key)) {
      window.gtag('event', 'page_view', { ...context, send_to: config.gaId });
      window.dataLayer.push({ event: 'ecomlik_page_view', page_path: context.page_path });
      recordedPageViews.add(key);
    }
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
}

import { business } from './content';
import type { PublicConfig } from './tracking';

export const usesNetlifyForms = import.meta.env.VITE_LEAD_PROVIDER === 'netlify';
export const netlifyFormName = 'ecomlik-academy';

export interface LeadRequest {
  submissionId: string;
  name: string;
  phone: string;
  country: string;
  experience: string;
  interest: string;
  consent: boolean;
  website: string;
  attribution: { source: string; medium: string; campaign: string };
}

export const defaultPublicConfig: PublicConfig = {
  whatsappNumber: business.whatsappNumber,
  gaId: business.gaId,
  metaPixelId: '',
};

export async function loadPublicConfig(): Promise<PublicConfig> {
  // Netlify serves the static bundle. Its form service replaces the Node API.
  if (usesNetlifyForms) return defaultPublicConfig;
  const response = await fetch('/api/config');
  if (!response.ok) throw new Error('Config unavailable');
  return response.json();
}

export async function submitEnquiry(lead: LeadRequest): Promise<void> {
  let response: Response;
  if (usesNetlifyForms) {
    const body = new URLSearchParams({
      'form-name': netlifyFormName,
      submission_id: lead.submissionId,
      name: lead.name,
      phone: lead.phone,
      country: lead.country,
      experience: lead.experience,
      interest: lead.interest,
      consent: String(lead.consent),
      contact_consent_at: new Date().toISOString(),
      course: business.courseName,
      price_mad: String(business.price),
      price_usd: String(business.priceUsd),
      utm_source: lead.attribution.source,
      utm_medium: lead.attribution.medium,
      utm_campaign: lead.attribution.campaign,
      page_path: window.location.pathname,
      website: lead.website,
    });
    response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: AbortSignal.timeout(15_000),
    });
  } else {
    response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(15_000),
    });
  }

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? 'وصلات بزاف ديال المحاولات. تسنّى دقيقة وعاود جرّب.'
        : response.status === 404 || response.status === 405
          ? 'خدمة التسجيل ما متوفراش دابا. تقدر ترسل نفس المعلومات مباشرة فواتساب.'
          : response.status >= 500
            ? 'وقع مشكل مؤقت فحفظ الطلب. المعلومات ديالك باقية هنا؛ عاود جرّب أو كمل فواتساب.'
            : 'ما تقبلش الطلب. راجع المعلومات وعاود جرّب، أو تواصل معانا فواتساب.',
    );
  }
  if (!usesNetlifyForms) {
    const result = await response.json();
    if (result.success !== true) throw new Error('ما تأكّدش حفظ الطلب. عاود جرّب.');
  }
}

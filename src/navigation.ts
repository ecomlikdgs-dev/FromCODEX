const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

export function isOrderPage() {
  return window.location.pathname.replace(/\/+$/, '') === '/order';
}

export function orderHref() {
  if (isOrderPage()) return '#join';
  const current = new URLSearchParams(window.location.search);
  const campaign = new URLSearchParams();
  for (const key of campaignKeys) {
    const value = current.get(key);
    if (value) campaign.set(key, value.slice(0, 120));
  }
  return `/order${campaign.size ? `?${campaign}` : ''}`;
}

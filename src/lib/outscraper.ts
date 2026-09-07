/**
 * Outscraper B2B Lead Generator Service
 * Google Maps üzerinden potansiyel spor salonlarını arama, normalize etme ve işleme servisi
 */

export interface ScrapedBusinessLead {
  name: string;
  phone?: string | null;
  phoneNormalized?: string | null;
  address?: string | null;
  rating?: number | null;
  reviews?: number | null;
  website?: string | null;
  websiteDomain?: string | null;
  instagram?: string | null;
  googleMapsUrl?: string | null;
  placeId?: string | null;
  searchQuery?: string | null;
}

/**
 * Google Maps URL'si girilmişse search query'yi çıkarır; normal text ise doğrudan kullanır.
 * Desteklenen formatlar:
 * - https://www.google.com/maps/search/spor+salonları+mersin/
 * - https://www.google.com/maps/search/spor+salonlar%C4%B1+mersin/@36.8,34.6,12z
 * - https://maps.google.com/?q=mersin+gym
 * - google.com/maps/search/fitness+izmir
 * - Mersin spor salonları
 */
export function extractSearchQuery(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.includes('google.com/maps') ||
    trimmed.includes('maps.google.')
  ) {
    try {
      const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const url = new URL(urlString);

      // Path pattern: /maps/search/QUERY/
      const searchMatch = url.pathname.match(/\/maps\/search\/([^/@?]+)/i);
      if (searchMatch && searchMatch[1]) {
        let q = decodeURIComponent(searchMatch[1]);
        q = q.replace(/\+/g, ' ').replace(/\/$/, '').trim();
        if (q) return q;
      }

      // Query param pattern: ?q=QUERY or ?query=QUERY
      const queryParam = url.searchParams.get('query') || url.searchParams.get('q');
      if (queryParam) {
        let q = decodeURIComponent(queryParam);
        q = q.replace(/\+/g, ' ').trim();
        if (q) return q;
      }
    } catch {
      // Fallback regex if URL parsing encounters atypical structure
      const match = trimmed.match(/\/maps\/search\/([^/@?]+)/i);
      if (match && match[1]) {
        try {
          return decodeURIComponent(match[1]).replace(/\+/g, ' ').replace(/\/$/, '').trim();
        } catch {
          return match[1].replace(/\+/g, ' ').trim();
        }
      }
    }
  }

  // Normal text
  return trimmed;
}

/**
 * Türkiye telefonlarını ve uluslararası numaraları normalize eder:
 * 05321234567 -> 905321234567
 * +90 532 123 45 67 -> 905321234567
 * 532 123 45 67 -> 905321234567
 */
export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  // Türkiye 05xx... (11 haneli) -> 905xx...
  if (digits.length === 11 && digits.startsWith('05')) {
    digits = '9' + digits;
  }
  // Türkiye 5xx... (10 haneli) -> 905xx...
  else if (digits.length === 10 && digits.startsWith('5')) {
    digits = '90' + digits;
  }
  // Zaten 905xx... veya geçerli uluslararası numara
  else if (digits.length === 12 && digits.startsWith('905')) {
    // Hazır
  }

  return digits.length >= 10 ? digits : null;
}

/**
 * WhatsApp hazır mesaj linki oluşturur (wa.me)
 */
export function createWhatsAppUrl(phone: string | null | undefined, businessName: string): string | null {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;

  const cleanName = (businessName || 'Spor Salonu').trim();
  const message = `Merhaba ${cleanName}, spor salonunuz için geliştirdiğimiz üye, antrenör ve işletme yönetim sistemimizi kısaca tanıtmak istiyorum.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Domain çıkarıcı (Örn: https://www.fitzone.com/about -> fitzone.com)
 */
export function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const validUrl = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(validUrl);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/i);
    return match && match[1] ? match[1].toLowerCase() : null;
  }
}

/**
 * Outscraper API çağrıları
 */
const OUTSCRAPER_BASE_URL = 'https://api.outscraper.cloud';

export async function startOutscraperSearch(query: string, limit: number = 50) {
  const apiKey = process.env.OUTSCRAPER_API_KEY;
  if (!apiKey) {
    throw new Error('OUTSCRAPER_API_KEY_MISSING');
  }

  // Backend hard limit: 200
  const safeLimit = Math.max(1, Math.min(200, Math.floor(limit)));
  const cleanQuery = extractSearchQuery(query);

  if (!cleanQuery) {
    throw new Error('INVALID_QUERY');
  }

  const endpoint = `${OUTSCRAPER_BASE_URL}/maps/search-v3?query=${encodeURIComponent(cleanQuery)}&limit=${safeLimit}&language=tr&region=TR&async=true`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Outscraper API search error:', response.status, errorText);
    if (response.status === 401 || response.status === 403) {
      throw new Error('OUTSCRAPER_API_KEY_INVALID');
    }
    if (response.status === 429) {
      throw new Error('OUTSCRAPER_RATE_LIMIT');
    }
    throw new Error(`OUTSCRAPER_API_ERROR: ${response.status}`);
  }

  const data = await response.json();
  return {
    requestId: data.id as string,
    status: data.status as string,
    query: cleanQuery,
    limit: safeLimit,
  };
}

export async function checkOutscraperRequest(requestId: string) {
  const apiKey = process.env.OUTSCRAPER_API_KEY;
  if (!apiKey) {
    throw new Error('OUTSCRAPER_API_KEY_MISSING');
  }

  const endpoint = `${OUTSCRAPER_BASE_URL}/requests/${requestId}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Outscraper polling error:', response.status, errorText);
    throw new Error(`OUTSCRAPER_POLL_ERROR: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Outscraper sonucunu Lead veri formatına dönüştürür
 */
export function mapOutscraperItemToLead(item: any, searchQuery: string): ScrapedBusinessLead {
  const phone = item.phone || null;
  const phoneNormalized = normalizePhoneNumber(phone);
  const website = item.site || item.website || null;
  const websiteDomain = extractDomain(website);

  // Instagram tespiti
  let instagram = item.instagram || item.social_media?.instagram || null;
  if (!instagram && Array.isArray(item.social_media)) {
    const igItem = item.social_media.find(
      (s: any) => typeof s === 'string' && s.includes('instagram.com')
    );
    if (igItem) instagram = igItem;
  }
  if (!instagram && website && website.includes('instagram.com')) {
    instagram = website;
  }

  const address =
    item.full_address ||
    item.address ||
    [item.street, item.city, item.postal_code, item.country].filter(Boolean).join(', ') ||
    null;

  const rating =
    typeof item.rating === 'number'
      ? item.rating
      : item.rating
      ? parseFloat(item.rating) || 0
      : 0;

  const reviews =
    typeof item.reviews === 'number'
      ? item.reviews
      : item.reviews
      ? parseInt(item.reviews, 10) || 0
      : 0;

  const googleMapsUrl =
    item.location_link ||
    (item.place_id
      ? `https://www.google.com/maps/place/?q=place_id:${item.place_id}`
      : item.google_id
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name || '')}`
      : null);

  return {
    name: item.name || 'İsimsiz Spor Salonu',
    phone,
    phoneNormalized,
    address,
    rating,
    reviews,
    website,
    websiteDomain,
    instagram,
    googleMapsUrl,
    placeId: item.place_id || item.google_id || null,
    searchQuery,
  };
}

import { prisma } from './prisma';
import { ScrapedBusinessLead } from './outscraper';

// Genel/sosyal domainler domain eşleşmesinde duplicate sayılmamalı
const GENERIC_DOMAINS = new Set([
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'linktr.ee',
  'google.com',
  'yandex.com',
]);

/**
 * Duplicate lead kontrolü ve güvenli kayıt/güncelleme
 * Kontrol sırası:
 * 1. Provider / Google Place ID
 * 2. Normalize edilmiş telefon
 * 3. Website domain (özel domain ise)
 * 4. İşletme adı + Adres
 *
 * Eski lead tekrar bulunursa: status, notes, createdAt korunur.
 */
export async function upsertLead(scraped: ScrapedBusinessLead): Promise<{ id: string; isNew: boolean }> {
  let existingLead: any = null;

  // 1. Kontrol: Place ID
  if (scraped.placeId) {
    existingLead = await prisma.lead.findFirst({
      where: { placeId: scraped.placeId },
    });
  }

  // 2. Kontrol: Normalize Telefon
  if (!existingLead && scraped.phoneNormalized) {
    existingLead = await prisma.lead.findFirst({
      where: { phoneNormalized: scraped.phoneNormalized },
    });
  }

  // 3. Kontrol: Website Domain
  if (!existingLead && scraped.websiteDomain && !GENERIC_DOMAINS.has(scraped.websiteDomain)) {
    existingLead = await prisma.lead.findFirst({
      where: { websiteDomain: scraped.websiteDomain },
    });
  }

  // 4. Kontrol: İşletme Adı + Adres
  if (!existingLead && scraped.name && scraped.address) {
    existingLead = await prisma.lead.findFirst({
      where: {
        name: scraped.name,
        address: scraped.address,
      },
    });
  }

  if (existingLead) {
    // Mevcut lead bulundu: status, notes ve createdAt KORUNUR!
    const updated = await prisma.lead.update({
      where: { id: existingLead.id },
      data: {
        name: scraped.name || existingLead.name,
        phone: scraped.phone || existingLead.phone,
        phoneNormalized: scraped.phoneNormalized || existingLead.phoneNormalized,
        address: scraped.address || existingLead.address,
        rating: scraped.rating ?? existingLead.rating,
        reviews: scraped.reviews ?? existingLead.reviews,
        website: scraped.website || existingLead.website,
        websiteDomain: scraped.websiteDomain || existingLead.websiteDomain,
        instagram: scraped.instagram || existingLead.instagram,
        googleMapsUrl: scraped.googleMapsUrl || existingLead.googleMapsUrl,
        placeId: scraped.placeId || existingLead.placeId,
        searchQuery: scraped.searchQuery || existingLead.searchQuery,
        // status, notes, createdAt değiştirilmez
      },
    });
    return { id: updated.id, isNew: false };
  } else {
    // Yeni lead oluştur
    const created = await prisma.lead.create({
      data: {
        name: scraped.name,
        phone: scraped.phone,
        phoneNormalized: scraped.phoneNormalized,
        address: scraped.address,
        rating: scraped.rating ?? 0,
        reviews: scraped.reviews ?? 0,
        website: scraped.website,
        websiteDomain: scraped.websiteDomain,
        instagram: scraped.instagram,
        googleMapsUrl: scraped.googleMapsUrl,
        placeId: scraped.placeId,
        status: 'NEW',
        notes: '',
        searchQuery: scraped.searchQuery,
      },
    });
    return { id: created.id, isNew: true };
  }
}

/**
 * Lead KPI İstatistiklerini getirir
 */
export async function getLeadStats() {
  const [totalLeads, withPhone, contacted, interested, customer] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        phone: { not: null },
      },
    }),
    prisma.lead.count({
      where: { status: 'CONTACTED' },
    }),
    prisma.lead.count({
      where: { status: 'INTERESTED' },
    }),
    prisma.lead.count({
      where: { status: 'CUSTOMER' },
    }),
  ]);

  return {
    totalLeads,
    withPhone,
    contacted,
    interested,
    customer,
  };
}

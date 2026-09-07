import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLeadStats } from '@/lib/leads';

export async function GET(req: Request) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Bu alana yalnızca sistem yöneticisi (Super Admin) erişebilir.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search')?.trim() || '';
    const searchId = searchParams.get('searchId');

    const whereClause: any = {};

    // Filter by search query record if requested
    if (searchId) {
      const searchRecord = await prisma.leadSearch.findUnique({ where: { id: searchId } });
      if (searchRecord) {
        whereClause.searchQuery = searchRecord.query;
      }
    }

    // Status or attribute filter
    if (filter === 'has_phone') {
      whereClause.phone = { not: null };
    } else if (filter === 'has_whatsapp') {
      whereClause.phoneNormalized = { not: null };
    } else if (filter === 'has_instagram') {
      whereClause.instagram = { not: null };
    } else if (filter === 'has_website') {
      whereClause.website = { not: null };
    } else if (['NEW', 'CONTACTED', 'WAITING', 'INTERESTED', 'NOT_INTERESTED', 'CUSTOMER'].includes(filter)) {
      whereClause.status = filter;
    }

    // Name / Address / Phone search
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { phone: { contains: search } },
        { website: { contains: search } },
      ];
    }

    const [leads, stats, recentSearches] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      getLeadStats(),
      prisma.leadSearch.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
    ]);

    const hasApiKey = Boolean(process.env.OUTSCRAPER_API_KEY && process.env.OUTSCRAPER_API_KEY.trim() !== '');

    return NextResponse.json({
      success: true,
      leads,
      stats,
      recentSearches,
      hasApiKey,
    });
  } catch (error) {
    console.error('Fetch leads error:', error);
    return NextResponse.json(
      { error: 'Potansiyel spor salonu verileri yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

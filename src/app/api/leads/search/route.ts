import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOutscraperSearch, extractSearchQuery } from '@/lib/outscraper';

// Simple in-memory rate limiter (timestamp of last search)
let lastSearchTimestamp = 0;

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Bu işlemi yalnızca sistem yöneticisi gerçekleştirebilir.' },
      { status: 403 }
    );
  }

  // Rate limit: 3 seconds between search triggers
  const now = Date.now();
  if (now - lastSearchTimestamp < 3000) {
    return NextResponse.json(
      { error: 'Lütfen yeni bir arama başlatmadan önce 3 saniye bekleyin.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const rawQuery = body.query;
    const requestedLimit = parseInt(body.limit || '50', 10);

    if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir Google Maps arama URL\'si veya arama terimi girin.' },
        { status: 400 }
      );
    }

    const cleanQuery = extractSearchQuery(rawQuery);
    if (!cleanQuery) {
      return NextResponse.json(
        { error: 'Girilen arama sorgusu anlaşılamadı. Lütfen geçerli bir terim veya URL girin.' },
        { status: 400 }
      );
    }

    // Backend hard limit: 200
    const safeLimit = Math.max(1, Math.min(200, isNaN(requestedLimit) ? 50 : requestedLimit));

    // Check API Key
    if (!process.env.OUTSCRAPER_API_KEY || !process.env.OUTSCRAPER_API_KEY.trim()) {
      return NextResponse.json(
        {
          error: 'Outscraper API anahtarı (OUTSCRAPER_API_KEY) tanımlanmamış. Lütfen sunucu veya .env ortam değişkenlerine API anahtarınızı ekleyin.',
          code: 'API_KEY_MISSING',
        },
        { status: 400 }
      );
    }

    // Call Outscraper
    lastSearchTimestamp = now;
    const searchRes = await startOutscraperSearch(cleanQuery, safeLimit);

    // Save job to database
    const searchRecord = await prisma.leadSearch.create({
      data: {
        query: cleanQuery,
        requestedLimit: safeLimit,
        status: 'PENDING',
        outscraperRequestId: searchRes.requestId,
      },
    });

    return NextResponse.json({
      success: true,
      searchId: searchRecord.id,
      requestId: searchRes.requestId,
      query: cleanQuery,
      limit: safeLimit,
      message: `Arama başlatıldı. Outscraper üzerinden ${safeLimit} işletmeye kadar sorgulanıyor...`,
    });
  } catch (error: any) {
    console.error('Lead search initiate error:', error);
    const msg = error?.message || '';

    if (msg === 'OUTSCRAPER_API_KEY_MISSING' || msg === 'OUTSCRAPER_API_KEY_INVALID') {
      return NextResponse.json(
        { error: 'Outscraper API anahtarı geçersiz veya eksik. Lütfen OUTSCRAPER_API_KEY değerini kontrol edin.' },
        { status: 401 }
      );
    }
    if (msg === 'OUTSCRAPER_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'Outscraper arama kotası veya hız limiti aşıldı. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Arama başlatılırken Outscraper sağlayıcısından yanıt alınamadı. Lütfen bağlantınızı kontrol edin.' },
      { status: 500 }
    );
  }
}

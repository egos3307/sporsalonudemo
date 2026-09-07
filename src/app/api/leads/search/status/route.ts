import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkOutscraperRequest, mapOutscraperItemToLead } from '@/lib/outscraper';
import { upsertLead } from '@/lib/leads';

export async function GET(req: Request) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Bu işlemi yalnızca sistem yöneticisi gerçekleştirebilir.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const searchId = searchParams.get('searchId');

    if (!searchId) {
      return NextResponse.json(
        { error: 'searchId parametresi gereklidir.' },
        { status: 400 }
      );
    }

    const searchRecord = await prisma.leadSearch.findUnique({
      where: { id: searchId },
    });

    if (!searchRecord) {
      return NextResponse.json(
        { error: 'Arama kaydı bulunamadı.' },
        { status: 404 }
      );
    }

    // Already completed
    if (searchRecord.status === 'COMPLETED') {
      return NextResponse.json({
        status: 'COMPLETED',
        foundCount: searchRecord.foundCount,
        newLeadsCount: searchRecord.newLeadsCount,
      });
    }

    // Already failed
    if (searchRecord.status === 'FAILED') {
      return NextResponse.json({
        status: 'FAILED',
        error: searchRecord.errorMessage || 'Arama işlemi başarısız oldu.',
      });
    }

    // If pending, check Outscraper
    if (!searchRecord.outscraperRequestId) {
      return NextResponse.json({
        status: 'FAILED',
        error: 'Geçersiz arama isteği kimliği.',
      });
    }

    const result = await checkOutscraperRequest(searchRecord.outscraperRequestId);

    const outscraperStatus = (result.status || '').toLowerCase();

    if (outscraperStatus === 'success') {
      // Outscraper returns data as an array of arrays [ [ { ... }, { ... } ] ]
      let rawPlaces: any[] = [];
      if (Array.isArray(result.data)) {
        rawPlaces = result.data.flat();
      }

      let newLeadsCount = 0;
      const totalFound = rawPlaces.length;

      // Process each business lead with deduplication logic
      for (const rawPlace of rawPlaces) {
        try {
          const leadData = mapOutscraperItemToLead(rawPlace, searchRecord.query);
          const upsertRes = await upsertLead(leadData);
          if (upsertRes.isNew) {
            newLeadsCount++;
          }
        } catch (itemErr) {
          console.error('Lead upsert item error:', itemErr);
        }
      }

      // Mark search record as completed
      await prisma.leadSearch.update({
        where: { id: searchRecord.id },
        data: {
          status: 'COMPLETED',
          foundCount: totalFound,
          newLeadsCount,
        },
      });

      return NextResponse.json({
        status: 'COMPLETED',
        foundCount: totalFound,
        newLeadsCount,
      });
    } else if (outscraperStatus === 'failure' || outscraperStatus === 'failed') {
      await prisma.leadSearch.update({
        where: { id: searchRecord.id },
        data: {
          status: 'FAILED',
          errorMessage: 'Outscraper sağlayıcısı aramayı tamamlayamadı.',
        },
      });

      return NextResponse.json({
        status: 'FAILED',
        error: 'Outscraper sağlayıcısı aramayı tamamlayamadı.',
      });
    }

    // Still pending / processing
    return NextResponse.json({
      status: 'PENDING',
      message: 'Arama devam ediyor, Google Maps sonuçları taranıyor...',
    });
  } catch (error: any) {
    console.error('Poll lead status error:', error);
    return NextResponse.json(
      { error: 'Arama durumu kontrol edilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

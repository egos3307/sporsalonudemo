import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const STATUS_TURKISH: Record<string, string> = {
  NEW: 'Yeni',
  CONTACTED: 'İletişime Geçildi',
  WAITING: 'Cevap Bekleniyor',
  INTERESTED: 'İlgileniyor',
  NOT_INTERESTED: 'Olumsuz',
  CUSTOMER: 'Müşteri',
};

export async function GET(req: Request) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yetkisiz erişim.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search')?.trim() || '';

    const whereClause: any = {};

    if (filter === 'has_phone') {
      whereClause.phone = { not: null };
    } else if (filter === 'has_whatsapp') {
      whereClause.phoneNormalized = { not: null };
    } else if (filter === 'has_instagram') {
      whereClause.instagram = { not: null };
    } else if (filter === 'has_website') {
      whereClause.website = { not: null };
    } else if (STATUS_TURKISH[filter]) {
      whereClause.status = filter;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'İşletme Adı',
      'Telefon',
      'Adres',
      'Website',
      'Instagram',
      'Maps',
      'Puan',
      'Yorum Sayısı',
      'Durum',
      'Not',
      'Kayıt Tarihi',
    ];

    const rows = leads.map((l) => [
      escapeCsvField(l.name),
      escapeCsvField(l.phone || ''),
      escapeCsvField(l.address || ''),
      escapeCsvField(l.website || ''),
      escapeCsvField(l.instagram || ''),
      escapeCsvField(l.googleMapsUrl || ''),
      escapeCsvField(l.rating ?? ''),
      escapeCsvField(l.reviews ?? ''),
      escapeCsvField(STATUS_TURKISH[l.status] || l.status),
      escapeCsvField(l.notes || ''),
      escapeCsvField(new Date(l.createdAt).toLocaleDateString('tr-TR')),
    ]);

    // UTF-8 BOM (\uFEFF) ensures Excel opens Turkish characters (ç, ğ, ı, ö, ş, ü) without corruption
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="potansiyel-spor-salonlari-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    return NextResponse.json({ error: 'CSV oluşturulamadı.' }, { status: 500 });
  }
}

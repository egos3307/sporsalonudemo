import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yetkisiz erişim.' },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { status, notes } = body;

    const dataToUpdate: any = {};
    if (status !== undefined) {
      const validStatuses = ['NEW', 'CONTACTED', 'WAITING', 'INTERESTED', 'NOT_INTERESTED', 'CUSTOMER'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Geçersiz lead durumu.' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }

    if (notes !== undefined) {
      dataToUpdate.notes = String(notes);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: 'Lead güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yetkisiz erişim.' },
      { status: 403 }
    );
  }

  try {
    const { id } = params;
    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: 'Lead silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

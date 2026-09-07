import { NextResponse } from 'next/server';
import { getExerciseAiGuidance } from '@/lib/nvidia';

export async function POST(req: Request) {
  try {
    const { exerciseName } = await req.json();

    if (!exerciseName || typeof exerciseName !== 'string') {
      return NextResponse.json(
        { error: 'Egzersiz adı gereklidir.' },
        { status: 400 }
      );
    }

    const guidance = await getExerciseAiGuidance(exerciseName);

    return NextResponse.json({
      success: true,
      guidance,
      hasNvidiaKey: Boolean(process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim() !== ''),
    });
  } catch (error) {
    console.error('Exercise AI Coach API error:', error);
    return NextResponse.json(
      { error: 'Yapay zeka rehberi oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}

/**
 * NVIDIA AI API Service
 * OpenAI-compatible endpoint: https://integrate.api.nvidia.com/v1/chat/completions
 * Hareket adı ve seviyeye göre yapay zeka destekli form rehberi ve YouTube video önerisi
 */

export interface ExerciseAiGuidance {
  exerciseName: string;
  youtubeVideoId: string;
  youtubeSearchQuery: string;
  muscleGroups: string[];
  description: string;
  howToSteps: string[];
  commonMistakes: string[];
  breathingTip: string;
  aiGenerated: boolean;
}

// Popüler fitness hareketleri için hazır doğrulanmış YouTube Shorts / Video ID kütüphanesi (Hemen çalışması için)
const VERIFIED_EXERCISE_VIDEOS: Record<string, { videoId: string; muscles: string[]; desc: string }> = {
  'bench press': {
    videoId: 'rT7DgCr-3pg',
    muscles: ['Göğüs (Pectoralis)', 'Ön Omuz', 'Triceps'],
    desc: 'Göğüs kaslarını ve üst vücut itiş gücünü geliştirmek için en temel ve etkili bileşik egzersizdir.',
  },
  'barbell bench press': {
    videoId: 'rT7DgCr-3pg',
    muscles: ['Göğüs', 'Ön Omuz', 'Triceps'],
    desc: 'Göğüs kaslarını ve üst vücut itiş gücünü geliştirmek için en temel ve etkili bileşik egzersizdir.',
  },
  'incline dumbbell press': {
    videoId: '8iPEnn-ltC8',
    muscles: ['Üst Göğüs (Clavicular)', 'Ön Omuz', 'Triceps'],
    desc: 'Üst göğüs liflerini izole ederek omuz ile göğüs arasındaki dolgunluğu artırır.',
  },
  'barbell squat': {
    videoId: 'bEv6CCg2BC8',
    muscles: ['Quadriceps', 'Gluteus (Kalça)', 'Hamstrings', 'Core'],
    desc: 'Alt vücudun kral egzersizi. Bacak ve kalça hipertrofisi için maksimum kas lifi uyarımı sağlar.',
  },
  'squat': {
    videoId: 'bEv6CCg2BC8',
    muscles: ['Quadriceps', 'Gluteus', 'Core'],
    desc: 'Alt vücudun temel squat formu. Dizleri ayak parmak uçlarıyla aynı hizada tutun.',
  },
  'deadlift': {
    videoId: 'op9kVnSso6Q',
    muscles: ['Sırt (Erector Spinae)', 'Kalça (Glutes)', 'Hamstrings', 'Trapez'],
    desc: 'Tüm arka zinciri (posterior chain) çalıştıran, güç ve dayanıklılık inşa eden bileşik hareket.',
  },
  'lat pulldown': {
    videoId: 'CAwf7n6Luuc',
    muscles: ['Latissimus Dorsi (Kanat)', 'Biceps', 'Arka Omuz'],
    desc: 'V-şeklinde sırt genişliği ve kanat kaslarının aktivasyonu için vazgeçilmez dikey çekiş hareketi.',
  },
  'cable row': {
    videoId: 'GZbfZ033f74',
    muscles: ['Orta Sırt', 'Rhomboids', 'Latissimus Dorsi', 'Biceps'],
    desc: 'Sırt kalınlığı ve duruş (postür) düzeltmesi için göğsü dik tutarak çekiş yapın.',
  },
  'shoulder press': {
    videoId: '2yjwXTZQDDI',
    muscles: ['Ön Omuz (Anterior Deltoid)', 'Yan Omuz', 'Triceps'],
    desc: 'Geniş omuzlar ve baş üstü itiş stabilitesi geliştiren ana omuz egzersizidir.',
  },
  'overhead press': {
    videoId: '2yjwXTZQDDI',
    muscles: ['Tüm Omuz', 'Triceps', 'Üst Göğüs', 'Core'],
    desc: 'Ayakta veya oturarak omuz başlarını ve trapez kaslarını yoğun şekilde aktive eder.',
  },
  'bicep curl': {
    videoId: 'ykJmrZ5v0Oo',
    muscles: ['Biceps Brachii', 'Brachialis'],
    desc: 'Kollarda tepe noktası (peak) oluşturmak ve kol hacmini artırmak için dirsekleri sabitleyerek uygulayın.',
  },
  'triceps pushdown': {
    videoId: '2-LAMcpzODU',
    muscles: ['Triceps Lateral & Medial Başları'],
    desc: 'Arka kol kaslarını izole eden, dirsek eklemini zorlamadan tepe kasılma sağlayan kablo hareketi.',
  },
  'plank': {
    videoId: 'pSHjTRCQxIw',
    muscles: ['Transversus Abdominis', 'Rektus Abdominis', 'Alt Sırt'],
    desc: 'Omurga stabilitesini koruyan ve core bölgesini çelik gibi kuvvetlendiren izometrik duruş.',
  },
  'leg press': {
    videoId: 'IZxyjW7MPJQ',
    muscles: ['Quadriceps', 'Glutes', 'Calves'],
    desc: 'Bel bölgesine minimum yük bindirerek bacaklara ağır yüklenme imkanı tanıyan makine hareketi.',
  },
  'leg extension': {
    videoId: 'YyvSfVjQeL0',
    muscles: ['Quadriceps İzole'],
    desc: 'Ön bacak kaslarında ayrıntı ve damarlanma sağlayan izole uzatma hareketi.',
  },
};

export async function getExerciseAiGuidance(exerciseName: string): Promise<ExerciseAiGuidance> {
  const normalizedName = exerciseName.toLowerCase().trim();
  const matchedVerified = Object.entries(VERIFIED_EXERCISE_VIDEOS).find(([key]) =>
    normalizedName.includes(key) || key.includes(normalizedName)
  );

  const fallbackVideoId = matchedVerified ? matchedVerified[1].videoId : 'rT7DgCr-3pg';
  const fallbackMuscles = matchedVerified ? matchedVerified[1].muscles : ['Hedef Kas Grubu', 'Core', 'Denge'];
  const fallbackDesc = matchedVerified
    ? matchedVerified[1].desc
    : `${exerciseName}, antrenörünüz tarafından hedefinize özel belirlenen etkili bir harekettir. Doğru formda ve kontrollü tekrar temposuyla uygulayınız.`;

  const defaultGuidance: ExerciseAiGuidance = {
    exerciseName,
    youtubeVideoId: fallbackVideoId,
    youtubeSearchQuery: `${exerciseName} doğru form nasıl yapılır shorts`,
    muscleGroups: fallbackMuscles,
    description: fallbackDesc,
    howToSteps: [
      'Ekipmanı ve ağırlığı kontrol edin, doğru başlangıç pozisyonunu alın.',
      'Hareketi acele etmeden, negatif fazda (inişte) 2-3 saniye kontrollü uygulayın.',
      'Tepe kasılma noktasında 1 saniye odaklanarak hedef kası sıkın.',
      'Nefesinizi zorlanırken (itiş/çekiş) verin, başlangıç pozisyonuna dönerken alın.',
    ],
    commonMistakes: [
      'Aşırı ağırlık seçerek formu ve eklem açısını bozmak.',
      'Momentum (vücudu sallayarak) ile ağırlığı savurmak.',
      'Eklemleri tam kilitleyip (hyperextension) yüke maruz bırakmak.',
    ],
    breathingTip: 'Ağırlığı kaldırırken (efor anında) ağızdan verin, indirirken burundan derin nefes alın.',
    aiGenerated: false,
  };

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return defaultGuidance;
  }

  try {
    const prompt = `Sen elit bir spor salonu başantrenörü ve biyomekanik uzmanısın.
Kullanıcı "${exerciseName}" egzersizini yapıyor.
Aşağıdaki JSON formatında yanıt ver:
{
  "description": "Hareketin 1-2 cümlelik profesyonel açıklaması ve faydası",
  "muscleGroups": ["Ana Kas 1", "Yardımcı Kas 2", "Core"],
  "howToSteps": ["1. Adım", "2. Adım", "3. Adım", "4. Adım"],
  "commonMistakes": ["Kaçınılması gereken hata 1", "Kaçınılması gereken hata 2"],
  "breathingTip": "Nefes alma/verme tekniği",
  "youtubeSearchQuery": "${exerciseName} form tutorial"
}
SADECE GEÇERLİ JSON DÖNDÜR. Markdown kodu veya ek açıklama yazma.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      console.warn('NVIDIA API request failed with status:', response.status);
      return defaultGuidance;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (content) {
      // Clean possible markdown code fence
      const cleanJson = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        exerciseName,
        youtubeVideoId: fallbackVideoId,
        youtubeSearchQuery: parsed.youtubeSearchQuery || defaultGuidance.youtubeSearchQuery,
        muscleGroups: Array.isArray(parsed.muscleGroups) ? parsed.muscleGroups : defaultGuidance.muscleGroups,
        description: parsed.description || defaultGuidance.description,
        howToSteps: Array.isArray(parsed.howToSteps) ? parsed.howToSteps : defaultGuidance.howToSteps,
        commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : defaultGuidance.commonMistakes,
        breathingTip: parsed.breathingTip || defaultGuidance.breathingTip,
        aiGenerated: true,
      };
    }
  } catch (err) {
    console.error('NVIDIA AI Exercise Coach error:', err);
  }

  return defaultGuidance;
}

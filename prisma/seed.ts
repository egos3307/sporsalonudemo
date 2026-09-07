import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic Gym SaaS demo data...');

  // Clean old data
  await prisma.notification.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.progressPhoto.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.mealItem.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.dietPlan.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workoutDay.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.member.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gym.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  const now = new Date();
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  // 1. Primary Gym: FitZone Pro Club (Active 7-day trial, 5 days remaining)
  const fitZone = await prisma.gym.create({
    data: {
      name: 'FitZone Pro Club',
      slug: 'fitzone',
      ownerName: 'Kemal Yılmaz',
      email: 'admin@fitzone.com',
      phone: '+90 (212) 555 4321',
      logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      address: 'Büyükdere Cad. No: 184, Levent, İstanbul',
      trialStart: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      trialEndsAt: fiveDaysFromNow,
      subscriptionStatus: 'TRIAL',
    },
  });

  // Admin user for FitZone
  const fitZoneAdmin = await prisma.user.create({
    data: {
      gymId: fitZone.id,
      email: 'admin@fitzone.com',
      passwordHash: defaultPasswordHash,
      name: 'Kemal Yılmaz (Admin)',
      phone: '+90 532 111 2233',
      role: 'GYM_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
  });

  // 2. Secondary Gym: Apex Performance Studio (Expired trial to test paywall & multi-tenancy)
  const apexGym = await prisma.gym.create({
    data: {
      name: 'Apex Performance Studio',
      slug: 'apex',
      ownerName: 'Deniz Arslan',
      email: 'admin@apexfit.com',
      phone: '+90 (216) 444 8899',
      logo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&auto=format&fit=crop&q=80',
      primaryColor: '#ea580c',
      accentColor: '#f97316',
      address: 'Bağdat Caddesi No: 412, Kadıköy, İstanbul',
      trialStart: tenDaysAgo,
      trialEndsAt: threeDaysAgo,
      subscriptionStatus: 'EXPIRED',
    },
  });

  await prisma.user.create({
    data: {
      gymId: apexGym.id,
      email: 'admin@apexfit.com',
      passwordHash: defaultPasswordHash,
      name: 'Deniz Arslan (Apex Admin)',
      role: 'GYM_ADMIN',
    },
  });

  // 3. FitZone Trainers
  const trainerData = [
    {
      name: 'Murat Kaya',
      email: 'murat@fitzone.com',
      phone: '+90 533 222 3344',
      specialties: 'Hipertrofi, Vücut Geliştirme, Güç Antrenmanı',
      bio: '10 yıllık IFBB tecrübesi, milli vücut geliştirme sporcusu.',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Selin Demir',
      email: 'selin@fitzone.com',
      phone: '+90 535 333 4455',
      specialties: 'Pilates, Postür Düzeltme, Fonksiyonel Fitness',
      bio: 'Ereps 4. Seviye Eğitmen, omurga sağlığı ve kadın sağlığı koçu.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Burak Çelik',
      email: 'burak@fitzone.com',
      phone: '+90 536 444 5566',
      specialties: 'CrossFit, Kondisyon, Dayanıklılık & HIIT',
      bio: 'Eski atletizm sporcusu, CrossFit Level 2 sertifikalı koç.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const trainers = [];
  for (const t of trainerData) {
    const user = await prisma.user.create({
      data: {
        gymId: fitZone.id,
        email: t.email,
        passwordHash: defaultPasswordHash,
        name: t.name,
        phone: t.phone,
        role: 'TRAINER',
        avatar: t.avatar,
      },
    });

    const trainer = await prisma.trainer.create({
      data: {
        gymId: fitZone.id,
        userId: user.id,
        specialties: t.specialties,
        bio: t.bio,
        phone: t.phone,
      },
    });
    trainers.push(trainer);
  }

  // 4. FitZone Members (22 members with realistic variety)
  const memberDefinitions = [
    {
      firstName: 'Caner',
      lastName: 'Erkin',
      email: 'caner@gmail.com',
      phone: '+90 541 123 4567',
      code: 'GYM-A7K92X',
      gender: 'ERKEK',
      trainerIdx: 0,
      status: 'ACTIVE',
      goal: 'Hipertrofi & Yağ Yakımı',
      expDays: 90,
      targetCalories: 2600,
      targetWaterMl: 3500,
      createUser: true,
    },
    {
      firstName: 'Zeynep',
      lastName: 'Kaya',
      email: 'zeynep@gmail.com',
      phone: '+90 542 234 5678',
      code: 'GYM-B3M81Y',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Sıkılaşma & Esneklik',
      expDays: 120,
      targetCalories: 1850,
      targetWaterMl: 2500,
      createUser: true,
    },
    {
      firstName: 'Emre',
      lastName: 'Demir',
      email: 'emre@gmail.com',
      phone: '+90 543 345 6789',
      code: 'GYM-C9P44Z',
      gender: 'ERKEK',
      trainerIdx: 2,
      status: 'ACTIVE',
      goal: 'Fonksiyonel Güç & Kondisyon',
      expDays: 60,
      targetCalories: 2800,
      targetWaterMl: 4000,
      createUser: true,
    },
    {
      firstName: 'Elif',
      lastName: 'Yıldız',
      email: 'elif@gmail.com',
      phone: '+90 544 456 7890',
      code: 'GYM-D1R55W',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Kilo Verme',
      expDays: 4, // Expiring soon!
      targetCalories: 1600,
      targetWaterMl: 2500,
      createUser: true,
    },
    {
      firstName: 'Barış',
      lastName: 'Öztürk',
      email: 'baris@gmail.com',
      phone: '+90 545 567 8901',
      code: 'GYM-E2T66V',
      gender: 'ERKEK',
      trainerIdx: 0,
      status: 'ACTIVE',
      goal: 'Kuvvet Artışı',
      expDays: 2, // Expiring soon!
      targetCalories: 3100,
      targetWaterMl: 3500,
      createUser: false,
    },
    {
      firstName: 'Seda',
      lastName: 'Aksoy',
      email: 'seda@gmail.com',
      phone: '+90 546 678 9012',
      code: 'GYM-F3Y77U',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'FROZEN',
      goal: 'Rehabilitasyon',
      expDays: 45,
      targetCalories: 1900,
      targetWaterMl: 2000,
      createUser: false,
    },
    {
      firstName: 'Mehmet',
      lastName: 'Korkmaz',
      email: 'mehmet@gmail.com',
      phone: '+90 547 789 0123',
      code: 'GYM-G4U88T',
      gender: 'ERKEK',
      trainerIdx: 2,
      status: 'EXPIRED',
      goal: 'Kondisyon',
      expDays: -10, // Expired
      targetCalories: 2400,
      targetWaterMl: 3000,
      createUser: false,
    },
    {
      firstName: 'Aylin',
      lastName: 'Şahin',
      email: 'aylin@gmail.com',
      phone: '+90 548 890 1234',
      code: 'GYM-H5I99S',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Postür & Pilates',
      expDays: 180,
      targetCalories: 1750,
      targetWaterMl: 2500,
      createUser: false,
    },
    {
      firstName: 'Oğuzhan',
      lastName: 'Çetin',
      email: 'oguzhan@gmail.com',
      phone: '+90 549 901 2345',
      code: 'GYM-J6O00R',
      gender: 'ERKEK',
      trainerIdx: 0,
      status: 'ACTIVE',
      goal: 'Hacim Kazanımı',
      expDays: 210,
      targetCalories: 3300,
      targetWaterMl: 4000,
      createUser: false,
    },
    {
      firstName: 'Cansu',
      lastName: 'Güler',
      email: 'cansu@gmail.com',
      phone: '+90 550 012 3456',
      code: 'GYM-K7P11Q',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Fit Yaşam & Sağlık',
      expDays: 5, // Expiring soon!
      targetCalories: 1800,
      targetWaterMl: 2500,
      createUser: false,
    },
    {
      firstName: 'Volkan',
      lastName: 'Arslan',
      email: 'volkan@gmail.com',
      phone: '+90 551 123 4568',
      code: 'GYM-L8A22P',
      gender: 'ERKEK',
      trainerIdx: 2,
      status: 'ACTIVE',
      goal: 'CrossFit WOD',
      expDays: 75,
      targetCalories: 2900,
      targetWaterMl: 3500,
      createUser: false,
    },
    {
      firstName: 'Gizem',
      lastName: 'Aydın',
      email: 'gizem@gmail.com',
      phone: '+90 552 234 5679',
      code: 'GYM-M9S33O',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Kilo Kontrolü',
      expDays: 150,
      targetCalories: 1950,
      targetWaterMl: 2500,
      createUser: false,
    },
    {
      firstName: 'Hakan',
      lastName: 'Koç',
      email: 'hakan@gmail.com',
      phone: '+90 553 345 6780',
      code: 'GYM-N1D44N',
      gender: 'ERKEK',
      trainerIdx: 0,
      status: 'ACTIVE',
      goal: 'Bench & Deadlift Güç',
      expDays: 300,
      targetCalories: 3000,
      targetWaterMl: 4000,
      createUser: false,
    },
    {
      firstName: 'Deniz',
      lastName: 'Güneş',
      email: 'deniz.gunes@gmail.com',
      phone: '+90 554 456 7891',
      code: 'GYM-O2F55M',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'PENDING_ACTIVATION',
      goal: 'Yeni Başlayan',
      expDays: 30,
      targetCalories: 2000,
      targetWaterMl: 2000,
      createUser: false,
    },
    {
      firstName: 'Tolga',
      lastName: 'Yavuz',
      email: 'tolga@gmail.com',
      phone: '+90 555 567 8902',
      code: 'GYM-P3G66L',
      gender: 'ERKEK',
      trainerIdx: 2,
      status: 'ACTIVE',
      goal: 'Kondisyon & Hız',
      expDays: 85,
      targetCalories: 2700,
      targetWaterMl: 3200,
      createUser: false,
    },
    {
      firstName: 'Buse',
      lastName: 'Erdoğan',
      email: 'buse@gmail.com',
      phone: '+90 556 678 9013',
      code: 'GYM-Q4H77K',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Tonlama & Sıkılaşma',
      expDays: 140,
      targetCalories: 1700,
      targetWaterMl: 2500,
      createUser: false,
    },
    {
      firstName: 'Serkan',
      lastName: 'Kurt',
      email: 'serkan@gmail.com',
      phone: '+90 557 789 0124',
      code: 'GYM-R5J88J',
      gender: 'ERKEK',
      trainerIdx: 0,
      status: 'ACTIVE',
      goal: 'Omuz & Sırt Genişletme',
      expDays: 240,
      targetCalories: 2850,
      targetWaterMl: 3500,
      createUser: false,
    },
    {
      firstName: 'Derya',
      lastName: 'Yılmaz',
      email: 'derya@gmail.com',
      phone: '+90 558 890 1235',
      code: 'GYM-S6K99H',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'EXPIRED',
      goal: 'Sağlıklı Yaşam',
      expDays: -5,
      targetCalories: 1800,
      targetWaterMl: 2000,
      createUser: false,
    },
    {
      firstName: 'Alper',
      lastName: 'Taş',
      email: 'alper@gmail.com',
      phone: '+90 559 901 2346',
      code: 'GYM-T7L00G',
      gender: 'ERKEK',
      trainerIdx: 2,
      status: 'ACTIVE',
      goal: 'Dayanıklılık',
      expDays: 110,
      targetCalories: 2600,
      targetWaterMl: 3000,
      createUser: false,
    },
    {
      firstName: 'İrem',
      lastName: 'Bulut',
      email: 'irem@gmail.com',
      phone: '+90 560 012 3457',
      code: 'GYM-U8Z11F',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Bölgesel İncelme',
      expDays: 95,
      targetCalories: 1650,
      targetWaterMl: 2500,
      createUser: false,
    },
    {
      firstName: 'Kerem',
      lastName: 'Şimşek',
      email: 'kerem@gmail.com',
      phone: '+90 561 123 4569',
      code: 'GYM-V9X22E',
      gender: 'ERKEK',
      trainerIdx: 0,
      status: 'ACTIVE',
      goal: 'Powerlifting',
      expDays: 320,
      targetCalories: 3400,
      targetWaterMl: 4500,
      createUser: false,
    },
    {
      firstName: 'Melis',
      lastName: 'Özcan',
      email: 'melis@gmail.com',
      phone: '+90 562 234 5670',
      code: 'GYM-W0C33D',
      gender: 'KADIN',
      trainerIdx: 1,
      status: 'ACTIVE',
      goal: 'Esneklik & Denge',
      expDays: 160,
      targetCalories: 1800,
      targetWaterMl: 2200,
      createUser: false,
    },
  ];

  const createdMembers = [];

  for (const m of memberDefinitions) {
    let userId: string | null = null;
    if (m.createUser) {
      const u = await prisma.user.create({
        data: {
          gymId: fitZone.id,
          email: m.email,
          passwordHash: defaultPasswordHash,
          name: `${m.firstName} ${m.lastName}`,
          phone: m.phone,
          role: 'MEMBER',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.firstName}`,
        },
      });
      userId = u.id;
    }

    const member = await prisma.member.create({
      data: {
        gymId: fitZone.id,
        userId: userId,
        memberCode: m.code,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phone: m.phone,
        gender: m.gender,
        membershipStart: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        membershipEnd: new Date(now.getTime() + m.expDays * 24 * 60 * 60 * 1000),
        status: m.status,
        trainerId: trainers[m.trainerIdx].id,
        targetGoal: m.goal,
        targetCalories: m.targetCalories,
        targetWaterMl: m.targetWaterMl,
      },
    });

    createdMembers.push(member);

    // Initial timeline event
    await prisma.timelineEvent.create({
      data: {
        gymId: fitZone.id,
        memberId: member.id,
        type: 'REGISTERED',
        title: 'Üyelik Başlatıldı',
        description: `${m.firstName} ${m.lastName} spor salonumuza başarıyla kayıt oldu.`,
        createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 5. Workout Plans for Caner Erkin (Primary test member)
  const caner = createdMembers[0];
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      gymId: fitZone.id,
      memberId: caner.id,
      trainerId: trainers[0].id,
      title: '4 Günlük Split Hipertrofi Programı',
      description: 'Kas kütlesi artışı ve hacim odaklı yüksek yoğunluklu antrenman planı.',
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      isActive: true,
      days: {
        create: [
          {
            dayName: 'Pazartesi',
            focus: 'Göğüs & Ön Kol (Chest & Biceps)',
            order: 1,
            exercises: {
              create: [
                {
                  name: 'Barbell Bench Press',
                  sets: 4,
                  reps: '8-10',
                  weight: '75 KG',
                  restTimeSeconds: 90,
                  notes: 'Göğse tam temas, kontrollü negatif tempo (3-1-1).',
                  videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
                  order: 1,
                },
                {
                  name: 'Incline Dumbbell Press',
                  sets: 3,
                  reps: '10-12',
                  weight: '26 KG',
                  restTimeSeconds: 75,
                  notes: 'Sehpa 30 derece açıda, tepe noktada sıkıştır.',
                  videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
                  order: 2,
                },
                {
                  name: 'Cable Fly (High to Low)',
                  sets: 3,
                  reps: '12-15',
                  weight: '15 KG',
                  restTimeSeconds: 60,
                  notes: 'Kollarda hafif bükülme, alt göğse doğru çekiş.',
                  videoUrl: 'https://www.youtube.com/watch?v=taI4XduLp4M',
                  order: 3,
                },
                {
                  name: 'Barbell EZ Bicep Curl',
                  sets: 4,
                  reps: '10-12',
                  weight: '30 KG',
                  restTimeSeconds: 60,
                  notes: 'Dirsekleri gövdeye sabitle, savurma yapma.',
                  videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
                  order: 4,
                },
                {
                  name: 'Hammer Curls (Dumbbell)',
                  sets: 3,
                  reps: '12',
                  weight: '14 KG',
                  restTimeSeconds: 60,
                  notes: 'Brachialis ve ön kol gelişimi için avuçlar birbirine baksın.',
                  videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
                  order: 5,
                },
              ],
            },
          },
          {
            dayName: 'Salı',
            focus: 'Sırt & Arka Kol (Back & Triceps)',
            order: 2,
            exercises: {
              create: [
                {
                  name: 'Lat Pulldown',
                  sets: 4,
                  reps: '10-12',
                  weight: '65 KG',
                  restTimeSeconds: 75,
                  notes: 'Geniş tutuş, kürek kemiklerini aşağı çek.',
                  videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
                  order: 1,
                },
                {
                  name: 'Seated Cable Row',
                  sets: 4,
                  reps: '10-12',
                  weight: '60 KG',
                  restTimeSeconds: 75,
                  notes: 'Göğüs dik, karna doğru çekiş.',
                  videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
                  order: 2,
                },
                {
                  name: 'Triceps Rope Pushdown',
                  sets: 4,
                  reps: '12-15',
                  weight: '25 KG',
                  restTimeSeconds: 60,
                  notes: 'Alt noktada halatı dışarı doğru aç.',
                  videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
                  order: 3,
                },
                {
                  name: 'Skull Crushers (Lying Triceps Extension)',
                  sets: 3,
                  reps: '10-12',
                  weight: '25 KG',
                  restTimeSeconds: 75,
                  notes: 'Dirsekler sabit, alna doğru kontrollü iniş.',
                  videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
                  order: 4,
                },
              ],
            },
          },
          {
            dayName: 'Çarşamba',
            focus: 'Dinlenme & Hafif Kardiyo (Rest & Recovery)',
            order: 3,
            exercises: {
              create: [
                {
                  name: 'Treadmill Incline Walk',
                  sets: 1,
                  reps: '30 dk',
                  weight: 'Eğim %10, Hız 5.5',
                  restTimeSeconds: 0,
                  notes: 'Nabız 120-130 aralığında hafif toparlanma kardiyosu.',
                  videoUrl: 'https://www.youtube.com/watch?v=p3r5f2oW8yE',
                  order: 1,
                },
              ],
            },
          },
          {
            dayName: 'Perşembe',
            focus: 'Omuz & Karın (Shoulders & Abs)',
            order: 4,
            exercises: {
              create: [
                {
                  name: 'Overhead Shoulder Press',
                  sets: 4,
                  reps: '8-10',
                  weight: '45 KG',
                  restTimeSeconds: 90,
                  notes: 'Omurga nötr, core kaslarını sıkı tut.',
                  videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
                  order: 1,
                },
                {
                  name: 'Lateral Raise (Dumbbell)',
                  sets: 4,
                  reps: '15',
                  weight: '10 KG',
                  restTimeSeconds: 60,
                  notes: 'Hafif ağırlık, saf yan omuz izolasyonu.',
                  videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
                  order: 2,
                },
                {
                  name: 'Hanging Leg Raise',
                  sets: 4,
                  reps: '15',
                  weight: 'Vücut Ağırlığı',
                  restTimeSeconds: 60,
                  notes: 'Beli bükmeden kalçayı yukarı yuvarla.',
                  videoUrl: 'https://www.youtube.com/watch?v=hdng3Nm1x_E',
                  order: 3,
                },
              ],
            },
          },
          {
            dayName: 'Cuma',
            focus: 'Bacak & Kalça (Legs & Quads)',
            order: 5,
            exercises: {
              create: [
                {
                  name: 'Barbell Back Squat',
                  sets: 4,
                  reps: '8-10',
                  weight: '90 KG',
                  restTimeSeconds: 120,
                  notes: 'Paralelin altına in, dizler ayak ucu yönünde.',
                  videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
                  order: 1,
                },
                {
                  name: 'Leg Press',
                  sets: 4,
                  reps: '12',
                  weight: '160 KG',
                  restTimeSeconds: 90,
                  notes: 'Dizleri tepe noktada kilitleme.',
                  videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
                  order: 2,
                },
                {
                  name: 'Lying Leg Curl',
                  sets: 4,
                  reps: '12-15',
                  weight: '45 KG',
                  restTimeSeconds: 60,
                  notes: 'Hamstring kaslarını tepe noktada 1 saniye sık.',
                  videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Also create a workout plan for Zeynep Kaya (Female member)
  const zeynep = createdMembers[1];
  await prisma.workoutPlan.create({
    data: {
      gymId: fitZone.id,
      memberId: zeynep.id,
      trainerId: trainers[1].id,
      title: 'Kadınlara Özel Sıkılaşma & Kalça-Bacak',
      description: 'Metabolik hızlandırıcı, postür düzeltici ve alt gövde odaklı plan.',
      startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      isActive: true,
      days: {
        create: [
          {
            dayName: 'Pazartesi',
            focus: 'Glute & Hamstrings (Kalça & Arka Bacak)',
            order: 1,
            exercises: {
              create: [
                {
                  name: 'Barbell Hip Thrust',
                  sets: 4,
                  reps: '12-15',
                  weight: '50 KG',
                  restTimeSeconds: 75,
                  notes: 'Tepe noktada kalçayı 2 saniye sık, çene göğse yakın.',
                  videoUrl: 'https://www.youtube.com/watch?v=xDmFkJxPzeM',
                  order: 1,
                },
                {
                  name: 'Romanian Deadlift (Dumbbell)',
                  sets: 4,
                  reps: '12',
                  weight: '16 KG x 2',
                  restTimeSeconds: 60,
                  notes: 'Kalçayı geriye it, sırt düz kalsın.',
                  videoUrl: 'https://www.youtube.com/watch?v=_oyxCn2iSjU',
                  order: 2,
                },
                {
                  name: 'Bulgarian Split Squat',
                  sets: 3,
                  reps: '10 her bacak',
                  weight: '8 KG x 2',
                  restTimeSeconds: 60,
                  notes: 'Ön topuktan güç al, diz içe kaçmasın.',
                  videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. Diet Plan for Caner Erkin
  await prisma.dietPlan.create({
    data: {
      gymId: fitZone.id,
      memberId: caner.id,
      trainerId: trainers[0].id,
      title: 'Temiz Hacim (Clean Bulk) Beslenme Planı',
      targetCalories: 2650,
      targetProtein: 175,
      targetCarbs: 320,
      targetFat: 75,
      isActive: true,
      meals: {
        create: [
          {
            name: 'Kahvaltı',
            time: '08:00',
            order: 1,
            items: {
              create: [
                { food: 'Yumurta (3 tam + 2 beyaz)', amount: '5 adet', calories: 280, protein: 28, carbs: 2, fat: 18 },
                { food: 'Yulaf Ezmesi + Badem Sütü', amount: '80 gr', calories: 310, protein: 11, carbs: 54, fat: 6 },
                { food: 'Muz & 1 tatlı kaşığı Bal', amount: '1 adet orta boy', calories: 140, protein: 1, carbs: 34, fat: 0 },
              ],
            },
          },
          {
            name: 'Ara Öğün 1',
            time: '11:00',
            order: 2,
            items: {
              create: [
                { food: 'Çiğ Badem & Ceviz', amount: '30 gr', calories: 190, protein: 6, carbs: 4, fat: 17 },
                { food: 'Yeşil Elma', amount: '1 adet', calories: 80, protein: 0, carbs: 20, fat: 0 },
              ],
            },
          },
          {
            name: 'Öğle Yemeği',
            time: '13:30',
            order: 3,
            items: {
              create: [
                { food: 'Izgara Tavuk Göğsü', amount: '200 gr', calories: 330, protein: 62, carbs: 0, fat: 7 },
                { food: 'Basmati Pirinç Pilavı', amount: '200 gr (pişmiş)', calories: 260, protein: 5, carbs: 57, fat: 1 },
                { food: 'Zeytinyağlı Mevsim Salata', amount: '1 büyük kase', calories: 120, protein: 2, carbs: 8, fat: 9 },
              ],
            },
          },
          {
            name: 'Ara Öğün 2 (Antrenman Öncesi)',
            time: '16:30',
            order: 4,
            items: {
              create: [
                { food: 'Pirinç Patlağı + Fıstık Ezmesi', amount: '3 dilim + 20 gr', calories: 210, protein: 7, carbs: 26, fat: 9 },
                { food: 'Filtre Kahve (Sade)', amount: '1 kupa', calories: 5, protein: 0, carbs: 1, fat: 0 },
              ],
            },
          },
          {
            name: 'Akşam Yemeği',
            time: '19:30',
            order: 5,
            items: {
              create: [
                { food: 'Fırın Somon veya Yağsız Biftek', amount: '180 gr', calories: 370, protein: 42, carbs: 0, fat: 22 },
                { food: 'Fırınlanmış Tatlı Patates', amount: '200 gr', calories: 180, protein: 3, carbs: 42, fat: 0 },
                { food: 'Haşlanmış Brokoli & Kuşkonmaz', amount: '150 gr', calories: 55, protein: 4, carbs: 10, fat: 0 },
              ],
            },
          },
          {
            name: 'Ek Gece Öğünü (Gerektiğinde)',
            time: '22:00',
            order: 6,
            items: {
              create: [
                { food: 'Yağsız Süzme Lor Peyniri veya Kazein', amount: '100 gr', calories: 110, protein: 20, carbs: 3, fat: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  // 7. Body Measurements for Caner Erkin (historical tracking for rich charts)
  const measurementHistory = [
    { daysAgo: 60, weight: 84.5, height: 182, bodyFat: 21.5, muscleMass: 38.2, waist: 91.0, chest: 101.0, arm: 35.5, leg: 58.0, shoulder: 118.0 },
    { daysAgo: 45, weight: 83.2, height: 182, bodyFat: 19.8, muscleMass: 38.8, waist: 88.5, chest: 102.0, arm: 36.0, leg: 58.5, shoulder: 119.0 },
    { daysAgo: 30, weight: 82.0, height: 182, bodyFat: 18.2, muscleMass: 39.4, waist: 86.0, chest: 103.5, arm: 36.8, leg: 59.0, shoulder: 120.5 },
    { daysAgo: 15, weight: 81.1, height: 182, bodyFat: 16.9, muscleMass: 40.1, waist: 84.0, chest: 104.5, arm: 37.5, leg: 59.8, shoulder: 122.0 },
    { daysAgo: 1,  weight: 80.4, height: 182, bodyFat: 15.6, muscleMass: 40.8, waist: 82.5, chest: 106.0, arm: 38.2, leg: 60.5, shoulder: 123.5 },
  ];

  for (const m of measurementHistory) {
    const d = new Date(now.getTime() - m.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.measurement.create({
      data: {
        gymId: fitZone.id,
        memberId: caner.id,
        date: d,
        weight: m.weight,
        height: m.height,
        bodyFat: m.bodyFat,
        muscleMass: m.muscleMass,
        waist: m.waist,
        chest: m.chest,
        arm: m.arm,
        leg: m.leg,
        shoulder: m.shoulder,
        notes: `Rutin antrenör kontrolü - ${m.daysAgo} gün önceki ölçüm.`,
      },
    });

    await prisma.timelineEvent.create({
      data: {
        gymId: fitZone.id,
        memberId: caner.id,
        type: 'MEASUREMENT',
        title: 'Vücut Ölçümü Eklendi',
        description: `Kilo: ${m.weight} kg, Yağ Oranı: %${m.bodyFat}, Kol: ${m.arm} cm.`,
        createdAt: d,
      },
    });
  }

  // 8. Check-in records:
  // Today's check-ins (some still currently inside with null checkOutTime to show "Salonda X Kişi"!)
  const checkedInMembers = [
    createdMembers[0], // Caner Erkin (INSIDE)
    createdMembers[1], // Zeynep Kaya (INSIDE)
    createdMembers[2], // Emre Demir (INSIDE)
    createdMembers[3], // Elif Yıldız (Checked out)
    createdMembers[4], // Barış Öztürk (INSIDE)
    createdMembers[8], // Oğuzhan Çetin (INSIDE)
    createdMembers[10], // Volkan Arslan (INSIDE)
    createdMembers[12], // Hakan Koç (Checked out)
    createdMembers[14], // Tolga Yavuz (INSIDE)
    createdMembers[16], // Serkan Kurt (INSIDE)
    createdMembers[18], // Alper Taş (Checked out)
    createdMembers[20], // Kerem Şimşek (INSIDE)
  ];

  for (let i = 0; i < checkedInMembers.length; i++) {
    const mem = checkedInMembers[i];
    const isCurrentlyInside = i % 3 !== 0; // 2 out of 3 are currently inside!
    const checkInTime = new Date(now.getTime() - (i * 25 + 15) * 60 * 1000);
    const checkOutTime = isCurrentlyInside ? null : new Date(checkInTime.getTime() + 75 * 60 * 1000);

    await prisma.checkIn.create({
      data: {
        gymId: fitZone.id,
        memberId: mem.id,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        method: i % 2 === 0 ? 'QR_CODE' : 'MANUAL',
      },
    });

    await prisma.timelineEvent.create({
      data: {
        gymId: fitZone.id,
        memberId: mem.id,
        type: 'CHECK_IN',
        title: 'Salona Giriş Yapıldı',
        description: `Turnike QR okutuldu. (${checkInTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`,
        createdAt: checkInTime,
      },
    });
  }

  // Past 7 days historical check-in data for weekly charts
  for (let day = 1; day <= 7; day++) {
    const dateOfDay = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
    const dailyCount = 14 + Math.floor(Math.sin(day) * 6 + Math.random() * 4);
    for (let c = 0; c < dailyCount; c++) {
      const randomMember = createdMembers[c % createdMembers.length];
      const checkInTime = new Date(dateOfDay.getTime() + (8 + (c % 12)) * 3600 * 1000);
      const checkOutTime = new Date(checkInTime.getTime() + 65 * 60 * 1000);
      await prisma.checkIn.create({
        data: {
          gymId: fitZone.id,
          memberId: randomMember.id,
          checkInTime: checkInTime,
          checkOutTime: checkOutTime,
          method: 'QR_CODE',
        },
      });
    }
  }

  // 9. Workout Log records (completed workouts for history & streak)
  await prisma.workoutLog.create({
    data: {
      gymId: fitZone.id,
      memberId: caner.id,
      workoutDayTitle: 'Göğüs & Ön Kol (Chest & Biceps)',
      completedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      durationMinutes: 52,
      completedExercises: JSON.stringify([
        { name: 'Barbell Bench Press', completed: true, weight: '75 KG', sets: 4 },
        { name: 'Incline Dumbbell Press', completed: true, weight: '26 KG', sets: 3 },
        { name: 'Cable Fly', completed: true, weight: '15 KG', sets: 3 },
        { name: 'Barbell EZ Bicep Curl', completed: true, weight: '30 KG', sets: 4 },
        { name: 'Hammer Curls', completed: true, weight: '14 KG', sets: 3 },
      ]),
      notes: 'Form oldukça sağlamdı, Bench Press ağırlığı bir sonraki seans 2.5kg artırılabilir.',
    },
  });

  await prisma.timelineEvent.create({
    data: {
      gymId: fitZone.id,
      memberId: caner.id,
      type: 'WORKOUT_COMPLETED',
      title: 'Antrenman Tamamlandı',
      description: 'Göğüs & Ön Kol seansı 52 dakikada 5 egzersiz ile başarıyla tamamlandı.',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // 10. Notifications
  await prisma.notification.createMany({
    data: [
      {
        gymId: fitZone.id,
        memberId: caner.id,
        title: 'Yeni Antrenman Programınız Hazır! 💪',
        message: 'Antrenörünüz Murat Kaya size özel "4 Günlük Split Hipertrofi" programını oluşturdu.',
        type: 'WORKOUT',
        isRead: false,
        createdAt: new Date(now.getTime() - 4 * 3600 * 1000),
      },
      {
        gymId: fitZone.id,
        memberId: caner.id,
        title: 'Diyet Listeniz Güncellendi 🥗',
        message: 'Günlük protein hedefiniz 175 grama yükseltildi.',
        type: 'DIET',
        isRead: false,
        createdAt: new Date(now.getTime() - 24 * 3600 * 1000),
      },
      {
        gymId: fitZone.id,
        memberId: caner.id,
        title: 'Bugünkü Antrenmanını Unutma! 🔥',
        message: 'Bugün programında Göğüs & Ön Kol günü var. Harika bir seans seni bekliyor.',
        type: 'REMINDER',
        isRead: true,
        createdAt: new Date(now.getTime() - 48 * 3600 * 1000),
      },
      {
        gymId: fitZone.id,
        userId: fitZoneAdmin.id,
        title: '3 Üyenin Aboneliği Bu Hafta Sona Eriyor ⚠️',
        message: 'Elif Yıldız, Barış Öztürk ve Cansu Güler üyeliği 7 gün içinde bitecek.',
        type: 'MEMBERSHIP',
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 3600 * 1000),
      },
      {
        gymId: fitZone.id,
        userId: fitZoneAdmin.id,
        title: '7 Günlük Deneme Sürümü Aktif 🚀',
        message: 'FitZone Pro Club deneme sürenizin bitmesine 5 gün kaldı. Tüm özellikleri sınırsızca test edebilirsiniz.',
        type: 'SYSTEM',
        isRead: false,
        createdAt: new Date(now.getTime() - 48 * 3600 * 1000),
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('--- DEMO ACCOUNTS ---');
  console.log('FitZone Gym Admin:  admin@fitzone.com / Password123!');
  console.log('Trainer (Murat):    murat@fitzone.com / Password123!');
  console.log('Member (Caner):     caner@gmail.com / Password123! (Code: GYM-A7K92X)');
  console.log('Member (Zeynep):    zeynep@gmail.com / Password123! (Code: GYM-B3M81Y)');
  console.log('Expired Gym Admin:  admin@apexfit.com / Password123! (Tests expired trial)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

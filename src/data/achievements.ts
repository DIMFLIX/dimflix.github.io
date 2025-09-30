// Centralized lists used in About and Resume pages
// Keep images exactly as shown on About

export const awardsList = [
  { src: require("@/assets/awards/it-planet-ai-спорттех-финал.png"), alt: { ru: "Диплом за 3 место международной олимпиады «IT-Планета 2024».", en: "Diploma for 3rd place at the international olympiad ‘IT‑Planet 2024’." }},
  { src: require("@/assets/awards/Международный-ВШЭ-Дроны.jpg"), alt: { ru: "Диплом победителя Международного онлайн‑хакатона «Цифровая трансформация АПК». ВШЭ.", en: "Winner’s diploma of the International online hackathon ‘Digital Transformation of Agro‑Industry’. HSE." }},
  { src: require("@/assets/awards/Международный-ВШЭ.png"), alt: { ru: "Диплом победителя Международного онлайн‑хакатона «Умный дом. Умный город». ВШЭ.", en: "Winner’s diploma of the International online hackathon ‘Smart Home. Smart City’. HSE." }},
  { src: require("@/assets/awards/Диплом-Минина.png"), alt: { ru: "Диплом за 2 место Всероссийского научно‑технического хакатона «Minin Code» (Web‑разработка). Нижний Новгород.", en: "Diploma for 2nd place at the All‑Russian scientific‑technical hackathon ‘Minin Code’ (Web Development). Nizhny Novgorod." }},
  { src: require("@/assets/awards/IT-Чкалов.png"), alt: { ru: "Диплом за 1 место в городском конкурсе по ИТ «IT‑Чкалов». Нижний Новгород.", en: "First place diploma in the city IT competition ‘IT‑Chkalov’. Nizhny Novgorod." }},
] as any

export const patentsList = [
  {
    title: {
      ru: "Программа последовательного получения и обработки видеопотоков с множества USB‑камер, подключенных к одной ЭВМ с помощью USB‑концентратора",
      en: "Program for sequential acquisition and processing of video streams from multiple USB cameras connected to one PC via a USB hub",
    },
    pages: [
      require("@/assets/patents/patent-prevm-page1.png"),
      require("@/assets/patents/patent-prevm-page2.png"),
    ],
  },
] as any

export const certificatesList = [
  { src: require("@/assets/significant-certificates/it-planet ai-спорттех.png"), alt: { ru: "Сертификат участника олимпиады «IT‑Планета»: трек «AI‑Спорттех».", en: "Certificate of participation in the ‘IT‑Planet’ olympiad: AI‑SportTech track." }},
  { src: require("@/assets/significant-certificates/it-planet postgresql.png"), alt: { ru: "Сертификат олимпиады «IT‑Планета»: PostgreSQL.", en: "‘IT‑Planet’ olympiad: PostgreSQL certificate." }},
  { src: require("@/assets/significant-certificates/SberGarage.png"), alt: { ru: "Сертификат Sber Garage.", en: "Sber Garage certificate." }},
  { src: require("@/assets/significant-certificates/Атомик-Хак.png"), alt: { ru: "Сертификат участника Всероссийского хакатона «АтомикХак». Нижний Новгород, 2023.", en: "Participant certificate of the All‑Russian hackathon ‘AtomicHack’. Nizhny Novgorod, 2023." }},
  { src: require("@/assets/significant-certificates/всероссийский.png"), alt: { ru: "Нижний Новгород, Цифровой прорыв, Всероссийский хакатон, 2023.", en: "Nizhny Novgorod, Digital Breakthrough, All‑Russian hackathon, 2023." }},
  { src: require("@/assets/significant-certificates/москва.png"), alt: { ru: "Москва, Цифровой прорыв, Международный хакатон, 2023.", en: "Moscow, Digital Breakthrough, International hackathon, 2023." }},
  { src: require("@/assets/significant-certificates/пфо-цп.png"), alt: { ru: "Цифровой прорыв — Приволжский федеральный округ (ПФО).", en: "Digital Breakthrough — Volga Federal District." }},
  { src: require("@/assets/significant-certificates/Сертификат-Минина.png"), alt: { ru: "Сертификат участника Всероссийского хакатона «Minin Code» (Web‑разработка). Нижний Новгород.", en: "Participant certificate of the All‑Russian hackathon ‘Minin Code’ (Web Development). Nizhny Novgorod." }},
  { src: require("@/assets/significant-certificates/хабаровск.png"), alt: { ru: "Сертификат, Хакатон, Хабаровск, Дальневосточный федеральный округ, 2023.", en: "Certificate, Hackathon, Khabarovsk, Far Eastern Federal District, 2023." }},
  { src: require("@/assets/significant-certificates/цп-омск.png"), alt: { ru: "Омск, Цифровой прорыв, Всероссийский хакатон, 2024.", en: "Omsk, Digital Breakthrough, All‑Russian hackathon, 2024." }},
  // additional certificates block
  { src: require("@/assets/certificates/Comparison-ResumeVacancy.png"), alt: { ru: "Сертификат участника гибридного хакатона «ML TALENTMATCH»: «Алгоритм для сопоставления резюме и вакансии».", en: "Participant certificate of the hybrid hackathon ‘ML TALENTMATCH’: ‘Algorithm for matching resumes and vacancies’." }},
  { src: require("@/assets/certificates/HR-T1.png"), alt: { ru: "Сертификат участника «Хакатона Т1: Нижний Новгород». Трек: «HR‑Монитор: управление эффективностью».", en: "Participant certificate of ‘T1 Hackathon: Nizhny Novgorod’. Track: ‘HR‑Monitor: performance management’." }},
  { src: require("@/assets/certificates/ProjectSystemINNOHack.png"), alt: { ru: "Сертификат участника хакатона «IT INNO HACK»: «Система управления проектами».", en: "Participant certificate of the ‘IT INNO HACK’: ‘Project management system’." }},
  { src: require("@/assets/certificates/траектория-будущего-devops.png"), alt: { ru: "«Траектория будущего»: сертификат участника (DevOps).", en: "‘Trajectory of the Future’: participant certificate (DevOps)." }},
  { src: require("@/assets/certificates/траектория-будущего-python.png"), alt: { ru: "«Траектория будущего»: сертификат участника (Python).", en: "‘Trajectory of the Future’: participant certificate (Python)." }},
  { src: require("@/assets/certificates/траектория-будущего-графический-дизайн.png"), alt: { ru: "«Траектория будущего»: сертификат участника (Графический дизайн).", en: "‘Trajectory of the Future’: participant certificate (Graphic Design)." }},
  { src: require("@/assets/certificates/траектория-будущего-кибербезопасность.png"), alt: { ru: "«Траектория будущего»: сертификат участника (Кибербезопасность).", en: "‘Trajectory of the Future’: participant certificate (Cybersecurity)." }},
  { src: require("@/assets/certificates/траектория-будущего-мобильная-разработка.png"), alt: { ru: "«Траектория будущего»: сертификат участника (Мобильная разработка).", en: "‘Trajectory of the Future’: participant certificate (Mobile Development)." }},
  { src: require("@/assets/certificates/траектория-будущего-нейросетевое-искусство.png"), alt: { ru: "«Траектория будущего»: сертификат участника (Нейросетевое искусство).", en: "‘Trajectory of the Future’: participant certificate (Neural Art)." }},
  { src: require("@/assets/certificates/траектория-будущего-финансовая-грамотность.png"), alt: { ru: "«Траектория будущего»: сертификат участника (Финансовая грамотность).", en: "‘Trajectory of the Future’: participant certificate (Financial Literacy)." }},
  { src: require("@/assets/certificates/цифровизация-во-благо.png"), alt: { ru: "Сертификат участника конкурса «Цифровизация во благо».", en: "Participant certificate of the contest ‘Digitalization for Good’." }},
] as any


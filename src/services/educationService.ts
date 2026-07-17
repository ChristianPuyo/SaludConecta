import type { EducationalArticle, ArticleCategory } from '../models/education';

const MOCK_ARTICLES: EducationalArticle[] = [
  {
    id: '1',
    title: 'Prevención del Dengue',
    description: 'Aprende cómo eliminar criaderos de mosquitos y proteger a tu familia del dengue.',
    category: 'dengue',
    readTime: 5,
    featured: true,
    content: 'El dengue es una enfermedad viral transmitida por la picadura del mosquito Aedes aegypti. Para prevenirla:\n\n1. Elimina recipientes con agua estancada.\n2. Usa repelente y mosquiteros.\n3. Mantén los patios y jardines limpios.\n4. Cambia el agua de floreros cada 3 días.\n5. Tapa los depósitos de agua.\n\nAnte síntomas como fiebre alta, dolor muscular o erupciones, acude al centro de salud más cercano.',
    createdAt: '2026-06-01',
  },
  {
    id: '2',
    title: 'COVID-19: Prevención y cuidados',
    description: 'Medidas para prevenir el contagio de COVID-19 y proteger a los más vulnerables.',
    category: 'covid',
    readTime: 4,
    featured: true,
    content: 'El COVID-19 sigue siendo una amenaza. Mantén estas medidas:\n\n1. Lávate las manos frecuentemente.\n2. Usa mascarilla en espacios cerrados.\n3. Ventila los ambientes.\n4. Mantén tu esquema de vacunación al día.\n5. Si tienes síntomas, aíslate y hazte una prueba.',
    createdAt: '2026-05-15',
  },
  {
    id: '3',
    title: 'Esquema de Vacunación en el Perú',
    description: 'Conoce las vacunas obligatorias para niños y adultos según el MINSA.',
    category: 'vacunas',
    readTime: 6,
    featured: true,
    content: 'El Ministerio de Salud del Perú ofrece vacunas gratuitas para todas las etapas de la vida:\n\nRecién nacidos: BCG y Hepatitis B\n2 meses: Pentavalente, Polio, Rotavirus\n4 meses: Segunda dosis\n6 meses: Tercera dosis\n1 año: SRP, Neumococo\n18 meses: Refuerzos\n\nAdultos: Influenza anual, Tétanos cada 10 años, COVID-19.',
    createdAt: '2026-04-20',
  },
  {
    id: '4',
    title: 'Alimentación Saludable en la Amazonía',
    description: 'Aprovecha los nutrientes de los alimentos amazónicos para una dieta balanceada.',
    category: 'alimentacion',
    readTime: 7,
    featured: false,
    content: 'La Amazonía peruana ofrece una variedad de alimentos nutritivos:\n\n- Frutas: camu camu (vitamina C), aguaje (vitamina A), cocona.\n- Pescados: paiche, doncella, sábalo (ricos en omega 3).\n- Tubérculos: yuca, plátano, daledale.\n\nUna alimentación balanceada fortalece tu sistema inmunológico y previene enfermedades.',
    createdAt: '2026-03-10',
  },
  {
    id: '5',
    title: 'Salud Infantil: Cuidados Esenciales',
    description: 'Guía básica para madres y padres sobre la salud de los niños en comunidades amazónicas.',
    category: 'salud_infantil',
    readTime: 8,
    featured: false,
    content: 'Cuidados esenciales para la salud infantil:\n\n1. Control de crecimiento y desarrollo (CRED).\n2. Vacunación oportuna según calendario.\n3. Lactancia materna exclusiva hasta los 6 meses.\n4. Alimentación complementaria nutritiva.\n5. Prevención de enfermedades diarreicas y respiratorias.\n6. Signos de alarma: fiebre alta, dificultad para respirar, convulsiones.',
    createdAt: '2026-02-20',
  },
  {
    id: '6',
    title: 'Primeros Auxilios Básicos',
    description: 'Acciones inmediatas que puedes realizar ante emergencias comunes.',
    category: 'primeros_auxilios',
    readTime: 6,
    featured: false,
    content: 'Ante una emergencia, mantén la calma y sigue estos pasos:\n\nQuemaduras: Enfría con agua corriente 10 minutos. No apliques hielo ni pasta dental.\nHeridas: Limpia con agua y jabón, cubre con gasa estéril.\nPicaduras de serpiente: Inmoviliza la zona, no succiones ni apliques torniquete. Acude URGENTE al centro de salud.\nAtragantamiento: Aplica la maniobra de Heimlich.\n\nNúmero de emergencia: 911 / 106 (SAMU).',
    createdAt: '2026-01-15',
  },
  {
    id: '7',
    title: 'Prevención de Enfermedades Diarreicas',
    description: 'Cómo evitar las enfermedades diarreicas en comunidades sin agua potable.',
    category: 'prevencion',
    readTime: 5,
    featured: false,
    content: 'Las enfermedades diarreicas son prevenibles:\n\n1. Hierve o clora el agua antes de beberla.\n2. Lávate las manos con agua y jabón después de ir al baño y antes de comer.\n3. Lava bien las frutas y verduras.\n4. Consume alimentos bien cocidos.\n5. Mantén los alimentos cubiertos para evitar moscas.\n6. Si tienes diarrea, toma sales de rehidratación oral.',
    createdAt: '2026-01-05',
  },
  {
    id: '8',
    title: 'Salud Mental en la Comunidad',
    description: 'Reconoce las señales de alerta y busca ayuda cuando sea necesario.',
    category: 'general',
    readTime: 4,
    featured: false,
    content: 'La salud mental es tan importante como la salud física. Señales de alerta:\n\n- Cambios bruscos de ánimo\n- Aislamiento social\n- Problemas para dormir o comer\n- Pensamientos negativos constantes\n\nSi tú o alguien de tu comunidad necesita ayuda, acude al centro de salud más cercano. Líneas de ayuda: 113 (opción 5).',
    createdAt: '2025-12-20',
  },
];

const ARTICLE_KEYS = '@saludconecta/education_articles';

export const EducationService = {
  async getAll(): Promise<EducationalArticle[]> {
    return MOCK_ARTICLES;
  },

  async getById(id: string): Promise<EducationalArticle | undefined> {
    return MOCK_ARTICLES.find((a) => a.id === id);
  },

  async getByCategory(category: ArticleCategory): Promise<EducationalArticle[]> {
    return MOCK_ARTICLES.filter((a) => a.category === category);
  },

  async getFeatured(): Promise<EducationalArticle[]> {
    return MOCK_ARTICLES.filter((a) => a.featured);
  },

  async search(query: string): Promise<EducationalArticle[]> {
    const q = query.toLowerCase();
    return MOCK_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
    );
  },
};

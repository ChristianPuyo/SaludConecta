import type { ChatMessage, FAQEntry } from '../models/chat';

const FAQS: FAQEntry[] = [
  { keywords: ['fiebre', 'temperatura', 'calentura'], answer: 'Si tienes fiebre (temperatura mayor a 38°C), descansa, hidrátate y monitorea tu temperatura. Si persiste más de 3 días o es muy alta, acude al centro de salud.', category: 'sintomas' },
  { keywords: ['dengue', 'mosquito', 'aedes'], answer: 'El dengue se transmite por el mosquito Aedes aegypti. Los síntomas incluyen fiebre alta, dolor muscular y detrás de los ojos. Ante estos síntomas, acude al centro de salud. No te automediques.', category: 'prevencion' },
  { keywords: ['diarrea', 'vómitos', 'deshidratación'], answer: 'Toma sales de rehidratación oral y abundante agua. Si la diarrea es persistente o hay sangre, acude al centro de salud de inmediato.', category: 'sintomas' },
  { keywords: ['centro de salud', 'hospital', 'posta', 'médico'], answer: 'Puedes consultar el Directorio de Centros de Salud en la sección correspondiente de la aplicación para encontrar el centro más cercano a tu comunidad.', category: 'centros' },
  { keywords: ['vacuna', 'vacunación', 'dosis'], answer: 'Mantener tu esquema de vacunación al día es esencial. Revisa tu Calendario de Vacunación en la app para saber qué vacunas necesitas.', category: 'vacunas' },
  { keywords: ['tos', 'resfriado', 'gripe'], answer: 'Si tienes tos, usa mascarilla, evita el contacto con otras personas y descansa. Si la tos persiste más de una semana o hay dificultad para respirar, busca atención médica.', category: 'sintomas' },
  { keywords: ['presión arterial', 'hipertensión', 'presión alta'], answer: 'La presión arterial normal es alrededor de 120/80 mmHg. Si tienes presión alta recurrente, consulta a un médico. Reduce el consumo de sal y realiza actividad física.', category: 'salud' },
  { keywords: ['glucosa', 'diabetes', 'azúcar'], answer: 'La glucosa normal en ayunas es de 70-100 mg/dL. Si tienes niveles elevados, consulta a un médico y lleva una dieta balanceada baja en azúcares.', category: 'salud' },
  { keywords: ['primeros auxilios', 'emergencia', 'accidente'], answer: 'Ante una emergencia: 1) Mantén la calma. 2) Llama al 911 o 106 (SAMU). 3) No muevas a la persona si no es necesario. 4) Brinda primeros auxilios básicos si sabes hacerlo.', category: 'primeros_auxilios' },
  { keywords: ['malaria', 'paludismo'], answer: 'La malaria es transmitida por el mosquito Anopheles. Los síntomas incluyen fiebre, escalofríos y sudoración. Si sospechas que tienes malaria, acude al centro de salud para una prueba gratuita.', category: 'prevencion' },
  { keywords: ['salud mental', 'depresión', 'ansiedad'], answer: 'La salud mental es importante. Si te sientes triste, ansioso o abrumado, habla con alguien de confianza. Puedes llamar a la línea 113 (opción 5) del MINSA para apoyo psicológico gratuito.', category: 'salud' },
  { keywords: ['embarazo', 'maternidad', 'gestante'], answer: 'Si estás embarazada, asiste a tus controles prenatales mensuales. El centro de salud te brindará atención gratuita. La lactancia materna exclusiva hasta los 6 meses es recomendada.', category: 'salud' },
  { keywords: ['leptospirosis', 'rata', 'orina'], answer: 'La leptospirosis se transmite por contacto con agua contaminada con orina de animales. Evita caminar descalzo en zonas inundadas. Si tienes fiebre y dolor muscular después de una inundación, acude al centro de salud.', category: 'prevencion' },
];

export const ChatService = {
  getFAQs(): FAQEntry[] {
    return FAQS;
  },

  findAnswer(query: string): string {
    const q = query.toLowerCase();
    const words = q.split(/\s+/);

    let bestMatch: FAQEntry | null = null;
    let maxScore = 0;

    for (const faq of FAQS) {
      let score = 0;
      for (const kw of faq.keywords) {
        if (q.includes(kw)) {
          score += 3;
        }
        for (const word of words) {
          if (kw.includes(word) && word.length > 2) {
            score += 1;
          }
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch && maxScore > 0) {
      return bestMatch.answer;
    }

    return 'Lo siento, no tengo una respuesta para esa pregunta. Puedes consultar la sección de Educación o contactar a tu centro de salud para más información.';
  },

  createUserMessage(text: string): ChatMessage {
    return {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
  },

  createBotMessage(text: string): ChatMessage {
    return {
      id: (Date.now() + 1).toString(),
      text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
  },
};

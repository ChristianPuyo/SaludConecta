export type IMCCategory = 'bajo' | 'normal' | 'sobrepeso' | 'obesidad';
export type RiesgoDiabetes = 'bajo' | 'medio' | 'alto';

export function calcIMC(pesoKg: number, tallaCm: number): { imc: number; categoria: IMCCategory } {
  const tallaM = tallaCm / 100;
  const imc = pesoKg / (tallaM * tallaM);
  let categoria: IMCCategory;
  if (imc < 18.5) categoria = 'bajo';
  else if (imc < 25) categoria = 'normal';
  else if (imc < 30) categoria = 'sobrepeso';
  else categoria = 'obesidad';
  return { imc: Math.round(imc * 10) / 10, categoria };
}

export function calcFrecuenciaCardiaca(edad: number) {
  const fcMax = 220 - edad;
  return {
    fcMax,
    zonaQuemaGrasa: `${Math.round(fcMax * 0.6)} - ${Math.round(fcMax * 0.7)}`,
    zonaCardio: `${Math.round(fcMax * 0.7)} - ${Math.round(fcMax * 0.8)}`,
    zonaMaxima: `${Math.round(fcMax * 0.8)} - ${fcMax}`,
  };
}

export function calcRiesgoDiabetes(respuestas: boolean[]): RiesgoDiabetes {
  const count = respuestas.filter(Boolean).length;
  if (count >= 3) return 'alto';
  if (count >= 2) return 'medio';
  return 'bajo';
}

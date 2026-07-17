export function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-]{7,15}$/.test(phone);
}

export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= 0 && age <= 150;
}

export function isValidBloodPressure(bp: string): boolean {
  const parts = bp.split('/').map(Number);
  return parts.length === 2 && parts.every((n) => !isNaN(n) && n > 0 && n < 300);
}

export function isValidTemperature(temp: number): boolean {
  return temp >= 34 && temp <= 42;
}

export function isValidGlucose(glucose: number): boolean {
  return glucose >= 20 && glucose <= 600;
}

export function isValidHeartRate(hr: number): boolean {
  return hr >= 30 && hr <= 250;
}

export function isValidWeight(weight: number): boolean {
  return weight >= 1 && weight <= 400;
}

export function isValidHeight(height: number): boolean {
  return height >= 20 && height <= 250;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

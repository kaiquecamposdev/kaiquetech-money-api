export function dateTransform(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  
  return new Date(year, month - 1, day);
}
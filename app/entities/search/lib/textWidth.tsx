export function textWidth(text: number) {
  if (text > 12) return 200;
  if (text > 10 && text <= 12) return 160;
  if (text >= 7 && text <= 10) return 130;
  if (text > 5 && text < 8) return 80;
  if (text <= 5) return 60;
}

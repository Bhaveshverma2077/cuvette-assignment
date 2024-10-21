export function generateSixDigitOTP() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return String(randomNumber).padStart(6, "0");
}

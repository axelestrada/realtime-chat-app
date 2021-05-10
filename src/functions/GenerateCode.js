export default function GenerateCode() {
  const characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let code = "";

  while (code.length <= 4) {
    code += characters[Math.floor(Math.random() * 10)];
  }

  return code;
}

const fs=require('fs');
const input= process.argv;

fs.writeFileSync(input[2], input[3])
console.log(input)
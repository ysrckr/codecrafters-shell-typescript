import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

(function command() {
  rl.question("$ ", (answer) => {
    if (
      answer.startsWith("exit") ||
      Number.isInteger(answer[answer.length - 1])
    ) {
      const exitCode = +answer[answer.length - 1];
      rl.close();
      return exitCode;
    }
    console.log(`${answer}: command not found`);
    command();
  });
})();

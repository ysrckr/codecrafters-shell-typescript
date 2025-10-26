import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

(function command() {
  rl.question("$ ", (answer) => {
    if (answer === "exit") {
      rl.close();
      return 0;
    }
    console.log(`${answer}: command not found`);
    command();
  });
})();

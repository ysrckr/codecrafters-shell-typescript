import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

enum Command {
  EXIT = "exit",
  ECHO = "echo",
}

function Echo(answer: string) {
  if (answer.startsWith(Command.ECHO)) {
    console.log(answer.replace(`${Command.ECHO} `, ""));
  } else {
    console.log(`${answer}: command not found`);
  }
}

(function command() {
  rl.question("$ ", (answer) => {
    if (
      answer.startsWith(Command.EXIT) ||
      Number.isInteger(answer[answer.length - 1])
    ) {
      const exitCode = +answer[answer.length - 1];
      rl.close();
      return exitCode;
    }
    Echo(answer);
    command();
  });
})();

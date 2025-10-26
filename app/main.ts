import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

enum BuiltInCommand {
  EXIT = "exit",
  ECHO = "echo",
  TYPE = "type",
}

const builtinCommands = Object.values(BuiltInCommand);

(function command() {
  rl.question("$ ", (answer) => {
    const answerWords = answer.split(" ");
    if (
      answer.startsWith(BuiltInCommand.EXIT) ||
      Number.isInteger(answer[answer.length - 1])
    ) {
      const exitCode = +answer[answer.length - 1];
      rl.close();
      return exitCode;
    }

    if (answerWords.length > 1 && answer.startsWith("type")) {
      if (builtinCommands.includes(answerWords[1] as BuiltInCommand)) {
        console.log(`${answerWords[1]} is a shell builtin`);
      } else {
        console.log(`${answerWords[1]}: not found`);
      }
    } else if (answer.startsWith(BuiltInCommand.ECHO)) {
      console.log(answer.replace(`${BuiltInCommand.ECHO} `, ""));
    } else {
      console.log(`${answer}: command not found`);
    }
    command();
  });
})();

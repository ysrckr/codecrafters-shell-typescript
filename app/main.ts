import fs, { accessSync, existsSync } from "node:fs";

import { createInterface } from "node:readline";
import path from "node:path";
import { spawn } from "node:child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

enum BuiltInCommand {
  EXIT = "exit",
  ECHO = "echo",
  TYPE = "type",
  PWD = "pwd",
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

    if (answer.startsWith(BuiltInCommand.PWD)) {
      console.log(`${path.sep}` + __dirname.split(path.sep).pop());
      return command();
    }

    if (answerWords.length > 0 && process.env.PATH) {
      const commands = answerWords[0];
      const args = answerWords.slice(1);
      const paths = process.env.PATH;
      const parts = paths.split(path.delimiter);

      for (const part of parts) {
        try {
          if (existsSync(part)) {
            accessSync(path.join(part, commands), fs.constants.X_OK);
            const child = spawn(commands, args);

            child.stdout.on("data", (data) => {
              process.stdout.write(String(data));
            });

            child.stderr.on("data", (data) => {
              process.stderr.write(String(data));
            });

            child.on("close", () => {
              command();
            });

            return;
          }
        } catch {
          continue;
        }
      }
    }

    if (answerWords.length > 1 && answer.startsWith("type")) {
      let response = "";
      if (builtinCommands.includes(answerWords[1] as BuiltInCommand)) {
        response = `${answerWords[1]} is a shell builtin`;
      } else if (answer.startsWith(BuiltInCommand.ECHO)) {
        console.log(answer.replace(`${BuiltInCommand.ECHO} `, ""));
      } else if (answerWords[1] && process.env.PATH) {
        const command = answerWords[1];
        const pathPart = process.env.PATH;
        const parts = pathPart.split(path.delimiter);
        let found = false;
        let fullPath = "";
        for (const part of parts) {
          try {
            if (existsSync(part)) {
              accessSync(path.join(part, command), fs.constants.X_OK);
              found = true;
              fullPath = path.join(part, command);
            }
          } catch {
            continue;
          }
        }
        if (found) {
          response = `${command} is ${fullPath}`;
        } else {
          response = `${answerWords[1]}: not found`;
        }
      }
      console.log(response);
    } else {
      console.log(`${answerWords[0]}: not found`);
    }
    command();
  });
})();

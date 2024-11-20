import * as fs from 'fs';
import * as readline from 'readline';
import Scanner from './Scanner';
import Token from './Token';
import AstPrinter from './tool/AstPrinter'
import Parser from './Parser'
import { Expr } from './Expr';

class Lox {
    static hadError: boolean = false;
    
    public static main(): void {
        const args = process.argv.slice(2);
        if (args.length > 1) {
            console.log("Usage: jlox [script]")
            process.exit(64);
        } else if (args.length == 1) {
            Lox.runFile(args[0]);
        } else {
            Lox.runPrompt();
        }

    }

    private static runFile(path: string): void {
        const bytes = fs.readFileSync(path);
        const content = bytes.toString('utf-8');
        Lox.run(content);
        if (Lox.hadError) process.exit(65);
    }

    private static async runPrompt(): Promise<void> {
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const prompt = (): Promise<string> => {
            return new Promise((resolve) => {
              process.stdout.write("> ");
              reader.once('line', resolve);
            });
          };
      
          try {
            while (true) {
              const line = await prompt();
              if (line === null || line.trim().toLowerCase() === 'exit') break;
              Lox.run(line.trim());
              Lox.hadError = false;
            }
          } finally {
            reader.close();
            console.log("Exiting REPL.");
          }
        }  
        
    private static run(source: string): void {
        const scanner = new Scanner(source);
        const tokens: Token[] = scanner.scanTokens();
        const parser = new Parser(tokens);
        const expression: Expr | null = parser.parse();

        if (this.hadError || expression === null) return;
        console.log(new AstPrinter().print(expression));
        
    }

    static error(line: number, message: string): void {
        Lox.report(line, "", message);
    }

    private static report(line: number, where: string, message: string): void {
        process.stderr.write("[line " + line + "] Error" + where + ": " + message + "\n");
        Lox.hadError = true;
    }
}


Lox.main();

export default Lox;
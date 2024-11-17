"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const Scanner_1 = __importDefault(require("./Scanner"));
class Lox {
    static main() {
        const args = process.argv.slice(2);
        if (args.length > 1) {
            console.log("Usage: jlox [script]");
            process.exit(64);
        }
        else if (args.length == 1) {
            Lox.runFile(args[0]);
        }
        else {
            Lox.runPrompt();
        }
    }
    static runFile(path) {
        const bytes = fs.readFileSync(path);
        const content = bytes.toString('utf-8');
        Lox.run(content);
        if (Lox.hadError)
            process.exit(65);
    }
    static runPrompt() {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            const prompt = () => {
                return new Promise((resolve) => {
                    process.stdout.write("> ");
                    reader.once('line', resolve);
                });
            };
            try {
                while (true) {
                    const line = yield prompt();
                    if (line === null || line.trim().toLowerCase() === 'exit')
                        break;
                    Lox.run(line.trim());
                    Lox.hadError = false;
                }
            }
            finally {
                reader.close();
                console.log("Exiting REPL.");
            }
        });
    }
    static run(source) {
        const scanner = new Scanner_1.default(source);
        const tokens = scanner.scanTokens();
        for (const token of tokens) {
            console.log(token);
        }
    }
    static error(line, message) {
        Lox.report(line, "", message);
    }
    static report(line, where, message) {
        process.stderr.write("[line " + line + "] Error" + where + ": " + message + "\n");
        Lox.hadError = true;
    }
}
Lox.hadError = false;
Lox.main();
exports.default = Lox;

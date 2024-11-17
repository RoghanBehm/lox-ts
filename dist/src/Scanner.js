"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenType_1 = __importDefault(require("./TokenType"));
const Token_1 = __importDefault(require("./Token"));
const main_1 = __importDefault(require("./main"));
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.source = source;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token_1.default(TokenType_1.default.EOF, "", null, this.line));
        return this.tokens;
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenType_1.default.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType_1.default.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType_1.default.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType_1.default.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType_1.default.COMMA);
                break;
            case '.':
                this.addToken(TokenType_1.default.DOT);
                break;
            case '-':
                this.addToken(TokenType_1.default.MINUS);
                break;
            case '+':
                this.addToken(TokenType_1.default.PLUS);
                break;
            case ';':
                this.addToken(TokenType_1.default.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenType_1.default.STAR);
                break;
            case '!':
                this.addToken(this.match('=') ? TokenType_1.default.BANG_EQUAL : TokenType_1.default.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType_1.default.EQUAL_EQUAL : TokenType_1.default.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType_1.default.LESS_EQUAL : TokenType_1.default.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType_1.default.GREATER_EQUAL : TokenType_1.default.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(TokenType_1.default.SLASH);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.string();
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    main_1.default.error(this.line, "Unexpected character.");
                }
                break;
        }
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        const text = this.source.substring(this.start, this.current);
        let type = Scanner.keywords.get(text) || TokenType_1.default.IDENTIFIER;
        this.addToken(type);
    }
    number() {
        while (this.isDigit(this.peek()))
            this.advance();
        // Look for a fractional part
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            // Consume the "."
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        const value = parseFloat(this.source.substring(this.start, this.current));
        this.addToken(TokenType_1.default.NUMBER, value);
    }
    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n')
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            main_1.default.error(this.line, "Unterminated string");
            return;
        }
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType_1.default.STRING, value);
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expected)
            return false;
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.current);
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }
    isAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
    isDigit(c) {
        return c >= '0' && c <= '9';
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    addToken(token, literal = null) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token_1.default(token, text, literal, this.line));
    }
}
Scanner.keywords = new Map([
    ["and", TokenType_1.default.AND],
    ["class", TokenType_1.default.CLASS],
    ["else", TokenType_1.default.ELSE],
    ["false", TokenType_1.default.FALSE],
    ["for", TokenType_1.default.FOR],
    ["fun", TokenType_1.default.FUN],
    ["if", TokenType_1.default.IF],
    ["nil", TokenType_1.default.NIL],
    ["or", TokenType_1.default.OR],
    ["print", TokenType_1.default.PRINT],
    ["return", TokenType_1.default.RETURN],
    ["super", TokenType_1.default.SUPER],
    ["this", TokenType_1.default.THIS],
    ["true", TokenType_1.default.TRUE],
    ["var", TokenType_1.default.VAR],
    ["while", TokenType_1.default.WHILE]
]);
exports.default = Scanner;

import Token from "./Token";
import TokenType from "./TokenType";


function report(line: number, where: string, message: string) {
    console.log(` ${where}, @line [ ${line}]   ${message}`);
}

function error(token: Token, message: string) {
    if (token.type == TokenType.EOF) {
        report(token.line, "at end", message);
    }
    else {
        report(token.line, `at ' ${token.lexeme} '`, message)
    }
}

export {
    error
}
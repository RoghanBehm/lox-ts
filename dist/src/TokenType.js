"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    // Single-character tokens.
    TokenType[TokenType["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    TokenType[TokenType["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    TokenType[TokenType["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    TokenType[TokenType["COMMA"] = 4] = "COMMA";
    TokenType[TokenType["DOT"] = 5] = "DOT";
    TokenType[TokenType["MINUS"] = 6] = "MINUS";
    TokenType[TokenType["PLUS"] = 7] = "PLUS";
    TokenType[TokenType["SEMICOLON"] = 8] = "SEMICOLON";
    TokenType[TokenType["SLASH"] = 9] = "SLASH";
    TokenType[TokenType["STAR"] = 10] = "STAR";
    // One or two character tokens.
    TokenType[TokenType["BANG"] = 11] = "BANG";
    TokenType[TokenType["BANG_EQUAL"] = 12] = "BANG_EQUAL";
    TokenType[TokenType["EQUAL"] = 13] = "EQUAL";
    TokenType[TokenType["EQUAL_EQUAL"] = 14] = "EQUAL_EQUAL";
    TokenType[TokenType["GREATER"] = 15] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 16] = "GREATER_EQUAL";
    TokenType[TokenType["LESS"] = 17] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 18] = "LESS_EQUAL";
    // Literals.
    TokenType[TokenType["IDENTIFIER"] = 19] = "IDENTIFIER";
    TokenType[TokenType["STRING"] = 20] = "STRING";
    TokenType[TokenType["NUMBER"] = 21] = "NUMBER";
    // Keywords.
    TokenType[TokenType["AND"] = 22] = "AND";
    TokenType[TokenType["CLASS"] = 23] = "CLASS";
    TokenType[TokenType["ELSE"] = 24] = "ELSE";
    TokenType[TokenType["FALSE"] = 25] = "FALSE";
    TokenType[TokenType["FUN"] = 26] = "FUN";
    TokenType[TokenType["FOR"] = 27] = "FOR";
    TokenType[TokenType["IF"] = 28] = "IF";
    TokenType[TokenType["NIL"] = 29] = "NIL";
    TokenType[TokenType["OR"] = 30] = "OR";
    TokenType[TokenType["PRINT"] = 31] = "PRINT";
    TokenType[TokenType["RETURN"] = 32] = "RETURN";
    TokenType[TokenType["SUPER"] = 33] = "SUPER";
    TokenType[TokenType["THIS"] = 34] = "THIS";
    TokenType[TokenType["TRUE"] = 35] = "TRUE";
    TokenType[TokenType["VAR"] = 36] = "VAR";
    TokenType[TokenType["WHILE"] = 37] = "WHILE";
    TokenType[TokenType["EOF"] = 38] = "EOF";
})(TokenType || (TokenType = {}));
exports.default = TokenType;

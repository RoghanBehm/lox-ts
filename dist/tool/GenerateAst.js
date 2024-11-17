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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class GenerateAst {
    static main() {
        const args = process.argv.slice(2);
        if (args.length != 1) {
            process.stderr.write("Usage: generate_ast <output directory>");
            process.exit(64);
        }
        const outputDir = args[0];
        this.defineAst(outputDir, "Expr", [
            "Binary   : left: Expr, operator: Token, right: Expr",
            "Grouping : expression: Expr",
            "Literal  : value: any",
            "Unary    : operator: Token, right: Expr"
        ]);
    }
    static defineAst(outputDir, baseName, types) {
        const filePath = path.join(outputDir, `${baseName}.ts`);
        const writer = fs.createWriteStream(filePath, { encoding: 'utf8' });
        writer.write("abstract class " + baseName + " {\n");
        writer.write("}\n");
        writer.close();
        types.forEach(function (type) {
            const className = type.split(":")[0].trim();
            const fields = type.split(":")[1].trim();
            GenerateAst.defineType(writer, baseName, className, fields);
        });
    }
    static defineType(writer, baseName, className, fieldList) {
        // Constructor
        writer.write("  " + className + "(" + fieldList + ") {\n");
        // Store parameters in fields
        const fields = fieldList.split(", \n");
        fields.forEach(function (field) {
            const name = field.split(" ")[1];
            writer.write("      this." + name + " = " + name + ";\n");
        });
        writer.write("    }\n");
        // Fields
        writer.write("\n");
        fields.forEach(function (field) {
            writer.write("    final " + field + ";\n");
        });
        writer.write("  }\n");
    }
}

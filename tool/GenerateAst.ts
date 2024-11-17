import * as fs from 'fs';
import * as path from 'path';

class GenerateAst {
    public static main(): void {
        const args = process.argv.slice(2);
        if (args.length != 1) {
            process.stderr.write("Usage: generate_ast <output directory>");
            process.exit(64);
        }
        const outputDir: string = args[0]

        this.defineAst(outputDir, "Expr", [
            "Binary   : left: Expr, operator: Token, right: Expr",
            "Grouping : expression: Expr",
            "Literal  : value: any",
            "Unary    : operator: Token, right: Expr"
        ]);
    }

    private static defineAst(outputDir: string, baseName: string, types: string[]): void {
        const filePath: string = path.join(outputDir, `${baseName}.ts`);

        const writer = fs.createWriteStream(filePath, { encoding: 'utf8' });

        writer.write("import Token from '../src/Token';\n")
        writer.write("export abstract class " + baseName + " {\n");
        writer.write("  abstract accept<T>(visitor: Visitor<T>): T;\n")

        writer.write("}\n\n");
        this.defineVisitor(writer, baseName, types);

        types.forEach((type) => {
            const colonIndex = type.indexOf(":");
            const className = type.substring(0, colonIndex).trim();
            const fieldList = type.substring(colonIndex + 1).trim();
            this.defineType(writer, baseName, className, fieldList);
        });

        writer.write("\n");


        writer.end();
        console.log(`Generated file: ${filePath}`);
    }

    private static defineVisitor(writer: fs.WriteStream, baseName: string, types: string[]): void {
        writer.write("export interface Visitor<T> {\n");

        types.forEach((type) => {
            const colonIndex = type.indexOf(":");
            const className = colonIndex < 0 ? type.trim() : type.substring(0, colonIndex).trim();
            writer.write(`    visit${className}${baseName}(${baseName.toLowerCase()}: ${className}): T;\n`);
        })

        writer.write("  }");
    }

    private static defineType(writer: fs.WriteStream, baseName: string, className: string, fieldList: string): void {
        writer.write("\n\n");
        writer.write(`export class ${className} extends ${baseName} {\n`);

        if (fieldList) {
            const fields: string[] = fieldList.split(",").map((field) => field.trim());

            const fieldDeclarations: string[] = [];
            const paramList: string[] = [];
            const assignments: string[] = [];

            fields.forEach((field) => {
                const [name, type] = field.split(":").map((s) => s.trim());
                if (!name || !type) {
                    console.error(`Field "${field}" is not valid. Should be in the format "name: type".`);
                    process.exit(1);
                }
                fieldDeclarations.push(`    ${name}: ${type};\n`);
                paramList.push(`${name}: ${type}`);
                assignments.push(`        this.${name} = ${name};\n`);
            });

            // Fields
            fieldDeclarations.forEach((decl) => {
                writer.write(decl);
            });

            // Constructor
            writer.write(`\n    constructor(${paramList.join(', ')}) {\n`);
            writer.write(`        super();\n`);
            assignments.forEach((assignment) => {
                writer.write(assignment);
            });
            writer.write("    }\n");
            writer.write("\n");
            writer.write("    override accept<T>(visitor: Visitor<T>): T {\n")
            writer.write(`      return visitor.visit${className}${baseName}(this);\n`);
            writer.write("    }\n\n");
            writer.write("}");
        }
    }
}
GenerateAst.main();
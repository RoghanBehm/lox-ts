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
        writer.write("abstract class " + baseName + " {\n");

        writer.write("}\n");

        types.forEach((type) => {
            const className: string = type.split(":")[0].trim();
            const fields: string = type.split(":")[1].trim();
            const typesEnd: string = type.split(":")[2].trim();
            const fieldType: string = typesEnd.split(",")[0].trim();
            this.defineType(writer, baseName, className, fields, fieldType);
        });

        writer.end();
        console.log(`Generated file: ${filePath}`);
    }

    private static defineType(writer: fs.WriteStream, baseName: string, className: string, fieldList: string, fieldTypes: string ): void {

        writer.write(`export class ${className} extends ${baseName} {\n`);
        
        // Fields
        const fields: string[] = fieldList.split(", ").map((field) => field.trim());
        fields.forEach((field) => {
            writer.write(`    ${field};\n`);
        });


        
        // Constructor
        writer.write(`\n    constructor(${fieldList}: ${fieldTypes}) {\n`);
        writer.write(`        super();\n`);
        fields.forEach((field) => {
            const name: string = field.split(":")[0].trim();
            writer.write(`        this.${name} = ${name};\n`);
        });
        writer.write("    }\n");

        writer.write("}\n\n");
    
    }
}

GenerateAst.main();
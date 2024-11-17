import { Visitor, Expr, Binary, Grouping, Literal, Unary } from './Expr';
import Token from '../src/Token';
import TokenType from '../src/TokenType';

class AstPrinter implements Visitor<string> {
    print(expr: Expr): string {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: Binary): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr: Grouping): string {
        return this.parenthesize("group", expr.expression);
    }

    visitLiteralExpr(expr: Literal): string {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr: Unary) {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    private parenthesize(name: string, ...exprs: Expr[]): string {
        let builder: string[] = [];

        builder.push("(")
        builder.push(name);
        exprs.forEach((expr) => {
            builder.push(" ");
            builder.push(expr.accept(this));
        })
        builder.push(")");

        return builder.join('');
    }

    public static main(): void {
    const expression: Expr = new Binary(
        new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Literal(123)
        ),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping(
            new Literal(45.67)
        )
    );
    
        console.log(new AstPrinter().print(expression));
        console.log("--------------------")
        console.log(new RPNPrinter().print(expression));
    }
}

class RPNPrinter implements Visitor<string> {
    print(expr: Expr): string {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: Binary): string {
        return this.createRPN(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr: Grouping): string {
        return expr.expression.accept(this);
    }

    visitLiteralExpr(expr: Literal): string {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr: Unary): string {
        return this.createRPN(expr.operator.lexeme, expr.right);
    }

    private createRPN(name: string, ...exprs: Expr[]): string {
        let builder: string[] = [];

        
        exprs.forEach((expr) => {
            builder.push(expr.accept(this));
        })
        builder.push(name);
        return builder.join(' ');
    }
}

AstPrinter.main();
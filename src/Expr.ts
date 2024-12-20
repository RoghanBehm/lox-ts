import Token from './Token';
export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T;
}

export interface Visitor<T> {
    visitBinaryExpr(expr: Binary): T;
    visitGroupingExpr(expr: Grouping): T;
    visitLiteralExpr(expr: Literal): T;
    visitUnaryExpr(expr: Unary): T;
  }

export class Binary extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    override accept<T>(visitor: Visitor<T>): T {
      return visitor.visitBinaryExpr(this);
    }

}

export class Grouping extends Expr {
    expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    override accept<T>(visitor: Visitor<T>): T {
      return visitor.visitGroupingExpr(this);
    }

}

export class Literal extends Expr {
    value: any;

    constructor(value: any) {
        super();
        this.value = value;
    }

    override accept<T>(visitor: Visitor<T>): T {
      return visitor.visitLiteralExpr(this);
    }

}

export class Unary extends Expr {
    operator: Token;
    right: Expr;

    constructor(operator: Token, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    override accept<T>(visitor: Visitor<T>): T {
      return visitor.visitUnaryExpr(this);
    }

}

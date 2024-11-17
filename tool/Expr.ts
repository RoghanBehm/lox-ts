import Token from '../src/Token';
abstract class Expr {
}
export class Binary extends Expr {
    left;

    constructor(left: Expr) {
        super();
        this.left = left;
    }
}

export class Grouping extends Expr {
    expression;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }
}

export class Literal extends Expr {
    value;

    constructor(value: any) {
        super();
        this.value = value;
    }
}

export class Unary extends Expr {
    operator;

    constructor(operator: Token) {
        super();
        this.operator = operator;
    }
}


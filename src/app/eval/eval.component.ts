import {Component, OnInit} from '@angular/core';
import {Stack} from "typescript-collections";


@Component({
  selector: 'app-eval',
  templateUrl: './eval.component.html',
  styleUrls: ['./eval.component.css'],
})



export class EvalComponent implements OnInit{

  postfix: string | null = '';
  prefix: string | null = '';
  postSteps: any = [];
  prefSteps: any = [];
  isValid: boolean = false;
  isPostfix: boolean = true;


  private operators: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };
  displayedColumns: string[] = ['no', 'char', 'stack', 'out'];


  postfixCalculate(input: string) {
    if (this.isValidExpression(input)) {
      let postfix: Stack<string> = new Stack();
      let stack: Stack<string> = new Stack();
      this.postSteps = [];
      this.isValid = true;

      for (let i = 0; i < input.length; i++) {
        let ic: string = input.charAt(i);

        if (ic === ' ') continue;

        if (this.isOperand(ic)) {
          postfix.push(ic);
        } else if (ic === '(') {
          stack.push(ic);
        } else if (ic === ')') {
          while (stack.peek() !== '(') {
            postfix.push(stack.pop()!);
          }
          stack.pop();
        } else if (this.isOperator(ic)) {
          while (!stack.isEmpty() && this.operators[ic] <= this.operators[stack.peek()!]) {
            postfix.push(stack.pop()!);
          }
          stack.push(ic);
        }
        this.postSteps.push({
          no: i+1,
          char: ic,
          stack: this.stackToArray(stack).join(""),
          out: this.stackToArray(postfix).join("")
        });
      }

      while (!stack.isEmpty()) {
        let pop = stack.pop()!;
        postfix.push(pop);
        this.postSteps.push({
          no: input.length + 1,
          char: "",
          stack: this.stackToArray(stack).join(""),
          out: this.stackToArray(postfix).join("")
        });
      }

      let temp : string = '';
      while (!postfix.isEmpty()) {
        temp = postfix.pop()! + temp;
      }
      this.postfix = temp;
      console.log(this.postSteps);
      return true;
    } else {
      this.isValid = false;
      return false;
    }
  }


  prefixCalculate(input: string) {
    if (this.isValidExpression(input)) {
      let prefix: Stack<string> = new Stack();
      let stack: Stack<string> = new Stack();
      this.prefSteps = [];
      this.isValid = true;

      for (let i = input.length - 1; i >= 0; i--) {
        let ic: string = input.charAt(i);

        if (ic === ' ') continue;

        if (this.isOperand(ic)) {
          prefix.push(ic);
        } else if (ic === ')') {
          stack.push(ic);
        } else if (ic === '(') {
          while (!stack.isEmpty() && stack.peek() !== ')') {
            prefix.push(stack.pop()!);
          }
          if (!stack.isEmpty()) {
            stack.pop();
          }
        } else if (this.isOperator(ic)) {
          while (!stack.isEmpty() && this.operators[ic] < this.operators[stack.peek()!]) {
            prefix.push(stack.pop()!);
          }
          stack.push(ic);
        }

        this.prefSteps.push({
          no: input.length - i,
          char: ic,
          stack: this.stackToArray(stack).join(""),
          out: this.stackToArray(prefix).reverse().join("")
        });
      }

      while (!stack.isEmpty()) {
        let pop = stack.pop()!;
        prefix.push(pop);
        this.prefSteps.push({
          no: input.length + 1,
          char: "",
          stack: this.stackToArray(stack).join(""),
          out: this.stackToArray(prefix).reverse().join("")
        });
      }

      let temp : string = '';
      while (!prefix.isEmpty()) {
        temp += prefix.pop()!;
      }

      this.prefix = temp;
      return true;
    } else {
      this.isValid = false;
      return false;
    }
  }

  private stackToArray(stack: Stack<string>): string[] {
    let arr: string[] = [];
    let tempStack = new Stack<string>();

    while (!stack.isEmpty()) {
      let val = stack.pop();
      if (val) {
        tempStack.push(val);
        arr.push(val);
      }
    }

    while (!tempStack.isEmpty()) {
      stack.push(tempStack.pop()!);
    }

    return arr.reverse();
  }



  private isOperand(char: string): boolean {
    return /[0-9a-zA-Z]/.test(char);
  }

  private isOperator(char: string): boolean {
    return /[+\-*\/()]/.test(char);
  }

  private isValidExpression(input: string): boolean {
    let bracketCounter = 0;
    let previousChar = '';
    let insideOperand = false;

    if (this.isOperator(input.at(0)!) && input.at(0)! !== '-' && input.at(0)! !== '(') {
      return false;
    }

    for(let i = 0; i<input.length; i++){
      let char = input.at(i)!;

      if (char === ' ') continue;

      if (!/[0-9+\-*/()a-zA-Z]/.test(char)){
        return false;
      }

      if (this.isOperand(char)) {
        insideOperand = true;
        if (previousChar === ')') {
          return false;
        }
      } else if (this.isOperator(char)) {
        insideOperand = false;
        if (char !== '(' && char !== ')' && i > 0) {
          if ((previousChar === '' || this.isOperator(previousChar)) && char !== '-' && previousChar !== ' ') {
            return false;
          }
        }

        if (char === '(') {
          bracketCounter++;
          if (this.isOperand(previousChar)) {
            return false;
          }
        } else if (char === ')') {
          bracketCounter--;
          if (bracketCounter < 0 || this.isOperator(previousChar) && previousChar !== ')' && previousChar !== ' ') {
            return false;
          }
        }
      }

      previousChar = char;
    }

    if (this.isOperator(previousChar) && previousChar !== ')') {
      return false;
    }

    return bracketCounter === 0;
  }

  toggleView() {
    this.isPostfix = !this.isPostfix;
  }



  ngOnInit(): void {
  }

}

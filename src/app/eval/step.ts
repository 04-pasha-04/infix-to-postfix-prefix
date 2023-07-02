export class Step {
  number: number;
  character: string;
  stack: string[];
  output: string;

  constructor(number: number, character: string, stack: string[], output: string) {
    this.number = number;
    this.character = character;
    this.stack = [...stack];
    this.output = output;
  }
}

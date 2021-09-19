import { bold } from 'kleur';

export function printError(message: string): void {
  console.log(bold().yellow().bgRed().italic(message));
}

export function printInfo(message: string): void {
  console.log(bold().white().bgGreen(message));
}

export class Filter {
  hasPhoto: boolean = false;
  inContact: boolean = false;
  favourite: boolean = false;
  compatibilityScore: number[] = [0.01, 0.99];
  age: number[] = [18, 95];
  height: number[] = [135, 210];
  distance: number = 30;
}

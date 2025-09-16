import { TwoDigitDecimalNumberDirective } from './two-digit-decimal-number.directive';
import 'jasmine';
describe('TwoDigitDecimalNumberDirective', () => {
  let decimal;
  it('should create an instance', () => {
    const directive = new TwoDigitDecimalNumberDirective(decimal);
    expect(directive).toBeTruthy();
  });
});

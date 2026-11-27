import { CHOOSE_ERROR, NAME_ERROR, NAME_TOO_LONG, answersSchema, toggleMulti, validateField } from './answers';

describe('name validation', () => {
  it.each(['Sunita Sharma', "Mary-Anne D'Souza", 'A. K. Gupta', ''])('accepts %j', (name) => {
    expect(validateField('name', name)).toBeNull();
  });

  it.each(['सुनीता शर्मा', 'Sunita2', 'José', 'Sunita_Sharma', '<script>alert(1)</script>'])('rejects %j', (name) => {
    expect(validateField('name', name)).toBe(NAME_ERROR);
  });

  it('rejects names that are too long', () => {
    expect(validateField('name', 'A'.repeat(81))).toBe(NAME_TOO_LONG);
  });

  it('trims spaces before saving', () => {
    expect(answersSchema.shape.name.parse('  Sunita Sharma  ')).toBe('Sunita Sharma');
  });
});

describe('choice validation', () => {
  it('asks for an answer when nothing is chosen', () => {
    expect(validateField('relationship', undefined)).toBe(CHOOSE_ERROR);
    expect(validateField('banks', [])).toBe(CHOOSE_ERROR);
    expect(validateField('banks', undefined)).toBe(CHOOSE_ERROR);
    expect(validateField('will', undefined)).toBe(CHOOSE_ERROR);
  });

  it('rejects values that are not one of the options', () => {
    expect(validateField('mobile', ['jio', 'not-a-network'])).not.toBeNull();
    expect(validateField('will', 'maybe')).not.toBeNull();
  });

  it('accepts "Not sure" everywhere', () => {
    expect(validateField('relationship', 'not-sure')).toBeNull();
    expect(validateField('banks', ['not-sure'])).toBeNull();
    expect(validateField('crypto', 'not-sure')).toBeNull();
  });
});

describe('toggleMulti', () => {
  const exclusive = ['not-sure', 'none'];
  it('adds and removes a normal option', () => {
    expect(toggleMulti(['sbi'], 'hdfc', exclusive)).toEqual(['sbi', 'hdfc']);
    expect(toggleMulti(['sbi', 'hdfc'], 'sbi', exclusive)).toEqual(['hdfc']);
  });
  it('lets "None" and "Not sure" stand alone', () => {
    expect(toggleMulti(['sbi', 'hdfc'], 'none', exclusive)).toEqual(['none']);
    expect(toggleMulti(['none'], 'sbi', exclusive)).toEqual(['sbi']);
    expect(toggleMulti(['none'], 'not-sure', exclusive)).toEqual(['not-sure']);
  });
});

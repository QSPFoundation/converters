import { readQsps } from './qsps';

describe('qsps reader', () => {
  it('should process empty input', () => {
    const result = readQsps('');
    expect(result).toEqual([]);
  });

  it('should parse empty location', () => {
    const result = readQsps(`# test
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: '',
        description: '',
        actions: [],
      },
    ]);
  });

  it('should parse location with code', () => {
    const result = readQsps(`# test
*pl x
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: '*pl x',
        description: '',
        actions: [],
      },
    ]);
  });

  test('file end should finish location', () => {
    const result = readQsps(`# test
*pl x`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: '*pl x',
        description: '',
        actions: [],
      },
    ]);
  });

  it('should not consider - at the line start withing single qoute string as location end', () => {
    const result = readQsps(`# test
'- first line
- second line
- third line'
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: `'- first line\r\n- second line\r\n- third line'`,
        description: '',
        actions: [],
      },
    ]);
  });

  it('should not consider - at the line start withing single qoute string containing escapes as location end', () => {
    const result = readQsps(`# test
'- first line
- second'' line
- third line'
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: `'- first line\r\n- second'' line\r\n- third line'`,
        description: '',
        actions: [],
      },
    ]);
  });

  it('should not consider - at the line start withing double qoute string as location end', () => {
    const result = readQsps(`# test
"- first line
- second line
- third line"
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: `"- first line\r\n- second line\r\n- third line"`,
        description: '',
        actions: [],
      },
    ]);
  });

  it('should not consider - at the line start withing double qoute with escapes string as location end', () => {
    const result = readQsps(`# test
"- first line
- second"" line
- third line"
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: `"- first line\r\n- second"" line\r\n- third line"`,
        description: '',
        actions: [],
      },
    ]);
  });

  it('should not consider - at the line start withing curly qoute string as location end', () => {
    const result = readQsps(`# test
{- first line
- second line
- third line}
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: `{- first line\r\n- second line\r\n- third line}`,
        description: '',
        actions: [],
      },
    ]);
  });

  it('should not consider - at the line start withing nested curly qoute string as location end', () => {
    const result = readQsps(`# test
{
{- first line
- second line
- third line}
}
--- test ------------------------`);

    expect(result).toMatchObject([
      {
        name: 'test',
        code: `{\r\n{- first line\r\n- second line\r\n- third line}\r\n}`,
        description: '',
        actions: [],
      },
    ]);
  });
});

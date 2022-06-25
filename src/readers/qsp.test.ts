import { readQsp } from './qsp';

describe('qsp reader', () => {
  const separator = [0x0d, 0x0a];
  const encode = (str: string) => str.split('').map((char) => char.charCodeAt(0) - 5);
  it('should read new format', () => {
    const content = [
      'QSPGAME'.split('').map((char) => char.charCodeAt(0)),
      separator,
      'qgen'.split('').map((char) => char.charCodeAt(0)),
      separator,
      encode('No'),
      separator,
      encode('1'),
      separator,
      encode('loc_name'),
      separator,
      encode('loc_description_line1\r\nloc_description_line2'),
      separator,
      encode('loc_code_line1\r\nloc_code_line2'),
      separator,
      encode('1'),
      separator,
      encode('act.png'),
      separator,
      encode('act_name'),
      separator,
      encode('act_code_line1\r\nact_code_line1'),
      separator,
    ].flat();
    const buffer = new Uint16Array(content);

    const result = readQsp(buffer.buffer);

    expect(result).toEqual([
      {
        name: 'loc_name',
        description: ['loc_description_line1', 'loc_description_line2'],
        code: ['loc_code_line1', 'loc_code_line2'],
        actions: [
          {
            name: 'act_name',
            image: 'act.png',
            code: ['act_code_line1', 'act_code_line1'],
          },
        ],
      },
    ]);
  });

  it('should read old format', () => {
    const content = [
      '1'.charCodeAt(0),
      separator,
      'qgen'.split('').map((char) => char.charCodeAt(0)),
      separator,
      encode('No'),
      separator,
      new Array(27).fill(separator),
      encode('loc_name'),
      separator,
      encode('loc_description_line1\r\nloc_description_line2'),
      separator,
      encode('loc_code_line1\r\nloc_code_line2'),
      separator,
      encode('act_name'),
      separator,
      encode('act_code_line1\r\nact_code_line1'),
      separator,
      new Array(19).fill([...separator, ...separator]),
    ].flat(2);
    const buffer = new Uint8Array(content);

    const result = readQsp(buffer.buffer);

    expect(result).toEqual([
      {
        name: 'loc_name',
        description: ['loc_description_line1', 'loc_description_line2'],
        code: ['loc_code_line1', 'loc_code_line2'],
        actions: [
          {
            name: 'act_name',
            code: ['act_code_line1', 'act_code_line1'],
          },
        ],
      },
    ]);
  });

  it('should read old format with cyrilic symbols', () => {
    const content = [
      '1'.charCodeAt(0),
      separator,
      'qgen'.split('').map((char) => char.charCodeAt(0)),
      separator,
      encode('No'),
      separator,
      new Array(27).fill(separator),
      [241, 242, 224, 240, 242].map((ch) => ch - 5),
      separator,
      separator,
      separator,
      new Array(20).fill([...separator, ...separator]),
    ].flat(2);
    const buffer = new Uint8Array(content);

    const result = readQsp(buffer.buffer);

    expect(result).toEqual([
      {
        name: 'старт',
        description: [""],
        code: [""],
        actions: [],
      },
    ]);
  });
});

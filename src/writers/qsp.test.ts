import { writeQsp } from './qsp';

describe('qsp writer', () => {
  const separator = [0x0d, 0x0a];
  const encode = (str: string) => str.split('').map((char) => char.charCodeAt(0) - 5);

  it('should serialize to new format', () => {
    const content = [
      'QSPGAME'.split('').map((char) => char.charCodeAt(0)),
      separator,
      '@qsp/converters 1.0'.split('').map((char) => char.charCodeAt(0)),
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
      encode('2'),
      separator,
      encode('act.png'),
      separator,
      encode('act_name'),
      separator,
      encode('act_code_line1\r\nact_code_line1'),
      separator,
      separator,
      encode('act_name1'),
      separator,
      encode('act_code_line1'),
      separator,
    ].flat(2);

    const locations = [
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
          {
            name: 'act_name1',
            code: ['act_code_line1'],
          },
        ],
      },
    ];

    const data = writeQsp(locations);
    expect(new Uint16Array(data)).toEqual(new Uint16Array(content));
  });
});

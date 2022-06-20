import { QspLocation } from '../contracts';
import { writeQsps } from './qsps';

describe('qsps writer', () => {
  it('should write one location without code and actions', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
--- test ---------------------------------
`);
  });

  it('should write several locations', () => {
    const locations: QspLocation[] = [
      {
        name: 'first',
        code: [],
        description: [],
        actions: [],
      },
      {
        name: 'second',
        code: [],
        description: [],
        actions: [],
      },
    ];
    const result = writeQsps(locations);
    expect(result).toBe(`# first
--- first ---------------------------------

# second
--- second ---------------------------------
`);
  });

  it('should convert one line description into qsp code', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [`First line.`],
        actions: [],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
*p 'First line.'
--- test ---------------------------------
`);
  });

  it('should convert multi line description into qsp code', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [`First line.`, `Second line.`],
        actions: [],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
*pl 'First line.'
*p 'Second line.'
--- test ---------------------------------
`);
  });

  it('should escape qoute in description', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [`First's line.`],
        actions: [],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
*p 'First''s line.'
--- test ---------------------------------
`);
  });

  it('should add one line location code', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: ['*p x'],
        description: [],
        actions: [],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
*p x
--- test ---------------------------------
`);
  });

  it('should add one line location code', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [`*pl x`, `*pl y`],
        description: [],
        actions: [],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
*pl x
*pl y
--- test ---------------------------------
`);
  });

  it('should write one action without code and image', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [
          {
            name: 'Do test',
            code: [],
          },
        ],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
act 'Do test':
end
--- test ---------------------------------
`);
  });

  it('should escape qoutes in action name ', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [
          {
            name: `Do test's`,
            code: [],
          },
        ],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
act 'Do test''s':
end
--- test ---------------------------------
`);
  });

  it('should write action with image', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [
          {
            name: 'Do test',
            code: [],
            image: 'gfx/1.png',
          },
        ],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
act 'Do test', 'gfx/1.png':
end
--- test ---------------------------------
`);
  });

  it('should escape qoutes in action image', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [
          {
            name: 'Do test',
            code: [],
            image: `gfx/1'1.png`,
          },
        ],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
act 'Do test', 'gfx/1''1.png':
end
--- test ---------------------------------
`);
  });

  it('should write action with one line code', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [
          {
            name: 'Do test',
            code: ['*pl x'],
          },
        ],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
act 'Do test':
  *pl x
end
--- test ---------------------------------
`);
  });

  it('should write action with multi line code', () => {
    const locations: QspLocation[] = [
      {
        name: 'test',
        code: [],
        description: [],
        actions: [
          {
            name: 'Do test',
            code: [`*pl x`, `*pl y`],
          },
        ],
      },
    ];

    const result = writeQsps(locations);
    expect(result).toBe(`# test
act 'Do test':
  *pl x
  *pl y
end
--- test ---------------------------------
`);
  });
});

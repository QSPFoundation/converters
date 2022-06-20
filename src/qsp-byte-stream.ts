export const QSP_CODREMOV = 5;
const QSP_STRSDELIM = '\r\n';
export const QSP_GAMEID = 'QSPGAME';
export const QSP_PASSWD = 'No';

// prettier-ignore
const CP1251ToUnicodeTable: number[] = [
  0x0402, 0x0403, 0x201a, 0x0453, 0x201e, 0x2026, 0x2020, 0x2021, 0x20ac,
  0x2030, 0x0409, 0x2039, 0x040a, 0x040c, 0x040b, 0x040f, 0x0452, 0x2018,
  0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x0020, 0x2122, 0x0459,
  0x203a, 0x045a, 0x045c, 0x045b, 0x045f, 0x00a0, 0x040e, 0x045e, 0x0408,
  0x00a4, 0x0490, 0x00a6, 0x00a7, 0x0401, 0x00a9, 0x0404, 0x00ab, 0x00ac,
  0x00ad, 0x00ae, 0x0407, 0x00b0, 0x00b1, 0x0406, 0x0456, 0x0491, 0x00b5,
  0x00b6, 0x00b7, 0x0451, 0x2116, 0x0454, 0x00bb, 0x0458, 0x0405, 0x0455,
  0x0457, 0x0410, 0x0411, 0x0412, 0x0413, 0x0414, 0x0415, 0x0416, 0x0417,
  0x0418, 0x0419, 0x041a, 0x041b, 0x041c, 0x041d, 0x041e, 0x041f, 0x0420,
  0x0421, 0x0422, 0x0423, 0x0424, 0x0425, 0x0426, 0x0427, 0x0428, 0x0429,
  0x042a, 0x042b, 0x042c, 0x042d, 0x042e, 0x042f, 0x0430, 0x0431, 0x0432,
  0x0433, 0x0434, 0x0435, 0x0436, 0x0437, 0x0438, 0x0439, 0x043a, 0x043b,
  0x043c, 0x043d, 0x043e, 0x043f, 0x0440, 0x0441, 0x0442, 0x0443, 0x0444,
  0x0445, 0x0446, 0x0447, 0x0448, 0x0449, 0x044a, 0x044b, 0x044c, 0x044d,
  0x044e, 0x044f,
];

function convertCP1251(char: number): string {
  return String.fromCharCode(
    char >= 0x80 ? CP1251ToUnicodeTable[char - 0x80] : char
  );
}

export class QspByteStream {
  private cursor = 0;
  private content: ArrayBuffer;
  private view: DataView;
  private isUnicode: boolean;

  public constructor(fromBuffer?: ArrayBuffer) {
    this.content = fromBuffer ?? new ArrayBuffer(256);
    this.view = new DataView(this.content);
    this.isUnicode = this.view.getUint8(1) === 0;
  }

  private ensureSize(size: number): void {
    if (this.content.byteLength >= size) return;
    const newLength = this.content.byteLength * 2;
    const buffer = new ArrayBuffer(newLength);
    new Uint8Array(buffer).set(new Uint8Array(this.content));
    this.content = buffer;
    this.view = new DataView(this.content);
  }

  public finalize(): ArrayBuffer {
    this.content = this.content.slice(0, this.cursor);
    return this.content;
  }

  public get eof(): boolean {
    return this.cursor >= this.content.byteLength;
  }

  public read(): number {
    const position = this.cursor;
    this.cursor += this.isUnicode
      ? Uint16Array.BYTES_PER_ELEMENT
      : Uint8Array.BYTES_PER_ELEMENT;
    return this.isUnicode
      ? this.view.getUint16(position, true)
      : this.view.getUint8(position);
  }

  public readLine(shouldDecode = true): string {
    const chars: number[] = [];
    while (!this.eof) {
      const char = this.read();
      if (char === 0x0d) {
        this.read();
        break;
      }
      if (shouldDecode) {
        chars.push(char === -QSP_CODREMOV ? QSP_CODREMOV : char + QSP_CODREMOV);
      } else {
        chars.push(char);
      }
    }
    return this.isUnicode
      ? // eslint-disable-next-line prefer-spread
        chars.map(char => String.fromCharCode(char)).join('')
      : chars.map(convertCP1251).join('');
  }

  public write(value: number): void {
    this.ensureSize(this.cursor + Int16Array.BYTES_PER_ELEMENT);
    const position = this.cursor;
    this.cursor += Int16Array.BYTES_PER_ELEMENT;
    this.view.setUint16(position, value, true);
  }

  public writeString(input: string, shouldEncode = true): void {
    const charCodes = input.split('').map((char): number => char.charCodeAt(0));
    for (const point of charCodes.values()) {
      if (shouldEncode) {
        this.write(
          point === QSP_CODREMOV ? -QSP_CODREMOV : point - QSP_CODREMOV
        );
      } else {
        this.write(point);
      }
    }
  }

  public writeLine(input: string, shouldEncode = true): void {
    input && this.writeString(input, shouldEncode);
    this.writeString(QSP_STRSDELIM, false);
  }

  public tell(): number {
    return this.cursor;
  }

  public seek(offset: number): void {
    this.cursor = offset;
  }

  public skip(offset: number): void {
    this.cursor += offset;
  }
}

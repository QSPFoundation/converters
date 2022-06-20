import { QspLocation } from '../contracts';

const QSP_STARTLOC = '#';
const QSP_ENDLOC = '-';
const QSP_QUOTES = ["'", '"'];
const QSP_LCURLY = '{';
const QSP_RCURLY = '}';

export function readQsps(content: string): QspLocation[] {
  const locations: QspLocation[] = [];

  let isInLoc = false;
  let curLoc: QspLocation | null = null;
  let locCode: string[] = [];
  const lines = content.split(/\r?\n/);
  let quote = '';
  let quotesCount = 0;
  for (const line of lines) {
    if (isInLoc) {
      if (!quote && !quotesCount) {
        if (line.startsWith(QSP_ENDLOC)) {
          isInLoc = false;
          if (curLoc) {
            curLoc.code = locCode;
            locCode = [];
            locations.push(curLoc);
            curLoc = null;
          }
          continue;
        }
      }
      locCode.push(line);
      const chars = line.split('');
      for (let i = 0; i < chars.length; ++i) {
        const char = chars[i];
        if (quote) {
          if (char == quote) {
            if (chars[i + 1] == quote) {
              i++;
            } else {
              quote = '';
            }
          }
        } else {
          if (char == QSP_LCURLY) ++quotesCount;
          else if (char == QSP_RCURLY) {
            if (quotesCount) --quotesCount;
          } else if (QSP_QUOTES.includes(char)) quote = char;
        }
      }
    } else {
      if (line.startsWith(QSP_STARTLOC)) {
        isInLoc = true;
        curLoc = {
          name: line.slice(QSP_STARTLOC.length).trim(),
          description: [],
          code: [],
          actions: [],
        };
      }
    }
  }

  if (isInLoc && curLoc) {
    curLoc.code = locCode;
    locations.push(curLoc);
  }

  return locations;
}

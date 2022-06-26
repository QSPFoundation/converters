import { QspLocation } from '../contracts';
import { QspByteStream, QSP_GAMEID, QSP_PASSWD } from '../qsp-byte-stream';

export function writeQsp(locations: QspLocation[]): ArrayBuffer {
  const stream = new QspByteStream();

  stream.writeLine(QSP_GAMEID, false);
  stream.writeLine('@qsp/converters 1.0', false);
  stream.writeLine(QSP_PASSWD);
  stream.writeLine(String(locations.length));

  for (const location of locations) {
    stream.writeLine(location.name);
    stream.writeLine(location.description.join('\r\n'));
    stream.writeLine(location.code.join('\r\n'));

    stream.writeLine(String(location.actions.length));
    for (const action of location.actions) {
      stream.writeLine(action.image ?? '');
      stream.writeLine(action.name);
      stream.writeLine(action.code.join('\r\n'));
    }
  }
  return stream.finalize();
}

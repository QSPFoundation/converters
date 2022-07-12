import { QspAction, QspLocation } from '../contracts';
import { QspByteStream, QSP_GAMEID } from '../qsp-byte-stream';

// format description https://github.com/QSPFoundation/qsp/blob/master/help/gam_desc.txt

function readNewFormat(stream: QspByteStream): QspLocation[] {
  stream.readLine(false); // tool version
  stream.readLine(); // password
  const locCount = parseInt(stream.readLine());

  const locations: QspLocation[] = [];

  for (let i = 0; i < locCount; i++) {
    const name = stream.readLine();
    let description = stream.readLine().split(/\r?\n/);
    if (description.length === 1 && description[0] === '') {
      description = [];
    }
    const code = stream.readLine().split(/\r?\n/);

    const actsCount = parseInt(stream.readLine());
    const actions: QspAction[] = [];
    for (let j = 0; j < actsCount; ++j) {
      const image = stream.readLine();
      const actionName = stream.readLine();
      const actionCode = stream.readLine().split(/\r?\n/);
      actions.push({ image, name: actionName, code: actionCode });
    }
    locations.push({ name, description, code, actions });
  }
  return locations;
}

function readOldFormat(stream: QspByteStream): QspLocation[] {
  stream.seek(0);
  const locCount = parseInt(stream.readLine(false));
  stream.readLine(); // password
  stream.readLine(false); // tool version
  for (let i = 0; i < 27; i++) {
    //empty reserved lines
    stream.readLine();
  }
  const locations: QspLocation[] = [];
  const actsCount = 20;
  for (let i = 0; i < locCount; i++) {
    const name = stream.readLine();
    const description = stream.readLine().split(/\r?\n/);
    const code = stream.readLine().split(/\r?\n/);

    const actions: QspAction[] = [];
    for (let j = 0; j < actsCount; ++j) {
      const actionName = stream.readLine();
      const actionCode = stream.readLine().split(/\r?\n/);
      if (actionName) {
        actions.push({ name: actionName, code: actionCode });
      }
    }
    locations.push({ name, description, code, actions });
  }

  return locations;
}

export function readQsp(buffer: ArrayBuffer): QspLocation[] {
  const stream = new QspByteStream(buffer);
  const header = stream.readLine(false);
  if (header === QSP_GAMEID) {
    return readNewFormat(stream);
  }

  return readOldFormat(stream);
}

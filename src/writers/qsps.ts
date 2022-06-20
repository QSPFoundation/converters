import { QspAction, QspLocation } from '../contracts';

function escapeQspString(input: string): string {
  return input.replace(/'/g, "''");
}

function convertDescription(lines: string[], linebreak: string): string {
  return lines
    .map((line, index) => `${index === lines.length - 1 ? '*p' : '*pl'} '${escapeQspString(line)}'${linebreak}`)
    .join('');
}

function convertAction(action: QspAction, linebreak: string): string {
  const name = escapeQspString(action.name);
  const image = action.image ? `, '${escapeQspString(action.image)}'` : '';
  const code = action.code ? action.code.map((line) => `  ${line}${linebreak}`).join('') : '';
  return `act '${name}'${image}:${linebreak}${code}end`;
}

function convertActions(actions: QspAction[], linebreak: string): string {
  if (!actions.length) return '';
  return actions.map((action) => convertAction(action, linebreak)).join(linebreak) + linebreak;
}

function convertLocation(location: QspLocation, linebreak: string): string {
  const description = convertDescription(location.description, linebreak);
  const code = location.code.length ? location.code.join(linebreak) + linebreak : '';
  const actions = convertActions(location.actions, linebreak);
  return `# ${location.name}${linebreak}${description}${actions}${code}--- ${location.name} ---------------------------------${linebreak}`;
}

export function writeQsps(locations: QspLocation[], linebreak = '\n'): string {
  return locations.map((location) => convertLocation(location, linebreak)).join(linebreak);
}

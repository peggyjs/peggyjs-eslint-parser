import {_} from './space.js'

{
  let lineNum = 0;
}
csv = @line|0..{ return Infinity }, EOL| EOL*

// Each successive line requires at least one more field.
line = fields:field|lineNum.., "," _ | {
  lineNum++;
  return fields;
}

field
  = '"' @$[^"]* '"'
  / $[^,"]*

EOL = [\r\n]+

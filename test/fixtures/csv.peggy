import {_} from './space.js'

{
  let lineNum = 0;
}
csv = @line|0..{ return 10000 }, EOL|

line = field|lineNum.., "," _ |

field
  = '"' @$[^"]* '"'
  / $[^,"\r\n]*

EOL = [\r\n]+

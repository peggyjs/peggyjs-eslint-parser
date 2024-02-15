import {_} from "./space.js"

comment "comment"
  = _ "/*" (!"*/" .)* "*/" _

trailing_comment
  = _ "//" [^\n]+

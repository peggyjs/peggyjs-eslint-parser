// Arbitrary requirement needing &
number "number without trailing comment"
  = "0x" n:$[0-9a-f]i+ &"\n" { return parseInt(n, 16) }
  / n:$[0-9]+ &"\n" { return parseInt(n, 10) }


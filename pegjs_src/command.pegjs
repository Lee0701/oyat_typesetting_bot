
Script
  = Command+

Command
  = _ '/' label:CommandLabel args:CommandArgument* _ {
    return {
      label,
      args,
    }
  }

CommandLabel
  = head:[a-zA-Z_] tail:[0-9a-zA-Z_]* { return head + tail.join('') }

CommandArgument
  = Number
  / String

String
  = DoubleQuotedString
  / SingleQuotedString
  / PlainString

DoubleQuotedString
  = _ '"' value:[^"]+ '"' { return value.join('') }

SingleQuotedString
  = _ "'" value:[^']+ "'" { return value.join('') }

PlainString
  = _ [^ \t\n\r/'"]+ { return text().trim() }

Number "number"
  = _ [0-9.]+ { return parseFloat(text()); }

_ "whitespace"
  = [ \t\n\r]*

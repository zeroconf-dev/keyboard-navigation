var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,6],$V2=[1,7],$V3=[1,8],$V4=[1,9],$V5=[1,10],$V6=[1,15],$V7=[1,16],$V8=[1,17],$V9=[1,18],$Va=[1,19],$Vb=[1,20],$Vc=[1,21],$Vd=[1,22],$Ve=[1,23],$Vf=[1,24],$Vg=[1,25],$Vh=[1,26],$Vi=[1,27],$Vj=[1,28],$Vk=[1,29],$Vl=[1,30],$Vm=[1,12],$Vn=[1,13],$Vo=[5,32];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"hotkey_expr":4,"T_EOF":5,"modifier_expr":6,"T_MODIFIER_ALT":7,"T_MODIFIER_COMMAND":8,"T_MODIFIER_CTRL":9,"T_MODIFIER_META":10,"T_MODIFIER_MOD":11,"T_MODIFIER_SHIFT":12,"special_key":13,"T_KEY_ARROW_DOWN":14,"T_KEY_ARROW_LEFT":15,"T_KEY_ARROW_RIGHT":16,"T_KEY_ARROW_UP":17,"T_KEY_BACKSPACE":18,"T_KEY_CONTEXT_MENU":19,"T_KEY_DELETE":20,"T_KEY_END":21,"T_KEY_ENTER":22,"T_KEY_ESCAPE":23,"T_KEY_FNUM":24,"T_KEY_HOME":25,"T_KEY_INSERT":26,"T_KEY_PAGE_DOWN":27,"T_KEY_PAGE_UP":28,"T_KEY_TAB":29,"key":30,"T_KEY_LITERAL":31,"T_OP_PLUS":32,"key_expr":33,"$accept":0,"$end":1},
terminals_: {2:"error",5:"T_EOF",7:"T_MODIFIER_ALT",8:"T_MODIFIER_COMMAND",9:"T_MODIFIER_CTRL",10:"T_MODIFIER_META",11:"T_MODIFIER_MOD",12:"T_MODIFIER_SHIFT",14:"T_KEY_ARROW_DOWN",15:"T_KEY_ARROW_LEFT",16:"T_KEY_ARROW_RIGHT",17:"T_KEY_ARROW_UP",18:"T_KEY_BACKSPACE",19:"T_KEY_CONTEXT_MENU",20:"T_KEY_DELETE",21:"T_KEY_END",22:"T_KEY_ENTER",23:"T_KEY_ESCAPE",24:"T_KEY_FNUM",25:"T_KEY_HOME",26:"T_KEY_INSERT",27:"T_KEY_PAGE_DOWN",28:"T_KEY_PAGE_UP",29:"T_KEY_TAB",31:"T_KEY_LITERAL",32:"T_OP_PLUS"},
productions_: [0,[3,2],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[30,1],[30,1],[30,1],[33,1],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1];
case 2:
 this.$ = { alt: true } 
break;
case 3:
 this.$ = { cmd: true } 
break;
case 4:
 this.$ = { ctrl: true } 
break;
case 5:
 this.$ = { meta: true } 
break;
case 6:
 this.$ = { mod: true } 
break;
case 7:
 this.$ = { shift: true } 
break;
case 8:
 this.$ = 'ArrowDown' 
break;
case 9:
 this.$ = 'ArrowLeft' 
break;
case 10:
 this.$ = 'ArrowRight' 
break;
case 11:
 this.$ = 'ArrowUp' 
break;
case 12:
 this.$ = 'Backspace' 
break;
case 13:
 this.$ = 'ContextMenu' 
break;
case 14:
 this.$ = 'Delete' 
break;
case 15:
 this.$ = 'End' 
break;
case 16:
 this.$ = 'Enter' 
break;
case 17:
 this.$ = 'Escape' 
break;
case 18:
 this.$ = $$[$0].toUpperCase() 
break;
case 19:
 this.$ = 'Home' 
break;
case 20:
 this.$ = 'Insert' 
break;
case 21:
 this.$ = 'PageDown' 
break;
case 22:
 this.$ = 'PageUp' 
break;
case 23:
 this.$ = 'Tab' 
break;
case 24:
 this.$ = $$[$0].toLowerCase() 
break;
case 25: case 29: case 30:
 this.$ = $$[$0] 
break;
case 27:
 this.$ = { key: $$[$0] } 
break;
case 28:
 this.$ = Object.assign({}, $$[$0-2], $$[$0]); 
break;
}
},
table: [{3:1,4:2,6:3,7:$V0,8:$V1,9:$V2,10:$V3,11:$V4,12:$V5,13:14,14:$V6,15:$V7,16:$V8,17:$V9,18:$Va,19:$Vb,20:$Vc,21:$Vd,22:$Ve,23:$Vf,24:$Vg,25:$Vh,26:$Vi,27:$Vj,28:$Vk,29:$Vl,30:11,31:$Vm,32:$Vn,33:4},{1:[3]},{5:[1,31]},{5:[2,30],32:[1,32]},{5:[2,29]},o($Vo,[2,2]),o($Vo,[2,3]),o($Vo,[2,4]),o($Vo,[2,5]),o($Vo,[2,6]),o($Vo,[2,7]),{5:[2,27]},{5:[2,24]},{5:[2,25]},{5:[2,26]},{5:[2,8]},{5:[2,9]},{5:[2,10]},{5:[2,11]},{5:[2,12]},{5:[2,13]},{5:[2,14]},{5:[2,15]},{5:[2,16]},{5:[2,17]},{5:[2,18]},{5:[2,19]},{5:[2,20]},{5:[2,21]},{5:[2,22]},{5:[2,23]},{1:[2,1]},{4:33,6:3,7:$V0,8:$V1,9:$V2,10:$V3,11:$V4,12:$V5,13:14,14:$V6,15:$V7,16:$V8,17:$V9,18:$Va,19:$Vb,20:$Vc,21:$Vd,22:$Ve,23:$Vf,24:$Vg,25:$Vh,26:$Vi,27:$Vj,28:$Vk,29:$Vl,30:11,31:$Vm,32:$Vn,33:4},{5:[2,28]}],
defaultActions: {4:[2,29],11:[2,27],12:[2,24],13:[2,25],14:[2,26],15:[2,8],16:[2,9],17:[2,10],18:[2,11],19:[2,12],20:[2,13],21:[2,14],22:[2,15],23:[2,16],24:[2,17],25:[2,18],26:[2,19],27:[2,20],28:[2,21],29:[2,22],30:[2,23],31:[2,1],33:[2,28]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
switch($avoiding_name_collisions) {
case 0:return 7;
case 1:return 9;
case 2:return 8;
case 3:return 10;
case 4:return 11;
case 5:return 12;
case 6:return 14;
case 7:return 15;
case 8:return 16;
case 9:return 17;
case 10:return 18;
case 11:return 19;
case 12:return 20;
case 13:return 21;
case 14:return 22;
case 15:return 23;
case 16:return 24;
case 17:return 25;
case 18:return 26;
case 19:return 27;
case 20:return 28;
case 21:return 29;
case 22:return 32;
case 23:return 31;
case 24:return 5;
}
},
rules: [/^(?:alt|option|⌥)/,/^(?:ctrl|control|⌃)/,/^(?:cmd|command|⌘)/,/^(?:meta|super|◆|◇|❖)/,/^(?:mod\b)/,/^(?:shift|⇧)/,/^(?:down|arrowdown|⬇)/,/^(?:left|arrowleft|⬅)/,/^(?:right|arrowright|➡)/,/^(?:up|arrowup|⬆)/,/^(?:backspace|⌫|⟵)/,/^(?:contextmenu|context|menu|▤|☰|𝌆)/,/^(?:delete|del|⌦)/,/^(?:end|⤓)/,/^(?:enter|⏎)/,/^(?:escape|esc\b)/,/^(?:[fF]1?[0-9])/,/^(?:home|⤒)/,/^(?:insert|ins|⎀)/,/^(?:pagedown|pgdn|⇟)/,/^(?:pageup|pgup|⇞)/,/^(?:tab|⭾|↹|⇥)/,/^(?:\+)/,/^(?:.)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
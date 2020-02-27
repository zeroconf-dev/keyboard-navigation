// @ts-nocheck
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/

export interface HotkeyObject {
    alt?: boolean;
    cmd?: boolean;
    ctrl?: boolean;
    key?: string | null;
    meta?: boolean;
    mod?: boolean;
    shift?: boolean;
    nonStrict?: boolean;
}

declare class lexer {
    parseError(text: string, hash: string): void;
}

export interface Parser {
    new (): Parser;
    readonly Parser: new () => Parser;
    readonly lexer: lexer;
    parse(hotkey: string): HotkeyObject;
    parseError(text: string, hash: string): void;
}

export const parser: Parser = (function() {
    const o = function(k, v, o, l) {
            for (o = o || {}, l = k.length; l--; o[k[l]] = v);
            return o;
        },
        $V0 = [1, 6],
        $V1 = [1, 7],
        $V2 = [1, 8],
        $V3 = [1, 9],
        $V4 = [1, 10],
        $V5 = [1, 11],
        $V6 = [1, 16],
        $V7 = [1, 17],
        $V8 = [1, 18],
        $V9 = [1, 19],
        $Va = [1, 20],
        $Vb = [1, 21],
        $Vc = [1, 22],
        $Vd = [1, 23],
        $Ve = [1, 24],
        $Vf = [1, 25],
        $Vg = [1, 26],
        $Vh = [1, 27],
        $Vi = [1, 28],
        $Vj = [1, 29],
        $Vk = [1, 30],
        $Vl = [1, 31],
        $Vm = [1, 13],
        $Vn = [1, 14],
        $Vo = [1, 33],
        $Vp = [2, 27],
        $Vq = [6, 33];
    const parser = {
        trace: function trace() {},
        yy: {},
        symbols_: {
            error: 2,
            expressions: 3,
            T_OP_NON_STRICT: 4,
            hotkey_expr: 5,
            T_EOF: 6,
            modifier_expr: 7,
            T_MODIFIER_ALT: 8,
            T_MODIFIER_COMMAND: 9,
            T_MODIFIER_CTRL: 10,
            T_MODIFIER_META: 11,
            T_MODIFIER_MOD: 12,
            T_MODIFIER_SHIFT: 13,
            special_key: 14,
            T_KEY_ARROW_DOWN: 15,
            T_KEY_ARROW_LEFT: 16,
            T_KEY_ARROW_RIGHT: 17,
            T_KEY_ARROW_UP: 18,
            T_KEY_BACKSPACE: 19,
            T_KEY_CONTEXT_MENU: 20,
            T_KEY_DELETE: 21,
            T_KEY_END: 22,
            T_KEY_ENTER: 23,
            T_KEY_ESCAPE: 24,
            T_KEY_FNUM: 25,
            T_KEY_HOME: 26,
            T_KEY_INSERT: 27,
            T_KEY_PAGE_DOWN: 28,
            T_KEY_PAGE_UP: 29,
            T_KEY_TAB: 30,
            key: 31,
            T_KEY_LITERAL: 32,
            T_OP_PLUS: 33,
            key_expr: 34,
            $accept: 0,
            $end: 1,
        },
        terminals_: {
            2: 'error',
            4: 'T_OP_NON_STRICT',
            6: 'T_EOF',
            8: 'T_MODIFIER_ALT',
            9: 'T_MODIFIER_COMMAND',
            10: 'T_MODIFIER_CTRL',
            11: 'T_MODIFIER_META',
            12: 'T_MODIFIER_MOD',
            13: 'T_MODIFIER_SHIFT',
            15: 'T_KEY_ARROW_DOWN',
            16: 'T_KEY_ARROW_LEFT',
            17: 'T_KEY_ARROW_RIGHT',
            18: 'T_KEY_ARROW_UP',
            19: 'T_KEY_BACKSPACE',
            20: 'T_KEY_CONTEXT_MENU',
            21: 'T_KEY_DELETE',
            22: 'T_KEY_END',
            23: 'T_KEY_ENTER',
            24: 'T_KEY_ESCAPE',
            25: 'T_KEY_FNUM',
            26: 'T_KEY_HOME',
            27: 'T_KEY_INSERT',
            28: 'T_KEY_PAGE_DOWN',
            29: 'T_KEY_PAGE_UP',
            30: 'T_KEY_TAB',
            32: 'T_KEY_LITERAL',
            33: 'T_OP_PLUS',
        },
        productions_: [
            0,
            [3, 3],
            [3, 2],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [14, 1],
            [31, 1],
            [31, 1],
            [31, 1],
            [31, 1],
            [34, 1],
            [5, 3],
            [5, 1],
            [5, 1],
        ],
        performAction: function anonymous(
            yytext,
            yyleng,
            yylineno,
            yy,
            yystate /* action[1] */,
            $$ /* vstack */,
            _$ /* lstack */,
        ) {
            /* this == yyval */

            const $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    this.$ = $$[$0 - 1];
                    this.$.nonStrict = true;
                    return this.$;
                case 2:
                    return $$[$0 - 1];
                case 3:
                    this.$ = { alt: true };
                    break;
                case 4:
                    this.$ = { cmd: true };
                    break;
                case 5:
                    this.$ = { ctrl: true };
                    break;
                case 6:
                    this.$ = { meta: true };
                    break;
                case 7:
                    this.$ = { mod: true };
                    break;
                case 8:
                    this.$ = { shift: true };
                    break;
                case 9:
                    this.$ = 'ArrowDown';
                    break;
                case 10:
                    this.$ = 'ArrowLeft';
                    break;
                case 11:
                    this.$ = 'ArrowRight';
                    break;
                case 12:
                    this.$ = 'ArrowUp';
                    break;
                case 13:
                    this.$ = 'Backspace';
                    break;
                case 14:
                    this.$ = 'ContextMenu';
                    break;
                case 15:
                    this.$ = 'Delete';
                    break;
                case 16:
                    this.$ = 'End';
                    break;
                case 17:
                    this.$ = 'Enter';
                    break;
                case 18:
                    this.$ = 'Escape';
                    break;
                case 19:
                    this.$ = $$[$0].toUpperCase();
                    break;
                case 20:
                    this.$ = 'Home';
                    break;
                case 21:
                    this.$ = 'Insert';
                    break;
                case 22:
                    this.$ = 'PageDown';
                    break;
                case 23:
                    this.$ = 'PageUp';
                    break;
                case 24:
                    this.$ = 'Tab';
                    break;
                case 25:
                    this.$ = $$[$0].toLowerCase();
                    break;
                case 29:
                    this.$ = { key: $$[$0] };
                    break;
                case 30:
                    this.$ = Object.assign({}, $$[$0 - 2], $$[$0]);
                    break;
            }
        },
        table: [
            {
                3: 1,
                4: [1, 2],
                5: 3,
                7: 4,
                8: $V0,
                9: $V1,
                10: $V2,
                11: $V3,
                12: $V4,
                13: $V5,
                14: 15,
                15: $V6,
                16: $V7,
                17: $V8,
                18: $V9,
                19: $Va,
                20: $Vb,
                21: $Vc,
                22: $Vd,
                23: $Ve,
                24: $Vf,
                25: $Vg,
                26: $Vh,
                27: $Vi,
                28: $Vj,
                29: $Vk,
                30: $Vl,
                31: 12,
                32: $Vm,
                33: $Vn,
                34: 5,
            },
            { 1: [3] },
            {
                4: $Vo,
                5: 32,
                6: $Vp,
                7: 4,
                8: $V0,
                9: $V1,
                10: $V2,
                11: $V3,
                12: $V4,
                13: $V5,
                14: 15,
                15: $V6,
                16: $V7,
                17: $V8,
                18: $V9,
                19: $Va,
                20: $Vb,
                21: $Vc,
                22: $Vd,
                23: $Ve,
                24: $Vf,
                25: $Vg,
                26: $Vh,
                27: $Vi,
                28: $Vj,
                29: $Vk,
                30: $Vl,
                31: 12,
                32: $Vm,
                33: $Vn,
                34: 5,
            },
            { 6: [1, 34] },
            { 6: [2, 31], 33: [1, 35] },
            { 6: [2, 32] },
            o($Vq, [2, 3]),
            o($Vq, [2, 4]),
            o($Vq, [2, 5]),
            o($Vq, [2, 6]),
            o($Vq, [2, 7]),
            o($Vq, [2, 8]),
            { 6: [2, 29] },
            { 6: [2, 25] },
            { 6: [2, 26] },
            { 6: [2, 28] },
            { 6: [2, 9] },
            { 6: [2, 10] },
            { 6: [2, 11] },
            { 6: [2, 12] },
            { 6: [2, 13] },
            { 6: [2, 14] },
            { 6: [2, 15] },
            { 6: [2, 16] },
            { 6: [2, 17] },
            { 6: [2, 18] },
            { 6: [2, 19] },
            { 6: [2, 20] },
            { 6: [2, 21] },
            { 6: [2, 22] },
            { 6: [2, 23] },
            { 6: [2, 24] },
            { 6: [1, 36] },
            { 6: $Vp },
            { 1: [2, 2] },
            {
                4: $Vo,
                5: 37,
                7: 4,
                8: $V0,
                9: $V1,
                10: $V2,
                11: $V3,
                12: $V4,
                13: $V5,
                14: 15,
                15: $V6,
                16: $V7,
                17: $V8,
                18: $V9,
                19: $Va,
                20: $Vb,
                21: $Vc,
                22: $Vd,
                23: $Ve,
                24: $Vf,
                25: $Vg,
                26: $Vh,
                27: $Vi,
                28: $Vj,
                29: $Vk,
                30: $Vl,
                31: 12,
                32: $Vm,
                33: $Vn,
                34: 5,
            },
            { 1: [2, 1] },
            { 6: [2, 30] },
        ],
        defaultActions: {
            5: [2, 32],
            12: [2, 29],
            13: [2, 25],
            14: [2, 26],
            15: [2, 28],
            16: [2, 9],
            17: [2, 10],
            18: [2, 11],
            19: [2, 12],
            20: [2, 13],
            21: [2, 14],
            22: [2, 15],
            23: [2, 16],
            24: [2, 17],
            25: [2, 18],
            26: [2, 19],
            27: [2, 20],
            28: [2, 21],
            29: [2, 22],
            30: [2, 23],
            31: [2, 24],
            33: [2, 27],
            34: [2, 2],
            36: [2, 1],
            37: [2, 30],
        },
        parseError: function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str);
            } else {
                const error = new Error(str);
                error.hash = hash;
                throw error;
            }
        },
        parse: function parse(input) {
            let self = this,
                stack = [0],
                tstack = [],
                vstack = [null],
                lstack = [],
                table = this.table,
                yytext = '',
                yylineno = 0,
                yyleng = 0,
                recovering = 0,
                TERROR = 2,
                EOF = 1;
            const args = lstack.slice.call(arguments, 1);
            const lexer = Object.create(this.lexer);
            const sharedState = { yy: {} };
            for (const k in this.yy) {
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
            let yyloc = lexer.yylloc;
            lstack.push(yyloc);
            const ranges = lexer.options && lexer.options.ranges;
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
            _token_stack: var lex = function() {
                let token;
                token = lexer.lex() || EOF;
                if (typeof token !== 'number') {
                    token = self.symbols_[token] || token;
                }
                return token;
            };
            let symbol,
                preErrorSymbol,
                state,
                action,
                a,
                r,
                yyval = {},
                p,
                len,
                newState,
                expected;
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
                    let errStr = '';
                    expected = [];
                    for (p in table[state]) {
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push("'" + this.terminals_[p] + "'");
                        }
                    }
                    if (lexer.showPosition) {
                        errStr =
                            'Parse error on line ' +
                            (yylineno + 1) +
                            ':\n' +
                            lexer.showPosition() +
                            '\nExpecting ' +
                            expected.join(', ') +
                            ", got '" +
                            (this.terminals_[symbol] || symbol) +
                            "'";
                    } else {
                        errStr =
                            'Parse error on line ' +
                            (yylineno + 1) +
                            ': Unexpected ' +
                            (symbol == EOF ? 'end of input' : "'" + (this.terminals_[symbol] || symbol) + "'");
                    }
                    this.parseError(errStr, {
                        text: lexer.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer.yylineno,
                        loc: yyloc,
                        expected: expected,
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
                            last_column: lstack[lstack.length - 1].last_column,
                        };
                        if (ranges) {
                            yyval._$.range = [
                                lstack[lstack.length - (len || 1)].range[0],
                                lstack[lstack.length - 1].range[1],
                            ];
                        }
                        r = this.performAction.apply(
                            yyval,
                            [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args),
                        );
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
        },
    };
    /* generated by jison-lex 0.3.4 */
    const lexer = (function() {
        const lexer = {
            EOF: 1,

            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput: function(input, yy) {
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
                    last_column: 0,
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input: function() {
                const ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                const lines = ch.match(/(?:\r\n?|\n).*/g);
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
            unput: function(ch) {
                const len = ch.length;
                const lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                const oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                const r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines
                        ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) +
                          oldLines[oldLines.length - lines.length].length -
                          lines[0].length
                        : this.yylloc.first_column - len,
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more: function() {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function() {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError(
                        'Lexical error on line ' +
                            (this.yylineno + 1) +
                            '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' +
                            this.showPosition(),
                        {
                            text: '',
                            token: null,
                            line: this.yylineno,
                        },
                    );
                }
                return this;
            },

            // retain first n characters of the match
            less: function(n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput: function() {
                const past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, '');
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function() {
                let next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, '');
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function() {
                const pre = this.pastInput();
                const c = new Array(pre.length + 1).join('-');
                return pre + this.upcomingInput() + '\n' + c + '^';
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function(match, indexed_rule) {
                let token, lines, backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column,
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
                        done: this.done,
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
                    last_column: lines
                        ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length
                        : this.yylloc.last_column + match[0].length,
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, (this.offset += this.yyleng)];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(
                    this,
                    this.yy,
                    this,
                    indexed_rule,
                    this.conditionStack[this.conditionStack.length - 1],
                );
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (const k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next: function() {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                let token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = '';
                    this.match = '';
                }
                const rules = this._currentRules();
                for (let i = 0; i < rules.length; i++) {
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
                if (this._input === '') {
                    return this.EOF;
                } else {
                    return this.parseError(
                        'Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(),
                        {
                            text: '',
                            token: null,
                            line: this.yylineno,
                        },
                    );
                }
            },

            // return next match that has a token
            lex: function lex() {
                const r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                const n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions['INITIAL'].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return 'INITIAL';
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: {},
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                const YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        return 8;
                    case 1:
                        return 10;
                    case 2:
                        return 9;
                    case 3:
                        return 11;
                    case 4:
                        return 12;
                    case 5:
                        return 13;
                    case 6:
                        return 15;
                    case 7:
                        return 16;
                    case 8:
                        return 17;
                    case 9:
                        return 18;
                    case 10:
                        return 19;
                    case 11:
                        return 20;
                    case 12:
                        return 21;
                    case 13:
                        return 22;
                    case 14:
                        return 23;
                    case 15:
                        return 24;
                    case 16:
                        return 25;
                    case 17:
                        return 26;
                    case 18:
                        return 27;
                    case 19:
                        return 28;
                    case 20:
                        return 29;
                    case 21:
                        return 30;
                    case 22:
                        return 33;
                    case 23:
                        return 4;
                    case 24:
                        return 32;
                    case 25:
                        return 6;
                }
            },
            rules: [
                /^(?:alt|option|⌥)/,
                /^(?:ctrl|control|⌃)/,
                /^(?:cmd|command|⌘)/,
                /^(?:meta|super|◆|◇|❖)/,
                /^(?:mod\b)/,
                /^(?:shift|⇧)/,
                /^(?:down|arrowdown|⬇)/,
                /^(?:left|arrowleft|⬅)/,
                /^(?:right|arrowright|➡)/,
                /^(?:up|arrowup|⬆)/,
                /^(?:backspace|⌫|⟵)/,
                /^(?:contextmenu|context|menu|▤|☰|𝌆)/,
                /^(?:delete|del|⌦)/,
                /^(?:end|⤓)/,
                /^(?:enter|⏎)/,
                /^(?:escape|esc\b)/,
                /^(?:[fF]1?[0-9])/,
                /^(?:home|⤒)/,
                /^(?:insert|ins|⎀)/,
                /^(?:pagedown|pgdn|⇟)/,
                /^(?:pageup|pgup|⇞)/,
                /^(?:tab|⭾|↹|⇥)/,
                /^(?:\+)/,
                /^(?:!)/,
                /^(?:.)/,
                /^(?:$)/,
            ],
            conditions: {
                INITIAL: {
                    rules: [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24,
                        25,
                    ],
                    inclusive: true,
                },
            },
        };
        return lexer;
    })();
    parser.lexer = lexer;
    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser();
})();

export const Parser = parser.Parser;
export const parse = (hotkey: string) => {
    return parser.parse.call(parser, hotkey);
};


/* description: Parses keyboard shortcut/hotkey definition strings. */

/* lexical grammar */
%lex
%%

'ctrl'|'⌃'
                            return 'CTRL'
'alt'|'option'|'⌥'
                            return 'ALT'
'meta'
                            return 'META'
'shift'|'⇧'
                            return 'SHIFT'
'cmd'|'⌘'
                            return 'COMMAND'
[fF]1?[0-9]
                            return 'FNUM_KEY'
'pageup'|'pgup'|'⇞'
                            return 'PAGE_UP'
'pagedown'|'pgdn'|'⇟'
                            return 'PAGE_DOWN'
'home'|'⤒'
                            return 'HOME'
'end'|'⤓'
                            return 'END'
'insert'|'ins'|'⎀'
                            return 'INSERT'
'left'|'arrowleft'|'⬅'
                            return 'ARROW_LEFT'
'right'|'arrowright'|'➡'
                            return 'ARROW_RIGHT'
'up'|'arrowup'|'⬆'
                            return 'ARROW_UP'
'down'|'arrowdown'|'⬇'
                            return 'ARROW_DOWN'
'enter'|'⏎'
                            return 'ENTER'
'tab'|'⭾'|'↹'|'⇥'
                            return 'TAB'
'backspace'|'⌫'|'⟵'
                            return 'BACKSPACE'
'delete'|'del'|'⌦'
                            return 'DELETE'
'esc'
                            return 'ESCAPE'
'+'
                            return '+'
.
                            return 'KEY_LITERAL'
<<EOF>>
                            return 'EOF'

/lex

/* operator associations and precedence */

%left '+'

%start expressions

%% /* language grammar */

expressions
    : hotkey_expr EOF {
        return Object.assign({
            alt: false,
            ctrl: false,
            meta: false,
            shift: false,
            key: null
        }, $1);
    };

modifier_expr
    : ALT   -> { $$ = { alt: true } }
    | CTRL  -> { $$ = { ctrl: true } }
    | META  -> { $$ = { meta: true } }
    | SHIFT -> { $$ = { shift: true } }
    ;

special_key
    : FNUM_KEY    -> { $$ = $1.toUpperCase() }
    | HOME        -> { $$ = 'Home' }
    | END         -> { $$ = 'End' }
    | PAGE_UP     -> { $$ = 'PageUp' }
    | PAGE_DOWN   -> { $$ = 'PageDown' }
    | INSERT      -> { $$ = 'Insert' }
    | ARROW_UP    -> { $$ = 'ArrowUp' }
    | ARROW_DOWN  -> { $$ = 'ArrowDown' }
    | ARROW_LEFT  -> { $$ = 'ArrowLeft' }
    | ARROW_RIGHT -> { $$ = 'ArrowRight' }
    | ENTER       -> { $$ = 'Enter' }
    | TAB         -> { $$ = 'Tab' }
    | BACKSPACE   -> { $$ = 'Backspace' }
    | DELETE      -> { $$ = 'Delete' }
    | ESCAPE      -> { $$ = 'Escape' }
    ;

key
    : KEY_LITERAL -> { $$ = $1.toLowerCase() }
    | special_key
    ;

key_expr
    : key -> { $$ = { key: $1 } }
    ;

hotkey_expr
    : modifier_expr '+' hotkey_expr -> { $$ = Object.assign({}, $1, $3); }
    | modifier_expr '+' '+'         -> { $$ = Object.assign({}, $1, { key: "+" }); }
    | key_expr                      -> { $$ = $1 }
    | modifier_expr                 -> { $$ = $1 }
    ;

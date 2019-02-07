
/**
 * description: Parses keyboard shortcut/hotkey definition strings.
 */

%lex

%%
'alt'|'option'|'⌥'                          return 'T_MODIFIER_ALT';
'ctrl'|'control'|'⌃'                        return 'T_MODIFIER_CTRL';
'cmd'|'command'|'⌘'                         return 'T_MODIFIER_COMMAND';
'meta'|'super'|'◆'|'◇'|'❖'                  return 'T_MODIFIER_META';
'mod'                                       return 'T_MODIFIER_MOD';
'shift'|'⇧'                                 return 'T_MODIFIER_SHIFT';

'down'|'arrowdown'|'⬇'                      return 'T_KEY_ARROW_DOWN';
'left'|'arrowleft'|'⬅'                      return 'T_KEY_ARROW_LEFT';
'right'|'arrowright'|'➡'                    return 'T_KEY_ARROW_RIGHT';
'up'|'arrowup'|'⬆'                          return 'T_KEY_ARROW_UP';
'backspace'|'⌫'|'⟵'                         return 'T_KEY_BACKSPACE';
'contextmenu'|'context'|'menu'|'▤'|'☰'|'𝌆'  return 'T_KEY_CONTEXT_MENU';
'delete'|'del'|'⌦'                          return 'T_KEY_DELETE';
'end'|'⤓'                                   return 'T_KEY_END';
'enter'|'⏎'                                 return 'T_KEY_ENTER';
'escape'|'esc'                              return 'T_KEY_ESCAPE';
[fF]1?[0-9]                                 return 'T_KEY_FNUM';
'home'|'⤒'                                  return 'T_KEY_HOME';
'insert'|'ins'|'⎀'                          return 'T_KEY_INSERT';
'pagedown'|'pgdn'|'⇟'                       return 'T_KEY_PAGE_DOWN';
'pageup'|'pgup'|'⇞'                         return 'T_KEY_PAGE_UP';
'tab'|'⭾'|'↹'|'⇥'                           return 'T_KEY_TAB';

'+'                                         return 'T_OP_PLUS';

.                                           return 'T_KEY_LITERAL';

<<EOF>>                                     return 'T_EOF';

/lex

/* operator associations and precedence */

%left 'T_OP_PLUS'

%start expressions

%% /* language grammar */

expressions
    : hotkey_expr T_EOF {
        return $1;
    };

modifier_expr
    : T_MODIFIER_ALT     { $$ = { alt: true } }
    | T_MODIFIER_COMMAND { $$ = { cmd: true } }
    | T_MODIFIER_CTRL    { $$ = { ctrl: true } }
    | T_MODIFIER_META    { $$ = { meta: true } }
    | T_MODIFIER_MOD     { $$ = { mod: true } }
    | T_MODIFIER_SHIFT   { $$ = { shift: true } }
    ;

special_key
    : T_KEY_ARROW_DOWN   { $$ = 'ArrowDown' }
    | T_KEY_ARROW_LEFT   { $$ = 'ArrowLeft' }
    | T_KEY_ARROW_RIGHT  { $$ = 'ArrowRight' }
    | T_KEY_ARROW_UP     { $$ = 'ArrowUp' }
    | T_KEY_BACKSPACE    { $$ = 'Backspace' }
    | T_KEY_CONTEXT_MENU { $$ = 'ContextMenu' }
    | T_KEY_DELETE       { $$ = 'Delete' }
    | T_KEY_END          { $$ = 'End' }
    | T_KEY_ENTER        { $$ = 'Enter' }
    | T_KEY_ESCAPE       { $$ = 'Escape' }
    | T_KEY_FNUM         { $$ = $1.toUpperCase() }
    | T_KEY_HOME         { $$ = 'Home' }
    | T_KEY_INSERT       { $$ = 'Insert' }
    | T_KEY_PAGE_DOWN    { $$ = 'PageDown' }
    | T_KEY_PAGE_UP      { $$ = 'PageUp' }
    | T_KEY_TAB          { $$ = 'Tab' }
    ;

key
    : T_KEY_LITERAL      { $$ = $1.toLowerCase() }
    | T_OP_PLUS          { $$ = $1 }
    | special_key
    ;

key_expr
    : key                { $$ = { key: $1 } }
    ;

hotkey_expr
    : modifier_expr T_OP_PLUS hotkey_expr
        { $$ = Object.assign({}, $1, $3); }
    | key_expr
        { $$ = $1 }
    | modifier_expr
        { $$ = $1 }
    ;

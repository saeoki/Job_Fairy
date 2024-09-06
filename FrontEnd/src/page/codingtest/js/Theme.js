import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

export const Theme = createTheme({
    theme: 'dark',
    settings: {
      background: '#273747',
      backgroundImage: '',
      foreground: '#44576c',
      caret: '#AEAFAD',
      selection: '#D6D6D6',
      selectionMatch: '#D6D6D6',
      gutterBackground: '#263747',
      gutterForeground: '#44576c',
      gutterBorder: '#dddddd',
      gutterActiveForeground: '',
      lineHighlight: '#202b3d',
    },
    styles: [
      { tag: t.comment, color: '#d27b53' },
      { tag: t.definition(t.typeName), color: '#c38fe5' },
      { tag: t.typeName, color: '#c38fe5' },
      { tag: t.tagName, color: '#4caf50' },
      { tag: t.variableName, color: '#f4e23e' },
      { tag: t.definition(t.variableName), color: '#f4e23e' },
      { tag: t.function(t.variableName), color: '#4caf50' },
      { tag: t.propertyName, color: '#99cc98' },
      { tag: t.string, color: '#e7c547' },
      { tag: t.number, color: '#a16a94' },
      { tag: t.bool, color: '#a16a94' },
      { tag: t.keyword, color: '#c38fe5' },
      { tag: t.bracket, color: '#ffffff' },
    ],
});
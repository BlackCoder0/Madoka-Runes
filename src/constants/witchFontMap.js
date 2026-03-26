const umlautHeader = ['\u00c4', '\u00d6', '\u00dc', '\u00df'];
const umlautChars = '\u00c4\u00d6\u00dc\u00df';

export const witchFontMap = [
  {
    label: '古代体',
    font: 'MadokaRunes2',
    key: 'ancient',
    sections: [
      { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHIJ' },
      { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOPQRST' },
      { header: ['U', 'V', 'W', 'X', 'Y', 'Z', ...umlautHeader], characters: `UVWXYZ${umlautChars}` },
      { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '0123456789' }
    ]
  },
  {
    label: '现代体',
    font: 'MadokaRunes2',
    key: 'modern',
    sections: [
      { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHIJ' },
      { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOPQRST' },
      { header: ['U', 'V', 'W', 'X', 'Y', 'Z', ...umlautHeader], characters: `U/W/YZ${umlautChars}` },
      { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '0123456789' }
    ]
  },
  {
    label: '音乐体',
    font: 'MadokaMusical',
    key: 'musical',
    sections: [
      { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHI/' },
      { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOP/RST' },
      { header: ['U', 'V', 'W', 'X', 'Y', 'Z', ...umlautHeader], characters: 'UV//YZ////' },
      { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '//////////' }
    ]
  },
  {
    label: '哥特体',
    font: 'nkf11_magicum_texturae',
    key: 'gothic',
    sections: [
      { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHIJ' },
      { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOPQRST' },
      { header: ['U', 'V', 'W', 'X', 'Y', 'Z', ...umlautHeader], characters: `UVWXYZ${umlautChars}` },
      { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '0123456789' }
    ]
  }
];

export function getWitchFontByKey(fontKey) {
  return witchFontMap.find((font) => font.key === fontKey) ?? witchFontMap[0];
}

export function getDisplayChar(fontKey, rawChar) {
  if (!rawChar || rawChar === ' ') {
    return '/';
  }

  if (fontKey === 'modern') {
    return rawChar.toLowerCase();
  }

  if (fontKey === 'ancient') {
    return rawChar.toUpperCase();
  }

  return rawChar;
}

export function normalizeTextForFont(fontKey, text) {
  if (!text) {
    return '';
  }

  if (fontKey === 'modern') {
    return text.toLowerCase();
  }

  if (fontKey === 'ancient' || fontKey === 'musical' || fontKey === 'gothic') {
    return text.toUpperCase();
  }

  return text;
}

export function getPlainOutputChar(fontKey, headerChar) {
  if (fontKey === 'modern') {
    return headerChar.toLowerCase();
  }

  return headerChar;
}

export function createFontLookup(fontKey) {
  const font = getWitchFontByKey(fontKey);
  const lookup = new Map();

  font.sections.forEach((section) => {
    section.header.forEach((headerChar, charIdx) => {
      const displayChar = getDisplayChar(font.key, section.characters?.[charIdx] ?? '');

      if (displayChar !== '/') {
        lookup.set(displayChar, getPlainOutputChar(font.key, headerChar));
      }
    });
  });

  return lookup;
}

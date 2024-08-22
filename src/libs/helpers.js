export function isValidSVG(svgString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return false;
    }
    const isSvg = doc.documentElement.nodeName === 'svg';
    return isSvg;
  } catch (error) {
    return false;
  }
}
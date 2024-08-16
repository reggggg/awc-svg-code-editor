import * as monaco from 'monaco-editor';
import { getXmlCompletionProvider, getXmlHoverProvider } from './completion-provider.js';

let editor;

function formatXml(xml) {
  const PADDING = ' '.repeat(2);
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;

  xml = xml.replace(reg, '$1\r\n$2$3');

  return xml.split('\r\n').map((node, index) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/) && pad > 0) {
      pad -= 1;
    } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    pad += indent;

    return PADDING.repeat(pad - indent) + node;
  }).join('\r\n');
}

export const initializeMonaco = (editorElementId) => {
  const editorElement = document.getElementById(editorElementId);

  if (!editorElement) {
    console.error(`Editor element with id ${editorElementId} not found!`);
    return;
  }

  editor = monaco.editor.create(editorElement, {
    theme: 'vs-dark',
    language: 'xml',
    automaticLayout: true,
    tabSize: 2,
    value: "Loading please wait...",
    readOnly: true
  });

  monaco.languages.registerDocumentFormattingEditProvider('xml', {
    async provideDocumentFormattingEdits(model, options, token) {
      return [
        {
          range: model.getFullModelRange(),
          text: formatXml(model.getValue()),
        },
      ];
    },
  });

  monaco.languages.registerCompletionItemProvider('xml', getXmlCompletionProvider(monaco));
  monaco.languages.registerHoverProvider('xml', getXmlHoverProvider(monaco));

  return editor;
}

export { editor };

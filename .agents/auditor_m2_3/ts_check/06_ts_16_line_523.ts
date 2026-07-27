import { Collaboration } from '@tiptap/extension-collaboration';

const editor = new Editor({
  extensions: [
    Collaboration.configure({
      document: ydoc,
      field: 'prosemirror',
    }),
  ],
});

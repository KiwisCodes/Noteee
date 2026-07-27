import * as Y from 'yjs';

export interface ISyncProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  syncDoc(doc: Y.Doc): void;
}

export function createYjsDocument(id: string): Y.Doc {
  const doc = new Y.Doc({ guid: id });
  return doc;
}

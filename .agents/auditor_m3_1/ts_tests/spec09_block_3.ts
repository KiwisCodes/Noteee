import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export interface CollaborationSession {
  doc: Y.Doc;
  provider: WebsocketProvider;
  xmlFragment: Y.XmlFragment;
}

export function initYjsSession(
  pageId: string,
  serverUrl: string,
  authToken: string
): CollaborationSession {
  const doc = new Y.Doc();
  
  const provider = new WebsocketProvider(serverUrl, `page-${pageId}`, doc, {
    params: { auth_token: authToken },
    connect: true,
  });

  // Root ProseMirror document fragment for TipTap block editor integration
  const xmlFragment = doc.getXmlFragment('prosemirror');

  return { doc, provider, xmlFragment };
}
import { Block, BlockType } from '@noteee/core';

export interface EditorBridgeMessage {
  type: 'LOAD_DOCUMENT' | 'BLOCK_UPDATED' | 'BLOCK_DELETED' | 'SLASH_COMMAND';
  payload: Record<string, unknown>;
}

export function serializeBlockToHtml(block: Block): string {
  switch (block.type) {
    case 'heading_1':
      return `<h1>${block.content.text || ''}</h1>`;
    case 'heading_2':
      return `<h2>${block.content.text || ''}</h2>`;
    case 'heading_3':
      return `<h3>${block.content.text || ''}</h3>`;
    case 'code_block':
      return `<pre><code>${block.content.text || ''}</code></pre>`;
    default:
      return `<p>${block.content.text || ''}</p>`;
  }
}

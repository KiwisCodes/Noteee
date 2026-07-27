import React from 'react';
import { DesignTokens } from '@noteee/ui';

export default function HomePage() {
  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: DesignTokens.colors.primary, fontSize: '36px' }}>Noteee Web Client</h1>
      <p style={{ color: DesignTokens.colors.textSecondary, fontSize: '18px' }}>
        Capture-First, AI-Powered Offline-First Cross-Platform Notebook App
      </p>
      <div style={{ marginTop: '24px', padding: '20px', background: DesignTokens.colors.surfaceDark, borderRadius: DesignTokens.borderRadius.md }}>
        <h3>System Status</h3>
        <ul>
          <li>Monorepo Workspace: Active</li>
          <li>Layers 1-6 Architecture Specs: Loaded</li>
          <li>Local-First Drizzle ORM: Ready</li>
        </ul>
      </div>
    </main>
  );
}

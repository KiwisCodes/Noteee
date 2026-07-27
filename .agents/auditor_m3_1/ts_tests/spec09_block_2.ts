import {
  PowerSyncBackendConnector,
  PowerSyncCredentials,
  AbstractPowerSyncDatabase,
  CrudEntry,
} from '@powersync/react-native';
import { SupabaseClient } from '@supabase/supabase-js';

export class NoteeePowerSyncConnector implements PowerSyncBackendConnector {
  constructor(
    private supabase: SupabaseClient,
    private powersyncUrl: string
  ) {}

  /**
   * Fetches valid Supabase JWT access token for PowerSync WebSocket handshake.
   */
  async fetchCredentials(): Promise<PowerSyncCredentials> {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error || !session) {
      throw new Error(`Authentication token missing for PowerSync: ${error?.message}`);
    }

    return {
      endpoint: this.powersyncUrl,
      token: session.access_token,
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
    };
  }

  /**
   * Uploads local SQLite transactional outbox entries to backend Cloud PostgreSQL database.
   */
  async uploadData(db: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await db.getNextCrudTransaction();
    if (!transaction) return;

    try {
      for (const op of transaction.crud) {
        await this.processCrudEntry(op);
      }
      await transaction.complete();
    } catch (err) {
      console.error('Failed uploading PowerSync CRUD transaction batch:', err);
      throw err;
    }
  }

  private async processCrudEntry(entry: CrudEntry): Promise<void> {
    const table = entry.table;
    const id = entry.id;

    switch (entry.op) {
      case 'PUT': {
        const { error } = await this.supabase
          .from(table)
          .upsert({ id, ...entry.opData });
        if (error) throw new Error(`Supabase UPSERT failed on ${table}: ${error.message}`);
        break;
      }
      case 'PATCH': {
        const { error } = await this.supabase
          .from(table)
          .update(entry.opData)
          .eq('id', id);
        if (error) throw new Error(`Supabase PATCH failed on ${table}: ${error.message}`);
        break;
      }
      case 'DELETE': {
        const { error } = await this.supabase
          .from(table)
          .delete()
          .eq('id', id);
        if (error) throw new Error(`Supabase DELETE failed on ${table}: ${error.message}`);
        break;
      }
    }
  }
}
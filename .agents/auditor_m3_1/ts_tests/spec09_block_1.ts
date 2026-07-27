import { Schema, Table, Column, ColumnType } from '@powersync/react-native';

export const AppPowerSyncSchema = new Schema([
  new Table({
    name: 'folders',
    columns: [
      new Column({ name: 'parent_id', type: ColumnType.TEXT }),
      new Column({ name: 'name', type: ColumnType.TEXT }),
      new Column({ name: 'icon', type: ColumnType.TEXT }),
      new Column({ name: 'color', type: ColumnType.TEXT }),
      new Column({ name: 'path', type: ColumnType.TEXT }),
      new Column({ name: 'is_system_anchor', type: ColumnType.INTEGER }),
      new Column({ name: 'is_vault', type: ColumnType.INTEGER }),
      new Column({ name: 'created_at', type: ColumnType.TEXT }),
      new Column({ name: 'updated_at', type: ColumnType.TEXT }),
    ],
  }),

  new Table({
    name: 'pages',
    columns: [
      new Column({ name: 'folder_id', type: ColumnType.TEXT }),
      new Column({ name: 'parent_page_id', type: ColumnType.TEXT }),
      new Column({ name: 'title', type: ColumnType.TEXT }),
      new Column({ name: 'icon', type: ColumnType.TEXT }),
      new Column({ name: 'cover_image', type: ColumnType.TEXT }),
      new Column({ name: 'is_vault', type: ColumnType.INTEGER }),
      new Column({ name: 'created_at', type: ColumnType.TEXT }),
      new Column({ name: 'updated_at', type: ColumnType.TEXT }),
    ],
  }),

  new Table({
    name: 'blocks',
    columns: [
      new Column({ name: 'page_id', type: ColumnType.TEXT }),
      new Column({ name: 'parent_block_id', type: ColumnType.TEXT }),
      new Column({ name: 'type', type: ColumnType.TEXT }),
      new Column({ name: 'order_index', type: ColumnType.REAL }),
      new Column({ name: 'content', type: ColumnType.TEXT }), // JSON payload string
      new Column({ name: 'created_at', type: ColumnType.TEXT }),
      new Column({ name: 'updated_at', type: ColumnType.TEXT }),
    ],
  }),

  new Table({
    name: 'capture_sessions',
    columns: [
      new Column({ name: 'status', type: ColumnType.TEXT }),
      new Column({ name: 'target_folder_id', type: ColumnType.TEXT }),
      new Column({ name: 'target_page_id', type: ColumnType.TEXT }),
      new Column({ name: 'media_type', type: ColumnType.TEXT }),
      new Column({ name: 'session_data', type: ColumnType.TEXT }), // JSON payload
      new Column({ name: 'created_at', type: ColumnType.TEXT }),
      new Column({ name: 'updated_at', type: ColumnType.TEXT }),
    ],
  }),

  new Table({
    name: 'tags',
    columns: [
      new Column({ name: 'name', type: ColumnType.TEXT }),
      new Column({ name: 'color', type: ColumnType.TEXT }),
    ],
  }),

  new Table({
    name: 'page_tags',
    columns: [
      new Column({ name: 'page_id', type: ColumnType.TEXT }),
      new Column({ name: 'tag_id', type: ColumnType.TEXT }),
      new Column({ name: 'is_auto_tag', type: ColumnType.INTEGER }),
    ],
  }),
]);
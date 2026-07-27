
declare module 'drizzle-orm/sqlite-core' {
  export function sqliteTable(name: string, schema: any): any;
  export function text(name: string, opts?: any): any;
  export function integer(name: string, opts?: any): any;
  export function real(name: string, opts?: any): any;
  export function blob(name: string, opts?: any): any;
}
declare module 'react' {
  export type ReactNode = any;
}

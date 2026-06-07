import { mkdirSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client'

type SqliteValue = bigint | boolean | null | number | string | Uint8Array
type SqliteRow = Record<string, SqliteValue>
type SqlDriverAdapter = Awaited<ReturnType<SqlDriverAdapterFactory['connect']>>
type SqlQueryable = Pick<
  SqlDriverAdapter,
  'adapterName' | 'executeRaw' | 'provider' | 'queryRaw'
>

const SQLITE_COLUMN_TYPES = {
  int64: 1,
  double: 3,
  boolean: 5,
  text: 7,
  dateTime: 10,
  bytes: 13,
} as const

function resolveDatabasePath(): string {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  const sqlitePath = databaseUrl.replace(/^file:/, '')
  const backendRoot = resolve(__dirname, '..', '..')

  return isAbsolute(sqlitePath) ? sqlitePath : resolve(backendRoot, sqlitePath)
}

function inferColumnType(value: unknown) {
  if (typeof value === 'bigint') {
    return SQLITE_COLUMN_TYPES.int64
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? SQLITE_COLUMN_TYPES.int64
      : SQLITE_COLUMN_TYPES.double
  }

  if (typeof value === 'boolean') {
    return SQLITE_COLUMN_TYPES.boolean
  }

  if (value instanceof Uint8Array) {
    return SQLITE_COLUMN_TYPES.bytes
  }

  if (value instanceof Date) {
    return SQLITE_COLUMN_TYPES.dateTime
  }

  return SQLITE_COLUMN_TYPES.text
}

function toSqlInputValue(value: unknown): SQLInputValue {
  if (value === null) {
    return null
  }

  if (
    typeof value === 'bigint' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    value instanceof Uint8Array
  ) {
    return value
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  throw new TypeError('Unsupported SQLite parameter value')
}

function toSqlInputValues(values: unknown[]): SQLInputValue[] {
  return values.map(toSqlInputValue)
}

function createQueryable(database: DatabaseSync): SqlQueryable {
  return {
    provider: 'sqlite' as const,
    adapterName: 'lexflow-node-sqlite',
    async queryRaw(params) {
      const statement = database.prepare(params.sql)
      const records = statement.all(...toSqlInputValues(params.args)) as SqliteRow[]
      const columnNames = statement.columns().map((column) => column.name)
      const rows = records.map((record) =>
        columnNames.map((columnName) => record[columnName] ?? null),
      )
      const firstRow = rows[0]
      const columnTypes = columnNames.map((_, index) =>
        inferColumnType(firstRow?.[index]),
      )

      return {
        columnTypes,
        columnNames,
        rows,
      }
    },
    async executeRaw(params) {
      const statement = database.prepare(params.sql)
      const result = statement.run(...toSqlInputValues(params.args))

      return Number(result.changes)
    },
  }
}

export function createSqliteAdapter(): SqlDriverAdapterFactory {
  return {
    provider: 'sqlite',
    adapterName: 'lexflow-node-sqlite',
    async connect() {
      const databasePath = resolveDatabasePath()

      mkdirSync(dirname(databasePath), { recursive: true })

      const database = new DatabaseSync(databasePath)
      const queryable = createQueryable(database)

      return {
        ...queryable,
        async executeScript(script) {
          database.exec(script)
        },
        async startTransaction() {
          database.exec('BEGIN')

          return {
            ...queryable,
            options: {
              usePhantomQuery: false,
            },
            async commit() {
              database.exec('COMMIT')
            },
            async rollback() {
              database.exec('ROLLBACK')
            },
          }
        },
        async dispose() {
          database.close()
        },
      }
    },
  }
}

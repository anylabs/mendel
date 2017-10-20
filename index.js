const { Client } = require("pg")
const fs = require("fs")
const path = require("path")

process.on("unhandledRejection", reason => {
  console.error(reason)
  process.exit(1)
})

const client = new Client(process.env.DATABASE_URL)
const completed = []
const dir = path.resolve(__dirname).split("/node_modules")[0] + "/migrations"

migrate()

async function migrate() {
  await client.connect()

  try {
    await client.query("BEGIN")
    await getAdvisoryLock()
    await createMigrationsTable()

    const currentVersion = await getCurrentVersion()
    const migrations = await loadMigrations(currentVersion)

    await executeMigrations(migrations, currentVersion)
    await addCompletedMigrations()
    await client.query("COMMIT")
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.end()
  }
}

async function getAdvisoryLock() {
  logger.start("Getting advisory lock")

  const result = await client.query("SELECT pg_try_advisory_lock(1)")

  if (!result.rows[0].pg_try_advisory_lock) {
    throw Error("Could not get advisory lock")
  }

  logger.complete()
}

async function createMigrationsTable() {
  logger.start("Creating migrations table")

  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations(
      version integer,
      executed timestamptz default now()
    )`)

  logger.complete()
}

async function loadMigrations(currentVersion) {
  logger.start("Loading migrations")

  const all = await getAllMigrations()
  const migrations = all.filter(({ version }) => version > currentVersion)

  logger.log("Found %s new migrations", migrations.length)
  logger.complete()

  return migrations
}

async function getCurrentVersion() {
  const result = await client.query(`
    SELECT version FROM migrations
    ORDER BY version DESC
    LIMIT 1`)

  const row = result.rows[0]
  const version = row ? row.version : 0

  logger.log("Current version is %s", version)

  return version
}

function getAllMigrations() {
  return new Promise(function(resolve, reject) {
    fs.readdir(dir, function(error, files) {
      if (error) {
        reject(error)
      } else {
        const sqlFiles = files
          .filter(file => path.extname(file) === ".sql")
          .map(file => ({
            file,
            version: parseInt(file.replace(".sql", "")),
          }))
          .sort((a, b) => (a.version < b.version ? -1 : 1))

        logger.log("Found %s migration files", sqlFiles.length)
        resolve(sqlFiles)
      }
    })
  })
}

async function executeMigrations(migrations, currentVersion) {
  if (!migrations.length) {
    return
  }

  logger.start("Executing migrations")

  for (const migration of migrations) {
    ensureExpectedVersion(migration, currentVersion)
    await executeMigration(migration)
  }

  logger.log("Completed %s migrations", completed.length)
  logger.complete()
}

function ensureExpectedVersion(migration, currentVersion) {
  const previousVersion = completed[completed.length - 1] || currentVersion
  const expectedVersion = previousVersion + 1

  if (migration.version != expectedVersion) {
    throw Error(`
      Cannot migrate from version '${previousVersion}' to '${migration.version}' (expected next version to be '${expectedVersion}')`)
  }
}

async function executeMigration(migration) {
  const start = new Date()

  try {
    const query = fs.readFileSync(`${dir}/${migration.file}`).toString()

    await client.query(query)
    completed.push(migration.version)
    logger.log("%s completed in %sms", migration.file, new Date() - start)
  } catch (e) {
    logger.log("%s failed with error '%s'.", name, e.message)
    process.exit(1)
  }
}

async function addCompletedMigrations() {
  if (completed.length === 0) {
    return
  }

  const querySuffix = completed.map(version => `(${version})`).join(",")
  const query = `INSERT INTO migrations (version) VALUES ${querySuffix}`

  await client.query(query)
}

const logger = {
  start(text) {
    console.log("-----> " + text)
    this.current = new Date()
  },

  log(text, ...args) {
    console.log("       " + text, ...args)
  },

  complete() {
    console.log(`       Done in ${new Date() - this.current}ms\n`)
    this.current = null
  },
}
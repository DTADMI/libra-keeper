const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

function log(message) {
  console.log(`[SETUP] ${message}`)
}

function run(command) {
  log(`Running: ${command}`)
  try {
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    process.exit(1)
  }
}

async function main() {
  log("Starting LibraKeeper Local Setup...")

  // 1. Check for .env file
  if (!fs.existsSync(path.join(__dirname, "..", ".env"))) {
    log(".env file not found. Copying from .env.example...")
    const envExample = fs.readFileSync(path.join(__dirname, "..", ".env.example"), "utf8")

    // Generate some random secrets for local dev if they are placeholders
    let envContent = envExample
      .replace("your_secure_root_password", require("crypto").randomBytes(24).toString("base64"))
      .replace("your_secure_app_password", require("crypto").randomBytes(24).toString("base64"))
      .replace("your_secure_nextauth_secret", require("crypto").randomBytes(32).toString("base64"));

    // Update DATABASE_URL to use the new app password
    const appPasswordMatch = envContent.match(/DB_APP_PASSWORD=(.*)/)
    if (appPasswordMatch) {
      const appPassword = appPasswordMatch[1].trim()
      envContent = envContent.replace(
        /DATABASE_URL="postgresql:\/\/libra_app:.*@localhost:5433\/librakeeper\?schema=public"/,
        `DATABASE_URL="postgresql://libra_app:${appPassword}@localhost:5433/librakeeper?schema=public"`,
      );
    }

    fs.writeFileSync(path.join(__dirname, "..", ".env"), envContent)
    log(".env file created with generated secrets.")
  }

  // Load .env into process.env so docker compose can see it
  const dotenv = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8")
  dotenv.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      if (value.startsWith("\"") && value.endsWith("\"")) {
        value = value.substring(1, value.length - 1)
      }
      process.env[key] = value
    }
  });

  // 2. Start Docker
  log("Starting Docker container (libra-keeper)...")
  run("docker compose up -d")

  // 3. Wait for DB to be healthy
  log("Waiting for database to be healthy...")
  let isHealthy = false
  for (let i = 0; i < 30; i++) {
    try {
      const status = execSync("docker inspect --format=\"{{.State.Health.Status}}\" libra-keeper")
        .toString()
        .trim()
      if (status === "healthy") {
        isHealthy = true
        break
      }
      log(`Database status: ${status}. Waiting... (${i + 1}/30)`)
    } catch (e) {
      log(`Waiting for container to start... (${i + 1}/30)`)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  if (!isHealthy) {
    log("Database failed to become healthy in time.")
    process.exit(1)
  }

  log("Database is healthy!")

  // Give it an extra second to be sure
  log("Giving database an extra 2 seconds to stabilize...")
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 4. Run Prisma migrations
  log("Running Prisma migrations...")
  run("pnpm exec prisma migrate dev --name init_local")

  // 5. Run tests
  log("Running tests...")
  run("pnpm test")

  log("Setup complete! You can now run \"pnpm dev\" to start the application.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

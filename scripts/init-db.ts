import { execSync } from "child_process";
import * as dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL non définie dans .env");
  process.exit(1);
}

// Extraire les infos de connexion depuis l'URL
const matches = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);

if (!matches) {
  console.error("❌ Impossible d'extraire les informations de connexion à la base de données.");
  process.exit(1);
}

const [, user, password, host, port, database] = matches;

// Vérifier si la base de données existe en se connectant à `postgres`
const checkDbCmd = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${database}'" | grep -q 1`;

try {
  console.log(`🔍 Vérification de la base de données "${database}"...`);
  execSync(checkDbCmd, { stdio: "inherit" });
  console.log(`✅ La base de données "${database}" existe déjà.`);
} catch {
  console.log(`⚠️ La base de données "${database}" n'existe pas. Création en cours...`);
  const createDbCmd = `PGPASSWORD="${password}" createdb -h ${host} -p ${port} -U ${user} ${database}`;
  
  try {
    execSync(createDbCmd, { stdio: "inherit" });
    console.log(`✅ Base de données "${database}" créée avec succès.`);
  } catch (error) {
    console.error("❌ Erreur lors de la création de la base de données :", error);
    process.exit(1);
  }
}

// Exécuter Prisma Migrate pour s'assurer que la structure est correcte
try {
  console.log(`🚀 Application des migrations Prisma...`);
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  console.log(`✅ Migrations appliquées avec succès.`);
} catch (error) {
  console.error("❌ Erreur lors de l'application des migrations Prisma :", error);
  process.exit(1);
}
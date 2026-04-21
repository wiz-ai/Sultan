import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { seedProducts, seedRecipes, seedDrivers, seedOrders } from './seed';
// re-exports come from ./seed which combines seed-products-*.ts

let _db: Database.Database | null = null;

function getDbPath() {
  const configured = process.env.SULTAN_DB_PATH;
  if (configured) return configured;
  // Default: ./data/sultan.db (dev), /tmp/sultan.db (Cloud Run)
  if (process.env.NODE_ENV === 'production') return '/tmp/sultan.db';
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'sultan.db');
}

export function db(): Database.Database {
  if (_db) return _db;
  const file = getDbPath();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  _db = new Database(file);
  _db.pragma('journal_mode = WAL');
  migrate(_db);
  seedIfEmpty(_db);
  return _db;
}

function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameAr TEXT,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      price REAL NOT NULL,
      unit TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      badges TEXT,
      emoji TEXT NOT NULL,
      gradient TEXT NOT NULL,
      origin TEXT
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameAr TEXT,
      cuisine TEXT NOT NULL,
      description TEXT NOT NULL,
      servings INTEGER NOT NULL,
      cookTimeMin INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      emoji TEXT NOT NULL,
      gradient TEXT NOT NULL,
      steps TEXT NOT NULL,
      ingredients TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      vehicle TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      deliveryFee REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      deliveryType TEXT NOT NULL,
      deliveryWindow TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      driverId TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(userId, createdAt);
  `);
}

function seedIfEmpty(d: Database.Database) {
  const row = d.prepare('SELECT COUNT(*) AS c FROM products').get() as { c: number };
  if (row.c > 0) return;

  const insProduct = d.prepare(
    `INSERT INTO products (id,name,nameAr,description,category,subcategory,price,unit,stock,badges,emoji,gradient,origin)
     VALUES (@id,@name,@nameAr,@description,@category,@subcategory,@price,@unit,@stock,@badges,@emoji,@gradient,@origin)`
  );
  const pTx = d.transaction((rows: any[]) => {
    for (const r of rows) {
      insProduct.run({
        ...r,
        nameAr: r.nameAr ?? null,
        subcategory: r.subcategory ?? null,
        badges: JSON.stringify(r.badges ?? []),
        origin: r.origin ?? null,
      });
    }
  });
  pTx(seedProducts);

  const insRecipe = d.prepare(
    `INSERT INTO recipes (id,name,nameAr,cuisine,description,servings,cookTimeMin,difficulty,emoji,gradient,steps,ingredients)
     VALUES (@id,@name,@nameAr,@cuisine,@description,@servings,@cookTimeMin,@difficulty,@emoji,@gradient,@steps,@ingredients)`
  );
  const rTx = d.transaction((rows: any[]) => {
    for (const r of rows) {
      insRecipe.run({
        ...r,
        nameAr: r.nameAr ?? null,
        steps: JSON.stringify(r.steps),
        ingredients: JSON.stringify(r.ingredients),
      });
    }
  });
  rTx(seedRecipes);

  const insDriver = d.prepare(
    `INSERT INTO drivers (id,name,phone,vehicle,color) VALUES (@id,@name,@phone,@vehicle,@color)`
  );
  const dTx = d.transaction((rows: any[]) => {
    for (const r of rows) insDriver.run(r);
  });
  dTx(seedDrivers);

  const insOrder = d.prepare(
    `INSERT INTO orders (id,userId,customerName,phone,address,lat,lng,items,subtotal,deliveryFee,tax,total,deliveryType,deliveryWindow,status,notes,driverId,createdAt)
     VALUES (@id,@userId,@customerName,@phone,@address,@lat,@lng,@items,@subtotal,@deliveryFee,@tax,@total,@deliveryType,@deliveryWindow,@status,@notes,@driverId,@createdAt)`
  );
  const oTx = d.transaction((rows: any[]) => {
    for (const r of rows) {
      insOrder.run({
        ...r,
        items: JSON.stringify(r.items),
        notes: r.notes ?? null,
        driverId: r.driverId ?? null,
      });
    }
  });
  oTx(seedOrders);
}

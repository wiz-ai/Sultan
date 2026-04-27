import { db } from './db';
import type { Product, Recipe, Driver, Order, ChatMessage } from './types';
import { randomId } from './utils';

// ── Products ────────────────────────────────────────────────────────
function parseProduct(row: any): Product {
  return { ...row, badges: row.badges ? JSON.parse(row.badges) : [] };
}

export const products = {
  list(): Product[] {
    return (db().prepare('SELECT * FROM products ORDER BY category, name').all() as any[])
      .map(parseProduct);
  },
  get(id: string): Product | null {
    const row = db().prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    return row ? parseProduct(row) : null;
  },
  byCategory(category: string): Product[] {
    return (db().prepare('SELECT * FROM products WHERE category = ? ORDER BY name').all(category) as any[])
      .map(parseProduct);
  },
  search(q: string): Product[] {
    const like = `%${q.toLowerCase()}%`;
    return (db()
      .prepare(
        `SELECT * FROM products
         WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(nameAr) LIKE ? OR LOWER(category) LIKE ?
         ORDER BY name`
      )
      .all(like, like, like, like) as any[]).map(parseProduct);
  },
  upsert(p: Product): Product {
    const badges = JSON.stringify(p.badges ?? []);
    const existing = this.get(p.id);
    if (existing) {
      db().prepare(`UPDATE products
        SET name=?, nameAr=?, description=?, category=?, subcategory=?, price=?, unit=?, stock=?, badges=?, emoji=?, gradient=?, imageUrl=?, origin=?
        WHERE id=?`).run(
          p.name, p.nameAr ?? null, p.description, p.category, p.subcategory ?? null,
          p.price, p.unit, p.stock, badges, p.emoji, p.gradient, p.imageUrl ?? null, p.origin ?? null, p.id
        );
    } else {
      db().prepare(`INSERT INTO products (id,name,nameAr,description,category,subcategory,price,unit,stock,badges,emoji,gradient,imageUrl,origin)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
          p.id, p.name, p.nameAr ?? null, p.description, p.category, p.subcategory ?? null,
          p.price, p.unit, p.stock, badges, p.emoji, p.gradient, p.imageUrl ?? null, p.origin ?? null
        );
    }
    return this.get(p.id)!;
  },
  remove(id: string) {
    db().prepare('DELETE FROM products WHERE id = ?').run(id);
  },
};

// ── Recipes ─────────────────────────────────────────────────────────
function parseRecipe(row: any): Recipe {
  return { ...row, steps: JSON.parse(row.steps), ingredients: JSON.parse(row.ingredients) };
}

export const recipes = {
  list(): Recipe[] {
    return (db().prepare('SELECT * FROM recipes').all() as any[]).map(parseRecipe);
  },
  get(id: string): Recipe | null {
    const row = db().prepare('SELECT * FROM recipes WHERE id = ?').get(id) as any;
    return row ? parseRecipe(row) : null;
  },
};

// ── Drivers ─────────────────────────────────────────────────────────
export const drivers = {
  list(): Driver[] {
    return db().prepare('SELECT * FROM drivers').all() as Driver[];
  },
  get(id: string): Driver | null {
    return (db().prepare('SELECT * FROM drivers WHERE id = ?').get(id) as Driver) ?? null;
  },
};

// ── Orders ──────────────────────────────────────────────────────────
function parseOrder(row: any): Order {
  return { ...row, items: JSON.parse(row.items) };
}

export const orders = {
  list(): Order[] {
    return (db().prepare('SELECT * FROM orders ORDER BY createdAt DESC').all() as any[]).map(parseOrder);
  },
  get(id: string): Order | null {
    const row = db().prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    return row ? parseOrder(row) : null;
  },
  byUser(userId: string): Order[] {
    return (db().prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(userId) as any[]).map(parseOrder);
  },
  byDriver(driverId: string): Order[] {
    return (db().prepare(
      `SELECT * FROM orders WHERE driverId = ? AND status IN ('confirmed','packing','out-for-delivery') ORDER BY createdAt`
    ).all(driverId) as any[]).map(parseOrder);
  },
  create(o: Omit<Order, 'id' | 'createdAt' | 'status'> & { status?: Order['status'] }): Order {
    const full: Order = {
      ...o,
      id: `o-${randomId('').slice(0, 8)}`,
      status: o.status ?? 'pending',
      createdAt: new Date().toISOString(),
    };
    db().prepare(
      `INSERT INTO orders (id,userId,customerName,phone,address,lat,lng,items,subtotal,deliveryFee,tax,total,deliveryType,deliveryWindow,status,notes,driverId,createdAt)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).run(
      full.id, full.userId, full.customerName, full.phone, full.address, full.lat, full.lng,
      JSON.stringify(full.items), full.subtotal, full.deliveryFee, full.tax, full.total,
      full.deliveryType, full.deliveryWindow, full.status, full.notes ?? null,
      full.driverId ?? null, full.createdAt
    );
    return full;
  },
  updateStatus(id: string, status: Order['status']) {
    db().prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    return this.get(id);
  },
  assignDriver(id: string, driverId: string | null) {
    db().prepare('UPDATE orders SET driverId = ? WHERE id = ?').run(driverId, id);
    return this.get(id);
  },
};

// ── Chat ────────────────────────────────────────────────────────────
export const chat = {
  history(userId: string, limit = 50): ChatMessage[] {
    return db()
      .prepare('SELECT * FROM chat_messages WHERE userId = ? ORDER BY createdAt ASC LIMIT ?')
      .all(userId, limit) as ChatMessage[];
  },
  append(msg: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage {
    const full: ChatMessage = {
      ...msg,
      id: `m-${randomId('').slice(0, 10)}`,
      createdAt: new Date().toISOString(),
    };
    db()
      .prepare(
        'INSERT INTO chat_messages (id,userId,role,content,createdAt) VALUES (?,?,?,?,?)'
      )
      .run(full.id, full.userId, full.role, full.content, full.createdAt);
    return full;
  },
  clear(userId: string) {
    db().prepare('DELETE FROM chat_messages WHERE userId = ?').run(userId);
  },
};

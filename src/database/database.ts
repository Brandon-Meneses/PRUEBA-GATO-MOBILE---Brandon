import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('users.db');

export function initDatabase() {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        dni TEXT NOT NULL,
        active INTEGER NOT NULL,
        avatar TEXT
      );
    `).catch((error) => console.error('Error al crear la tabla:', error));
  }
  
  export default db;
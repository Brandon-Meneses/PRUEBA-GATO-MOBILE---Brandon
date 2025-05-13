import db from './database';

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  active: boolean;
  avatar?: string;
};

export const insertUser = async (user: User): Promise<void> => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO users (id, first_name, last_name, email, dni, active, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id ?? null,
        user.first_name,
        user.last_name,
        user.email,
        user.dni,
        user.active ? 1 : 0,
        user.avatar || '',
      ]
    );
  } catch (error) {
    console.error('Error al insertar usuario:', error);
  }
};

type RawUser = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  active: number; 
  avatar?: string;
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const result = await db.getAllAsync<RawUser>(`SELECT * FROM users`);

    return result.map(user => ({
      ...user,
      active: user.active === 1, 
    }));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

export const updateUser = async (user: User): Promise<void> => {
  if (!user.id) return;

  try {
    await db.runAsync(
      `UPDATE users SET name = ?, email = ?, dni = ?, active = ?, avatar = ? WHERE id = ?`,
      [user.first_name, user.last_name, user.email, user.dni, user.active ? 1 : 0, user.avatar || '', user.id]
    );
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await db.runAsync(`DELETE FROM users WHERE id = ?`, [id]);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};

export const toggleUserStatus = async (id: number, newStatus: boolean): Promise<void> => {
  try {
    await db.runAsync(`UPDATE users SET active = ? WHERE id = ?`, [newStatus ? 1 : 0, id]);
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const result = await db.getFirstAsync<User>(`SELECT * FROM users WHERE id = ?`, [id]);
    return result || null;
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const raw = await db.getFirstAsync<RawUser>(`SELECT * FROM users WHERE email = ?`, [email]);

    if (!raw) return null;

    const user: User = {
      ...raw,
      active: raw.active === 1, 
    };

    return user;
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    return null;
  }
};

import { QueryTypes } from "sequelize";

import { sequelize } from "@/config/database";

// --- Types ---

export type CategoryRow = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
};

type CategoryWithTotal = CategoryRow & { total_count: string };

export type PaginationResult<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};

// --- Model ---

export const categoryModel = {
  async findAll(
    limit: number,
    offset: number
  ): Promise<PaginationResult<CategoryRow>> {
    const rows = await sequelize.query<CategoryWithTotal>(
      `SELECT id, name, description, created_at,
              COUNT(*) OVER() AS total_count
       FROM categories
       ORDER BY id
       LIMIT $1 OFFSET $2`,
      {bind: [limit, offset], type: QueryTypes.SELECT}
    );

    const total = rows.length > 0 ? parseInt(rows[0]!.total_count, 10) : 0;
    const data: CategoryRow[] = rows.map(({total_count, ...rest}) => rest);

    return {data, total, limit, offset};
  },

  async findById(id: number): Promise<CategoryRow | null> {
    const rows = await sequelize.query<CategoryRow>(
      `SELECT id, name, description, created_at
       FROM categories
       WHERE id = $1`,
      {bind: [id], type: QueryTypes.SELECT}
    );

    return rows[0] ?? null;
  },

  async create(
    name: string,
    description: string | null
  ): Promise<CategoryRow> {
    const rows = await sequelize.query<CategoryRow>(
      `INSERT INTO categories (name, description, created_at)
       VALUES ($1, $2, CURRENT_DATE)
       RETURNING id, name, description, created_at`,
      {bind: [name, description], type: QueryTypes.SELECT}
    );

    if (!rows[0]) throw new Error("Failed to create category");

    return rows[0];
  },

  async update(
    id: number,
    name: string,
    description: string | null
  ): Promise<CategoryRow | null> {
    const rows = await sequelize.query<CategoryRow>(
      `UPDATE categories
       SET name = $1, description = $2
       WHERE id = $3
       RETURNING id, name, description, created_at`,
      {bind: [name, description, id], type: QueryTypes.SELECT}
    );

    return rows[0] ?? null;
  },

  async delete(id: number): Promise<boolean> {
    const rows = await sequelize.query<{ id: number }>(
      `DELETE FROM categories WHERE id = $1 RETURNING id`,
      {bind: [id], type: QueryTypes.SELECT}
    );

    return rows.length > 0;
  },
};
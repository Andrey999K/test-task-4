import { QueryTypes } from "sequelize";
import { sequelize } from "@/config/database";

interface ProductRow {
  id: number;
  name: string;
  category_id: number;
  price: number;
  stock: number;
  added_at: Date;
}

interface CountRow {
  count: string;
}

interface PaginationResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export const productModel = {
  async findAll(limit: number, offset: number): Promise<PaginationResult<ProductRow>> {
    const products = await sequelize.query<ProductRow>(
      `SELECT id, name, category_id, price, stock, added_at 
       FROM products 
       ORDER BY id 
       LIMIT $1 OFFSET $2`,
      { bind: [limit, offset], type: QueryTypes.SELECT }
    );

    const countResult = await sequelize.query<CountRow>(
      "SELECT COUNT(*) as count FROM products",
      { type: QueryTypes.SELECT }
    );

    const total = parseInt(countResult[0]?.count || "0", 10);

    return { data: products, total, limit, offset };
  },

  async findById(id: number): Promise<ProductRow | null> {
    const products = await sequelize.query<ProductRow>(
      "SELECT id, name, category_id, price, stock, added_at FROM products WHERE id = $1",
      { bind: [id], type: QueryTypes.SELECT }
    );

    return products[0] || null;
  },

  async create(
    name: string,
    categoryId: number,
    price: number,
    stock: number
  ): Promise<ProductRow> {
    const products = await sequelize.query<ProductRow>(
      `INSERT INTO products (name, category_id, price, stock, added_at) 
       VALUES ($1, $2, $3, $4, CURRENT_DATE) 
       RETURNING id, name, category_id, price, stock, added_at`,
      { bind: [name, categoryId, price, stock], type: QueryTypes.SELECT }
    );

    const created = products[0];
    if (!created) {
      throw new Error("Failed to create product");
    }

    return created;
  },

  async update(
    id: number,
    name: string | null,
    categoryId: number | null,
    price: number | null,
    stock: number | null
  ): Promise<ProductRow | null> {
    const products = await sequelize.query<ProductRow>(
      `UPDATE products 
       SET name = COALESCE(NULLIF($1, ''), name), 
           category_id = COALESCE($2, category_id),
           price = COALESCE($3, price),
           stock = COALESCE($4, stock)
       WHERE id = $5 
       RETURNING id, name, category_id, price, stock, added_at`,
      { bind: [name, categoryId, price, stock, id], type: QueryTypes.SELECT }
    );

    return products[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await sequelize.query<{ id: number }>(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      { bind: [id], type: QueryTypes.SELECT }
    );

    return result.length > 0;
  },
};

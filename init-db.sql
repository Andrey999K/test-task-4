CREATE DATABASE shop_db;

\c shop_db

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id          SERIAL         PRIMARY KEY,
    name        VARCHAR(100)   NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  DATE           NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE products (
    id          SERIAL         PRIMARY KEY,
    name        VARCHAR(150)   NOT NULL,
    category_id INTEGER        NOT NULL,
    price       NUMERIC(10, 2) NOT NULL,
    stock       INTEGER        NOT NULL DEFAULT 0,
    added_at    DATE           NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE INDEX idx_products_category_id ON products (category_id);

INSERT INTO categories (name, description, created_at) VALUES
    ('Electronics',  'Smartphones, laptops, accessories',    '2024-01-10'),
    ('Clothing',     'Outerwear, casual, sportswear',        '2024-01-15'),
    ('Books',        'Fiction and educational literature',   '2024-02-01'),
    ('Sports',       'Equipment and gear',                   '2024-03-05');

INSERT INTO products (name, category_id, price, stock, added_at) VALUES
    ('Samsung Galaxy A55',      1, 32990.00, 25, '2024-02-10'),
    ('Lenovo IdeaPad 3',        1, 54990.00, 10, '2024-02-15'),
    ('Sony WH-1000XM5',         1, 18500.00, 40, '2024-03-01'),
    ('Columbia Winter Jacket',  2,  8990.00, 15, '2024-03-10'),
    ('Nike Air Max',            2,  7490.00, 30, '2024-03-20'),
    ('Clean Code - R. Martin',  3,   890.00, 50, '2024-04-01'),
    ('PostgreSQL for Beginners',3,   650.00, 35, '2024-04-05'),
    ('Dumbbells 20kg',          4,  3200.00, 20, '2024-04-15'),
    ('Speed Jump Rope',         4,   450.00, 60, '2024-04-20');
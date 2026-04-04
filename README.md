# Тестовое задание на позицию Full-stack разработчик

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, AG Grid
- **Backend**: Express 5, PostgreSQL, Sequelize

## Установка и запуск

### Бэкенд

```bash
cd server
npm install
npm run dev
```

### Фронтенд

```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Products

- `GET /api/products` - список товаров
- `GET /api/products/:id` - товар по ID
- `POST /api/products` - создать товар
- `PUT /api/products/:id` - обновить товар
- `DELETE /api/products/:id` - удалить товар

### Categories

- `GET /api/categories` - список категорий
- `GET /api/categories/:id` - категория по ID
- `POST /api/categories` - создать категорию
- `PUT /api/categories/:id` - обновить категорию
- `DELETE /api/categories/:id` - удалить категорию

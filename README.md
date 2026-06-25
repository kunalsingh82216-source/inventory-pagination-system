# Inventory Pagination System

## Overview

Inventory Pagination System is a backend application built with Node.js, Express.js, PostgreSQL (Neon), and Prisma ORM. It allows users to browse a large dataset of 200,000+ products with fast cursor-based pagination and category filtering.

The system is designed to handle large datasets efficiently while avoiding duplicate or missing records during pagination.

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Neon)
* Prisma ORM
* REST API

---

## Features

* Browse 200,000+ products
* Cursor-based pagination
* Category filtering
* PostgreSQL database hosted on Neon
* Optimized database indexing
* Seed script for generating large datasets

---

## Database Schema

### Category

* id
* name

### Product

* id
* name
* description
* categoryId
* price
* createdAt
* updatedAt

---

## Pagination Strategy

This project uses **Cursor-Based Pagination** instead of OFFSET pagination.

### Ordering

```sql
ORDER BY createdAt DESC, id DESC
```

### Cursor Condition

```sql
WHERE (createdAt, id) < (cursorCreatedAt, cursorId)
```

### Why Cursor Pagination?

* Faster for large datasets
* Avoids expensive OFFSET scans
* Prevents duplicate records
* Prevents missing records while browsing
* Scales efficiently for hundreds of thousands of records

---

## Database Indexes

```sql
CREATE INDEX idx_products_created_at
ON products(created_at DESC);

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_products_cursor
ON products(created_at DESC, id DESC);
```

---

## API Endpoints

### Get Products

```http
GET /api/products
```

### Get Products with Limit

```http
GET /api/products?limit=20
```

### Filter by Category

```http
GET /api/products?category=Electronics
```

### Next Page Using Cursor

```http
GET /api/products?limit=20&cursorCreatedAt=<timestamp>&cursorId=<id>
```

---

## Local Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
```

### Run Database Migration

```bash
npx prisma migrate dev
```

### Seed Database

```bash
node prisma/seed.js
```

### Start Server

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

---

## Project Structure

```text
inventory-pagination-system/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── src/
│   ├── prisma.js
│   ├── server.js
│   └── routes/
│       └── products.js
├── package.json
├── .gitignore
└── README.md
```

---

## Future Improvements

* Redis caching
* Rate limiting
* Automated testing
* Docker support
* Full-text search
* Monitoring and logging

---

## AI Usage

AI tools were used to accelerate development, explore pagination approaches, and review implementation ideas. The final code was manually tested, debugged, and understood before submission.

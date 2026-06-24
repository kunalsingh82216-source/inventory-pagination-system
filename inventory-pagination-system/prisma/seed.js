const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Sports",
  "Home",
  "Beauty",
  "Toys",
  "Grocery"
];

async function main() {
  console.log("Creating categories...");

  const createdCategories = [];

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });

    createdCategories.push(category);
  }

  console.log("Creating 200000 products...");

  const batchSize = 5000;
  const totalProducts = 200000;

  for (let i = 0; i < totalProducts; i += batchSize) {
    const products = [];

    for (let j = 0; j < batchSize; j++) {
      const randomCategory =
        createdCategories[
          Math.floor(Math.random() * createdCategories.length)
        ];

      products.push({
        name: `Product ${i + j + 1}`,
        description: `Description ${i + j + 1}`,
        categoryId: randomCategory.id,
        price: (Math.random() * 1000).toFixed(2),
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        )
      });
    }

    await prisma.product.createMany({
      data: products
    });

    console.log(`Inserted ${i + batchSize}`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
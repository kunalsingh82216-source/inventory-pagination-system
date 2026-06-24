const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const category = req.query.category;

    const cursorCreatedAt = req.query.cursorCreatedAt;
    const cursorId = req.query.cursorId;

    const where = {};

    if (category) {
      where.category = {
        name: category
      };
    }

    if (cursorCreatedAt && cursorId) {
      where.OR = [
        {
          createdAt: {
            lt: new Date(cursorCreatedAt)
          }
        },
        {
          createdAt: new Date(cursorCreatedAt),
          id: {
            lt: BigInt(cursorId)
          }
        }
      ];
    }

    const products = await prisma.product.findMany({
      where,

      include: {
        category: true
      },

      orderBy: [
        {
          createdAt: "desc"
        },
        {
          id: "desc"
        }
      ],

      take: limit + 1
    });

    let nextCursor = null;

    if (products.length > limit) {
      const nextItem = products[limit - 1];

      nextCursor = {
        cursorCreatedAt: nextItem.createdAt,
        cursorId: nextItem.id.toString()
      };

      products.pop();
    }

   const formattedProducts = products.map(product => ({
  ...product,
  id: product.id.toString(),
  categoryId: product.categoryId.toString(),

  category: {
    ...product.category,
    id: product.category.id.toString()
  }
}));

res.json({
  count: formattedProducts.length,
  nextCursor,
  products: formattedProducts
});

  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    error: error.message
  });
}
});

module.exports = router;
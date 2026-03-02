import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL não configurado");
}
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("Nenhum usuário encontrado");

  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        title: "Regar tomates",
        type: "watering",
        dueAt: new Date(),
        completed: false,
      },
      {
        userId: user.id,
        title: "Adubar manjericão",
        type: "feeding",
        dueAt: new Date(),
        completed: false,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

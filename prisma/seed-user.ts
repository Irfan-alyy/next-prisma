import { PrismaClient } from "@/generated/prisma";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();



async function createUser(email: string) {
    const user = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: email, // you provide Yopmail
            image: faker.image.avatar(),
            emailVerified: new Date(), // ✅ mark as verified
        },
    });

    console.log("✅ Created verified user:", user);
}



async function main() {
    // 👇 replace this email with the Yopmail you provide each run
    const email=process.argv[2];
    if (!email) {
        console.error("❌ Please provide an email. Example:");
        console.error("   npm run seed:user test@yopmail.com");
        process.exit(1);
      }
    await createUser(email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
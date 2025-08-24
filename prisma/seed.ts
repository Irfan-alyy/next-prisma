import { PrismaClient } from "@/generated/prisma";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();


async function seedJobs() {
    const users = await prisma.user.findMany();
    if (!users) {
        console.log("No users found. Please seed a user first.");
        return;
    }
    console.log(users);
    const jobs = []
    users.map(async user => {
        for (let i = 0; i < 25; i++) {
            const data = {
                title: faker.person.jobTitle(),
                description: faker.lorem.lines(),
                salary: `$${faker.number.int({ min: 70000, max: 200000 })}`,
                company: faker.company.name(),
                location: faker.location.city(),
                contract: faker.helpers.arrayElement(["Full-Time", "Part-Time", "Contract"]),
                postedById: user.id
            }
            jobs.push(data)
        }
        console.log("Seeded 25 jobs for", user.name, user.id);
    })
    const result = await prisma.job.createMany({ data: jobs })
    console.log(result);
}

async function seedApplication() {
    const users = await prisma.user.findMany();
    if (!users) {
        console.log("No users found. Please seed a user first.");
        return;
    }
    const jobs = await prisma.job.findMany();
    if (!jobs) {
        console.log("No jobs found. Please seed a user first.");
        return;
    }

    jobs.map(job => {
        users.map(async user => {
            const data = {
                description: faker.lorem.paragraphs(),
                status: faker.helpers.arrayElement(["PENDING", "REVIEW", "ACCEPTED", "REJECTED"]),
                jobId: job.id,
                userId: user.id,
                resume: faker.internet.url(),
            }
            const result = await prisma.application.create({ data })
            // console.log(result);

        })
    })




}


async function createUser(email: string) {
    const user = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: email,
            image: faker.image.avatar(),
            emailVerified: new Date(), 
        },
    });

    console.log("Created verified user:", user);
}



async function main() {
    // const yopmail = "irfan@yopmail.com";
    // await createUser(yopmail);
    // await seedJobs();
    await seedApplication();
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
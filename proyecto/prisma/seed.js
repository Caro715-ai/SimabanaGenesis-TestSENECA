const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const defaultEmail = process.env.DEFAULT_USER_EMAIL;
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD; // Use a strong password, preferably from env vars

    // Check if default user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: defaultEmail },
    });

    if (existingUser) {
        console.log(`User ${defaultEmail} already exists. Skipping seeding.`);
    } else {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const user = await prisma.user.create({
            data: {
                email: defaultEmail,
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                emailVerified: true, // Seed the default user as verified
                // Add other default fields if necessary
            },
        });
        console.log(`Created default user with email: ${user.email}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 


    
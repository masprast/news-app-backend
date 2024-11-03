import { PrismaClient } from "@prisma/client";

interface SingletonGlobal extends Global {
	prisma: PrismaClient;
}

declare const global: SingletonGlobal;

const prisma = global.prisma || new PrismaClient();

global.prisma = prisma;

export default prisma;

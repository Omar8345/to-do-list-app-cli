import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
    const prisma = new PrismaClient();
    const { token } = req.body;
    if (!token) {
        res.status(400).json({
            message: 'Missing token'
        });
        return;
    }
    prisma.user.findUnique({
        where: {
            token: token
        }
    }).then(user => {
        if (user) {
            prisma.task.findMany({
                where: {
                    userToken: token
                }
            }).then(tasks => {
                res.json({
                    message: 'Tasks retrieved successfully',
                    tasks: tasks
                });
            });
        } else {
            res.status(400).json({
                message: 'No user found'
            });
        }
    }
    );
}
import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
    const prisma = new PrismaClient();
    const { token, taskTitle } = req.body;
    if (!token || !taskTitle) {
        res.status(400).json({
            message: 'Missing token or task title'
        });
        return;
    }
    prisma.user.findUnique({
        where: {
            token: token
        }
    }).then(user => {
        if (user) {
            prisma.task.create({
                data: {
                    title: taskTitle,
                    userToken: token
                }
            }).then(task => {
                res.json({
                    message: 'Task created successfully',
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
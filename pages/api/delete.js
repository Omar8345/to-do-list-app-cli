import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
    const prisma = new PrismaClient();
    const { token, taskId } = req.body;
    if (!token || !taskId) {
        res.status(400).json({
            message: 'Missing token or task id'
        });
        return;
    }
    prisma.user.findUnique({
        where: {
            token: token
        }
    }).then(user => {
        if (user) {
            prisma.task.findUnique({
                where: {
                    id: taskId
                }
            }).then(task => {
                if (task.userToken === token) {
                    prisma.task.delete({
                        where: {
                            id: taskId
                        }
                    }).then(task => {
                        res.json({
                            message: 'Task deleted successfully',
                        });
                    });
                } else {
                    res.status(400).json({
                        message: 'Task does not belong to the user'
                    });
                }
            }
            );
        } else {
            res.status(400).json({
                message: 'No user found'
            });
        }
    }
    );
}
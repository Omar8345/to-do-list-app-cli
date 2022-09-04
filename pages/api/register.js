import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
    const prisma = new PrismaClient();
    const { username, password, token } = req.body;
    if (!username || !password || !token) {
        res.status(400).json({
            message: 'Missing username, password or token'
        });
        return;
    }
    prisma.user.findUnique({
        where: {
            username: username
        }
    }).then(user => {
        if (user) {
            res.status(400).json({
                message: 'Username already taken'
            });
        } else {
            prisma.user.findUnique({
                where: {
                    token: token
                }
            }).then(user => {
                if (user) {
                    res.status(400).json({
                        message: 'Token already taken'
                    });
                } else {
                    prisma.user.create({
                        data: {
                            username: username,
                            password: password,
                            token: token
                        }
                    }).then(user => {
                        res.json({
                            message: "User created successfully",
                            user: user
                        });
                    });
                }
            }
            );
        }
    });

}
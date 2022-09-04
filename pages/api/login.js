import { PrismaClient } from '@prisma/client';

export default function handler(req, res) {
    const prisma = new PrismaClient();
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            message: 'Missing username or password'
        });
        return;
    }
    prisma.user.findUnique({
        where: {
            username: username
        }
    }).then(user => {
        if (user) {
            if (user.password === password) {
                res.json({
                    message: 'User authenticated successfully',
                    userToken: user.token,
                    user: username
                });
            } else {
                res.status(400).json({
                    message: 'Incorrect password'
                });
            }
        } else {
            res.status(400).json({
                message: 'No user found'
            });
        }
    }
    );

}
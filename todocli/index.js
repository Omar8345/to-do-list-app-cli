#!/usr/bin/env node

var args = process.argv.slice(2);
var fs = require('fs');
var request = require('request');
command = args[0];

if (command == 'login') {
    options = {
        url: 'https://to-do-list-app-cli.vercel.app/api/login',
        method: 'POST',
        json: {
            username: args[1],
            password: args[2]
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.message);
            fs.writeFile('token.txt', body.userToken, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Token saved successfully!");
            }
            );
        } else {
            console.log(body.message);
        }
    });
} else if (command == 'register') {
    options = {
        url: 'https://to-do-list-app-cli.vercel.app/api/register',
        method: 'POST',
        json: {
            username: args[1],
            password: args[2],
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.message);
            fs.writeFile('token.txt', body.user.token, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Token saved successfully!");
            }
            );
        } else if (body.message=="Token already taken") {
            console.log("Please try registering again!")
        } else {
            console.log(body.message);
        }
    });
} else if (command == 'create') {
    options = {
        url: 'https://to-do-list-app-cli.vercel.app/api/create',
        method: 'POST',
        json: {
            taskTitle: args.slice(1).join(' '),
            token: fs.readFileSync('token.txt', 'utf8')
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.message);
        } else {
            console.log(body.message);
        }
    });
} else if (command == 'view') {
    options = {
        url: 'https://to-do-list-app-cli.vercel.app/api/view',
        method: 'POST',
        json: {
            token: fs.readFileSync('token.txt', 'utf8')
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var tasks = [];
            for (var i = 0; i < body.tasks.length; i++) {
                tasks.push({
                    id: body.tasks[i].id,
                    title: body.tasks[i].title
                });
            }
            console.log("Your tasks are:");
            for (var i = 0; i < tasks.length; i++) {
                console.log(tasks[i].id + ": " + tasks[i].title);
            }

        } else {
            console.log(body.message);
        }
    });
} else if (command == 'delete') {
    options = {
        url: 'https://to-do-list-app-cli.vercel.app/api/delete',
        method: 'POST',
        json: {
            taskId: args[1],
            token: fs.readFileSync('token.txt', 'utf8')
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.message);
        } else {
            console.log(body.message);
        }
    });
} else if (command == 'help') {
    console.log("Usage: todocli <command> <arguments>");
    console.log("Commands:");
    console.log("login <username> <password>");
    console.log("register <username> <password>");
    console.log("create <task title>");
    console.log("view");
    console.log("delete <task id>");
    console.log("help");
}
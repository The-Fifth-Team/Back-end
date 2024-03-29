module.exports = {
    apps: [{
        name: 'theFifthAPI',
        script: './server.js',
        exec_mode: "cluster_mode",
        // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
        args: 'one two',
        instances: "4",
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
    deploy: {
        production: {
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
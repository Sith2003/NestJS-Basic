# TODO when to change to DEV env

Dockerfile: CMD [ "npm", "run", "dev" ]
=> Deploy: `docker-compose up -d --build`

# TODO when to change to PROD env

Dockerfile: CMD [ "npm", "start" ]
=> Deploy: `docker-compose up -d --build`

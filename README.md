<h1 align="center">
	Trauma Informed Yoga
</h1>

# Usage

Visit the site at {future link}.

# For development

## Local development setup

1. Install Node.js: [link](https://nodejs.org).
2. Install nodemon: `npm install nodemon -g`
3. Pull the repo and run `npm i` inside the new folder
4. Run `nodemon webserver.js` to start the development server
5. It will be running on `localhost:3000` by default

## Setup with docker

-   To start the local dev server run `docker-compose up --build`

-   To build the container for production run `docker build . -t yoga-app`
    -   (Not yet implemented) Note: if using HTTPS, `fullchain.pem` and `privkey.pem` must be supplied in the docker container, which can be done using volumes.

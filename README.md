# Ohys-Parse

## Requirements

- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/) or [Node.js](https://nodejs.org/) (Yarn)

## Getting Started

### Install Docker (Recommended)

To get started, You first need to install docker on the environment in which you will run this project.

Run the following command in your terminal:

```bash
curl -s https://get.docker.com | sudo sh
```

### Clone the project

Clone this repository to get all files needed to run, and move to the main folder.

```bash
git clone https://github.com/gokoro/Ohys-Parse.git
cd Ohys-Parse
```

### Run

**Run on Docker (Recommended)**

You can run this project on docker. If you choose this method, You won't have to install Node.js and other packages on your environment.

1. Run the following commands to build the image.

```bash
docker build -t ohys-parse .
```

2. Run the container by running the following command. You will need to replace the environment variables with what you actually use.

```bash
docker run \
	--name ohys-parse \
	-e DATABASE_URL=YOUR_MONGODB_URL \
	-e DATABASE_NAME=YOUR_MONGODB_NAME \
	-e TMDB_API_KEY=YOUR_TMDB_API_KEY \
	-e CURRENT_YEAR=2021 \
	-e CURRENT_SEASON=1 \
	-d ohys-parse
```

**Run on your machine**

If you have already configured your server, You can run this project without Docker.

1. Install dependencies by yarn.

```bash
yarn install --production
```

2. Save `.env.example` file as `.env` and fill it.

```bash
mv .env.example .env
nano .env
```

3. Run the program by running the following command.

```bash
yarn start
```

If you want to run this program as daemon, You can add [pm2](https://www.npmjs.com/package/pm2) package.

## License

This repository is licensed under the MIT License.

Third-party licenses can be found [here](https://github.com/gokoro/Ohys-Parse/blob/master/THIRD_PARTY_LICENSE).
install:
	npm install
pretty:
	npx prettier --write .
dev:
	nodemon src/app.js
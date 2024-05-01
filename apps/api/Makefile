build:
	npx turbo run build --filter=api

dev:
	npx turbo run dev --filter=api

install:
	npm install

start_prod:
	node dist/main

db_migrate_dev:
	prisma migrate dev

db_migrate_prod:
	prisma migrate deploy

db_studio:
	npx prisma studio

cdk_deploy:
	cdk deploy --all

cdk_build_deploy:
	make build && cdk deploy

test:
	jest

test_watch:
	jest --watch

test_cov:
	jest --coverage

test_e2e:
	jest --config ./test/jest-e2e.json

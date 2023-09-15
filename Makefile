# Makefile

# Phony targets ensure that Make doesn't look for files named like the target and always executes the commands.
.PHONY: fullstack react-dev fullstack-stop react-dev-stop backend backend-stop

# This target will start both frontend and backend services.
fullstack:
	docker compose up -d --build

# This target will stop both frontend and backend services.
fullstack-stop:
	docker compose down

# starts the backend container.
backend:
	docker compose up backend -d --build

# stops the back-end container
backend-stop:
	docker compose down

# Run the react live-reloading dev enviroment
react-dev:
	@cd frontend && docker compose up

# shut it down
react-dev-stop:
	@cd frontend && docker compose down
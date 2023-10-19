# openDSAVisualizer

## Setting up your enviroment:

1. Install Docker: https://docs.docker.com/engine/install/

## Running/Developing the enviroment
### Backend

1. To run: ``docker compose up backend -d --build``
2. To shutdown: ``docker compose down``

Navigate to http://localhost:8000

More information: [backend readme](backend/README.md)

### Frontend
#### For development (live-reloading):
1. ``cd frontend``
2. To run: ``docker compose up -d --build``
3. To shutdown: ``docker compose down``

Navigate to http://localhost:3000/

### Fullstack

1. To run: ``docker compose up -d --build``
2. To shutdown: ``docker compose down``

Navigate to http://localhost:80/ or http://localhost  

### misc commands
- List docker containers
``docker ps``
- Enter frontend docker:
``docker exec -it <docker name> sh``
- get ip of docker container:
``docker inspect \
-f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>``
- curl to test backend:
``curl -X GET "[insert ip from above command]:8000"``

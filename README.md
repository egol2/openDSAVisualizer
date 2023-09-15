# openDSAVisualizer

## Setting up your enviroment:

1. Install Docker: https://docs.docker.com/engine/install/
2. (optional for windows users) Install make utility: 
    1. Install the [chocolatey package manager](https://chocolatey.org/install) for Windows
    2. Run ``choco install make``

## Running/Developing the enviroment
### Backend

If you have ``make`` installed:
1. To run: ``make backend``
2. To shutdown: ```make backend-stop```

otherwise:
1. To run: ``docker-compose up backend -d --build``
2. To shutdown: ``docker compose down``

Navigate to http://localhost:8000

More information: [backend readme](backend/README.md)

### Frontend
#### For development (live-reloading):
If you have ``make`` installed:
1. To run: ``make react-dev``
2. To shutdown: ``make react-dev-stop``

otherwise:
1. ``cd frontend``
2. To run: ``docker compose up`` (add ``-d`` if you dont want it to output to console)
3. To shutdown: ``docker compose down``

Navigate to http://localhost:3000/

### Fullstack
If you have ``make`` installed:
1. To run: ``make fullstack``
2. to shutdown: ``make fullstack-stop``

otherwise:
1. To run: ``docker compose up -d --build``
2. To shutdown: ``docker compose down``

Navigate to http://localhost:80/ or http://localhost  
**Note:** firefox blocks the frontend of the fullstack due to nginx not having a valid certificate.

### If you use firefox

To allow dockers to communicate to each other:
1. type into the search bar -> about:config
2. in the search bar that pops up: security.fileuri.strict_origin_policy -> false

This is necessary as firefox does not allow self-signing certificates

### misc commands

- Enter frontend docker:
``docker exec -it frontend-1 sh``
- get ip of docker container:
``docker inspect \``
``-f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name_or_id``
- curl to test backend:
``curl -X GET "[insert ip from above command]:8000"``
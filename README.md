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
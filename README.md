# DevOps Code Generation Project

This project provides a frontend and backend for generating DevOps-related code or configurations.

## Getting Started

This guide will walk you through the steps to run the application locally using Docker Compose. This is the recommended way to set up the project as it ensures all dependencies are correctly handled in isolated containers.

### Prerequisites

Before you begin, you need to have the following installed on your system:

* **Docker:** [Install Docker](https://docs.docker.com/engine/install/)
* **Docker Compose:** [Install Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/elmimoha15/devops-code-gen.git
    cd devops-code-gen
    ```

2.  **Start the Application using Docker Compose:**

    Navigate to the root directory of the project and run the following command:

    ```bash
    docker-compose up -d --build
    ```

3.  **Access the Applications:**

    Once the containers are running, you can access the applications in your web browser:

    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend (API):** [http://localhost:8000](http://localhost:8000) 
### Stopping the Application

To stop the Docker containers when you are finished:

```bash
docker-compose down
# Virtual ID Application Backend

This document provides an overview of the backend setup and usage for the Virtual ID application.

## Overview

The Virtual ID application allows users to create accounts and securely store their physical IDs in a virtual format. The backend is built using Flask and SQLAlchemy, providing a RESTful API for the frontend to interact with.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd virtual-id-app/backend
   ```

2. **Create a Virtual Environment**
   It is recommended to use a virtual environment to manage dependencies.
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   Install the required Python packages listed in `requirements.txt`.
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   Start the Flask application.
   ```bash
   python app.py
   ```

## API Endpoints

- **POST /register**
  - Registers a new user account.
  
- **POST /scan-id**
  - Allows users to scan and upload their physical ID.

- **GET /ids**
  - Retrieves stored IDs for the authenticated user.

## Database Setup

Make sure to configure your database connection in `app.py` and run any necessary migrations to set up the database schema.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
# Virtual ID Application

This project is a mobile application designed to allow users to create accounts and securely store their physical IDs virtually. The application aims to provide a simple and user-friendly interface for managing identification documents, ensuring that users no longer have to worry about misplacing their IDs.

## Project Structure

The project is divided into two main parts: the backend and the frontend.

### Backend

The backend is built using Flask and SQLAlchemy. It handles user registration, ID scanning, and storage of ID information.

- **app.py**: Main entry point for the Flask application.
- **models.py**: Defines SQLAlchemy models, including the User model.
- **routes.py**: Contains route definitions for user registration and ID management.
- **requirements.txt**: Lists the Python dependencies required for the backend.
- **README.md**: Documentation specific to the backend.

### Frontend

The frontend is developed using React.js and Tailwind CSS. It provides a responsive and interactive user interface.

- **public/index.html**: Main HTML file for the React application.
- **src/App.jsx**: Root component that sets up routing and layout.
- **src/components/IDScanner.jsx**: Component for scanning physical IDs.
- **src/pages/Home.jsx**: Home page component for navigation and information.
- **src/pages/Account.jsx**: Component for managing user accounts.
- **src/styles/tailwind.css**: Tailwind CSS styles for the application.
- **package.json**: Configuration file for npm.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **README.md**: Documentation specific to the frontend.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install the required dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage

- Users can create an account and log in to the application.
- Users can scan their physical IDs using the ID scanner component.
- Stored IDs can be retrieved and managed through the account page.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.
# SecSock
SecSock is a lightweight, webhook inspection tool designed for security testing and education.

## Development setup
Clone the repository

```
git clone git@github.com:unswsecsoc/SecSock.git
```

Setup a virtual environment and install dependencies (for linux)

```
cd SecSock/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run the backend API

```
python main.py
```

Configure the frontend (in a new terminal window)
 - Ensure you have the latest version of node downloaded (https://nodejs.org/en/download)

```
cd ../frontend
npm install
npm run dev
```

The frontend is now running at http://localhost:5173

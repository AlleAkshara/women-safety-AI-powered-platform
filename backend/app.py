from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.cursor().execute("""
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT    NOT NULL,
            email    TEXT    NOT NULL UNIQUE,
            password TEXT    NOT NULL
        )
    """)
    conn.commit()
    conn.close()


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "SafeHer API is running"}), 200


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"message": "Name, email and password are required."}), 400
    name = data["name"].strip()
    email = data["email"].strip().lower()
    hashed = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
    try:
        conn = get_db()
        conn.cursor().execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed.decode("utf-8"))
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Account created successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "An account with this email already exists."}), 409
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password are required."}), 400
    email = data["email"].strip().lower()
    try:
        conn = get_db()
        user = conn.cursor().execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()
        if user and bcrypt.checkpw(data["password"].encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({
                "message": "Login successful!",
                "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
            }), 200
        return jsonify({"message": "Invalid email or password."}), 401
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


if __name__ == "__main__":
    init_db()
    print("SafeHer backend running on http://127.0.0.1:5000")
    app.run(debug=False)

from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.secret_key = "tgasecretkey"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data/tga_s3.db"
db = SQLAlchemy(app)

# --- MODELS ---
class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))
    name = db.Column(db.String(100))
    is_admin = db.Column(db.Boolean, default=False)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    house = db.Column(db.String(20))
    tutor_group = db.Column(db.String(10))
    attendance = db.Column(db.Float, default=100)
    merits = db.Column(db.Integer, default=0)
    demerits = db.Column(db.Integer, default=0)
    out_of_school = db.Column(db.Boolean, default=False)

@app.cli.command("init-db")
def init_db():
    os.makedirs("data", exist_ok=True)
    db.create_all()
    if not Teacher.query.filter_by(username="callan.chesser").first():
        t = Teacher(username="callan.chesser", password="callan.chesser", name="Callan Chesser", is_admin=True)
        db.session.add(t)
        db.session.commit()
        print("✅ Database initialised and admin user created.")
    else:
        print("⚠️ User already exists.")

# --- ROUTES ---
@app.route("/")
def index():
    if "user" not in session:
        return redirect(url_for("login"))
    teacher = Teacher.query.filter_by(username=session["user"]).first()
    students = Student.query.all()
    return render_template("dashboard.html", teacher=teacher, students=students)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form["username"]
        pw = request.form["password"]
        teacher = Teacher.query.filter_by(username=user, password=pw).first()
        if teacher:
            session["user"] = user
            flash("Welcome back, " + teacher.name, "success")
            return redirect(url_for("index"))
        else:
            flash("Invalid credentials", "danger")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

@app.route("/toggle-darkmode")
def toggle_darkmode():
    session["darkmode"] = not session.get("darkmode", False)
    return redirect(request.referrer or url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)

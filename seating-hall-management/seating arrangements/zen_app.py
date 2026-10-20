from flask import Flask, abort, render_template, request, redirect, url_for, send_from_directory
import sqlite3
from zen2 import run, write_to_excel
import os
from werkzeug.security import generate_password_hash
import random
import json
import re
from datetime import date

app = Flask(__name__)
app.secret_key = "your_secret_key"
APP_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(APP_DIR, "room_details.db")


# Database connection function
def get_db_connection():
    conn = sqlite3.connect(app.config.get("DATABASE_PATH", DATABASE_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def initialize_history_table():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS seating_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_no INTEGER NOT NULL,
            session TEXT NOT NULL,
            exam_date TEXT NOT NULL,
            shift TEXT NOT NULL,
            row_count INTEGER NOT NULL,
            column_count INTEGER NOT NULL,
            seat_count INTEGER NOT NULL,
            assignments_json TEXT NOT NULL,
            excel_filename TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


initialize_history_table()

# Route for home page
@app.route("/")
def home():
    return render_template("home.html")

# Route for about page
@app.route("/About")
def about():
    return render_template("about.html")

# Route for login page
@app.route("/login", methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form.get('email').strip()
        password = request.form.get('psw').strip()
        if email == "admin" and password == "admin":
            return redirect(url_for('admin'))
        elif email == "student" and password == "student":
            return redirect(url_for('student'))
        else:
            error = "INVALID DETAILS"
    return render_template("login.html", error=error)

# Route for register page
@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('psw', '')
        confirm_password = request.form['psw-repeat']
        if not email or not password or not confirm_password:
            error = "All fields are required"
        elif password != confirm_password:
            error = "password do not match"
        else:
            hashed_password = generate_password_hash(password)
            conn = get_db_connection()
            conn.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_password))
            conn.commit()
            conn.close()
            return redirect(url_for('login'))
    return render_template('register.html', error=error)

# Route for contact page
@app.route("/contact", methods=['GET','POST'])
def contact():
    message= None
    first_name=last_name=subject=""
    if request.method == 'POST':
        first_name=request.form.get('firstname').strip()
        last_name=request.form.get('lastname').strip()
        subject=request.form.get('subject').strip()
        
    if not first_name or not last_name or not subject:
         message="all fields are required !"  
    else:
          print(f"Message from {first_name} {last_name}: {subject}")
          message = "Thank you! Your message has been received."
    return render_template("contact.html",message=message)

# Route for admin page
@app.route("/admin")
def admin():
    conn = get_db_connection()
    data = conn.execute("SELECT * FROM room").fetchall()
    conn.close()
    return render_template("admin.html", data=data)

# Route for student page
@app.route("/student")
def student():
    conn = get_db_connection()
    data = conn.execute("SELECT * FROM room").fetchall()
    conn.close()
    return render_template("student.html", data=data)

# Route for add room page
@app.route("/addroom", methods=['GET', 'POST'])
def addroom():
    data = None
    error = None
    if request.method == 'POST':
        room_no = request.form['room_no']
        row = request.form['row']
        col = request.form['col']
        seat = request.form['seat']
        conn = get_db_connection()
        if int(seat) <= int(row) * int(col):
            existing_room = conn.execute("SELECT * FROM room WHERE room_no = ?", (room_no,)).fetchone()
            if existing_room is None:
                conn.execute("INSERT INTO room (room_no, col, row, seat) VALUES (?, ?, ?, ?)", (room_no, col, row, seat))
                conn.commit()
                error = room_no + " is added"
            else:
                error = room_no + " is already exist"
        else:
            error = "Invalid number of seat"
        conn.close()
    return render_template("addroom.html", error=error, data=data)

# Route for generate page
@app.route("/Generate", methods=['GET', 'POST'])
def generate():
    conn = get_db_connection()
    room_no = conn.execute("SELECT room_no, row, col, seat FROM room").fetchall()
    conn.close()

    if request.method == 'POST':
        form_data = request.form
        try:
            selected_room = int(form_data.get('room', ''))
            session = form_data.get('session', '')
            exam_date = date.fromisoformat(form_data.get('date', '')).isoformat()
            shift = form_data.get('shift', '')
            if session not in {"FN", "AN"} or shift not in {"I", "II"}:
                raise ValueError("Choose a valid session and shift.")

            department_codes = {
                "BCA": form_data.get('subject_code_bca', '').strip(),
                "BSc": form_data.get('subject_code_bsc', '').strip(),
                "BCom": form_data.get('subject_code_bcom', '').strip(),
                "BBA": form_data.get('subject_code_bba', '').strip(),
            }
            if any(not code for code in department_codes.values()):
                raise ValueError("Enter a subject code for each department.")

            missing_text = form_data.get('missing', '').strip()
            missing_parts = [part for part in re.split(r"[\s,]+", missing_text) if part]
            if any(not part.isdigit() for part in missing_parts):
                raise ValueError("Missing roll numbers must be separated by spaces or commas.")
            missing_rolls = {int(part) for part in missing_parts}

            ranges = {}
            for department, form_key in (
                ("BCA", "bca"), ("BSc", "bsc"), ("BCom", "bcom"), ("BBA", "bba")
            ):
                start_text = form_data.get(f'{form_key}_start', '').strip()
                end_text = form_data.get(f'{form_key}_end', '').strip()
                if not start_text and not end_text:
                    ranges[department] = None
                    continue
                if not start_text.isdigit() or not end_text.isdigit():
                    raise ValueError(f"Enter valid start and end roll numbers for {department}.")
                start_roll, end_roll = int(start_text), int(end_text)
                if start_roll <= 0 or end_roll < start_roll:
                    raise ValueError(f"Check the roll number range for {department}.")
                ranges[department] = (start_roll, end_roll)

            conn = get_db_connection()
            room = conn.execute(
                "SELECT row, col, seat FROM room WHERE room_no = ?", (selected_room,)
            ).fetchone()
            conn.close()
            if room is None:
                raise ValueError("The selected room was not found.")

            row_count, column_count, seat_count = map(int, room)
            if row_count <= 0 or column_count <= 0 or seat_count <= 0:
                raise ValueError("The selected room has invalid seating details.")
            capacity = min(seat_count, row_count * column_count)
            roster_count = sum(
                end_roll - start_roll + 1
                - sum(start_roll <= missing_roll <= end_roll for missing_roll in missing_rolls)
                for bounds in ranges.values() if bounds is not None
                for start_roll, end_roll in [bounds]
            )
            if roster_count == 0:
                raise ValueError("Enter at least one student roll number.")
            if roster_count > capacity:
                raise ValueError(
                    f"{roster_count} students exceed this room's capacity of {capacity}. "
                    "Choose a larger room or reduce the roll number ranges."
                )

            rosters = {}
            for department, bounds in ranges.items():
                if bounds is None:
                    rosters[department] = []
                    continue
                start_roll, end_roll = bounds
                rosters[department] = [
                    roll for roll in range(start_roll, end_roll + 1)
                    if roll not in missing_rolls
                ]
            all_students = [
                roll_number for roster in rosters.values() for roll_number in roster
            ]
            if len(all_students) != len(set(all_students)):
                raise ValueError("Roll number ranges overlap; each student must appear only once.")

            random.shuffle(all_students)
            active_departments = [department for department, roster in rosters.items() if roster]
            chunk_size = len(all_students) // len(active_departments)
            redistributed = {department: [] for department in rosters}
            for index, department in enumerate(active_departments):
                redistributed[department] = all_students[
                    index * chunk_size:(index + 1) * chunk_size
                ]
            for index, roll_number in enumerate(all_students[len(active_departments) * chunk_size:]):
                redistributed[active_departments[index % len(active_departments)]].append(roll_number)

            department_for_roll = {
                roll_number: department
                for department, roster in redistributed.items()
                for roll_number in roster
            }
            data = run(
                redistributed["BCom"], redistributed["BSc"],
                redistributed["BCA"], redistributed["BBA"],
                row_count, column_count,
                department_codes["BCA"], department_codes["BSc"],
                department_codes["BCom"], department_codes["BBA"]
            )
            assignments = [
                {
                    "roll_no": roll_number,
                    "department": department_for_roll[roll_number],
                    "subject_code": department_codes[department_for_roll[roll_number]],
                    "seat_no": index + 1,
                    "row": index // column_count + 1,
                    "column": index % column_count + 1,
                }
                for index, roll_number in enumerate(all_students)
            ]
            filename = write_to_excel(
                data, selected_room, session, exam_date, shift, assignments, seat_count
            )

            conn = get_db_connection()
            conn.execute(
                """
                INSERT INTO seating_history (
                    room_no, session, exam_date, shift, row_count, column_count,
                    seat_count, assignments_json, excel_filename
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    selected_room, session, exam_date, shift, row_count,
                    column_count, seat_count, json.dumps(assignments), filename
                )
            )
            conn.commit()
            conn.close()
            return send_from_directory(
                directory=os.path.join(APP_DIR, "static", "excel"),
                path=filename,
                as_attachment=True
            )
        except (ValueError, TypeError) as error:
            return render_template("generate.html", room_no=room_no, error=str(error)), 400

    return render_template("generate.html", room_no=room_no)

# Route for result page
@app.route('/result', methods=['GET', 'POST'])
def show_admin():
    conn = get_db_connection()
    arrangements = conn.execute(
        "SELECT id, room_no, session, exam_date, shift, created_at "
        "FROM seating_history ORDER BY exam_date DESC, id DESC"
    ).fetchall()
    conn.close()
    return render_template("show_result.html", arrangements=arrangements)

# Route for show page
@app.route('/show', methods=['GET', 'POST'])
def show_student():
    conn = get_db_connection()
    arrangements = conn.execute(
        "SELECT id, room_no, session, exam_date, shift "
        "FROM seating_history ORDER BY exam_date DESC, id DESC"
    ).fetchall()
    conn.close()
    return render_template("show_result2.html", arrangements=arrangements)


def get_arrangement_or_404(arrangement_id):
    conn = get_db_connection()
    arrangement = conn.execute(
        "SELECT * FROM seating_history WHERE id = ?", (arrangement_id,)
    ).fetchone()
    conn.close()
    if arrangement is None:
        abort(404)
    return arrangement


@app.route("/history")
def arrangement_history():
    conn = get_db_connection()
    arrangements = conn.execute(
        "SELECT id, room_no, session, exam_date, shift, created_at "
        "FROM seating_history ORDER BY exam_date DESC, id DESC"
    ).fetchall()
    conn.close()
    return render_template("history.html", arrangements=arrangements)


@app.route("/history/<int:arrangement_id>")
def arrangement_detail(arrangement_id):
    arrangement = get_arrangement_or_404(arrangement_id)
    assignments = json.loads(arrangement["assignments_json"])
    return render_template(
        "arrangement_detail.html", arrangement=arrangement, assignments=assignments
    )


@app.route("/history/<int:arrangement_id>/print")
def print_arrangement(arrangement_id):
    arrangement = get_arrangement_or_404(arrangement_id)
    assignments = json.loads(arrangement["assignments_json"])
    grid = [
        [None for _ in range(arrangement["column_count"])]
        for _ in range(arrangement["row_count"])
    ]
    for index in range(arrangement["seat_count"], arrangement["row_count"] * arrangement["column_count"]):
        grid[index // arrangement["column_count"]][index % arrangement["column_count"]] = {
            "unavailable": True
        }
    for assignment in assignments:
        grid[assignment["row"] - 1][assignment["column"] - 1] = assignment
    return render_template(
        "print_seating.html", arrangement=arrangement, grid=grid,
        assignments=assignments
    )


@app.route("/history/<int:arrangement_id>/download")
def download_arrangement(arrangement_id):
    arrangement = get_arrangement_or_404(arrangement_id)
    return send_from_directory(
        os.path.join(APP_DIR, "static", "excel"),
        arrangement["excel_filename"],
        as_attachment=True
    )


@app.route("/lookup", methods=["GET", "POST"])
def student_lookup():
    matches = []
    error = None
    roll_number = ""
    if request.method == "POST":
        roll_number = request.form.get("roll_no", "").strip()
        if not roll_number.isdigit():
            error = "Enter a valid numeric roll number."
        else:
            conn = get_db_connection()
            rows = conn.execute(
                "SELECT * FROM seating_history ORDER BY exam_date DESC, id DESC"
            ).fetchall()
            conn.close()
            for arrangement in rows:
                assignments = json.loads(arrangement["assignments_json"])
                assignment = next(
                    (item for item in assignments if str(item["roll_no"]) == roll_number),
                    None
                )
                if assignment:
                    matches.append({
                        "arrangement": arrangement,
                        "assignment": assignment,
                    })
            if not matches:
                error = "No seating assignment was found for that roll number."
    return render_template(
        "lookup.html", matches=matches, error=error, roll_number=roll_number
    )

# Route for delete page
@app.route('/delete/<int:id>', methods=['GET'])
def delete_room(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM room WHERE room_no = ?", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('admin'))

@app.route('/save/<id>', methods=['POST'])
def save_room(id):
    conn = get_db_connection()
    room_no=request.form.get('room_no')
    col = request.form.get('col')
    row = request.form.get('row')
    seat = request.form.get('seat')

    conn.execute(
        "UPDATE room SET col = ?, row = ?, seat = ? WHERE room_no = ?",
        (col, row, seat, room_no))
    conn.commit()
    conn.close()

    return redirect(url_for('admin')) 


# Route for edit page
@app.route('/edit/<id>', methods=['GET', 'POST'])
def edit_room(id):
    conn = get_db_connection()

    if request.method == 'POST':
        data = request.json
        room_no = data['room_no']
        row = data['row']
        col = data['col']
        seat = data['seat']

        conn.execute(
            "UPDATE room SET room_no = ?, col = ?, row = ?, seat = ? WHERE room_no = ?", 
            (room_no, col, row, seat, id)
        )
        conn.commit()
        conn.close()

        return redirect(url_for('admin'))
    

    data = conn.execute("SELECT * FROM room WHERE room_no = ?", (id,)).fetchone()
    conn.close()

    return render_template("edit_room.html", data=data)
if __name__ == "__main__":
    app.run(debug=True)

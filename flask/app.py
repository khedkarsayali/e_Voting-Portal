from flask import Flask,request, jsonify,render_template,request, session,redirect, url_for,make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash
from flask_migrate import Migrate
from flask_cors import CORS  # Import CORS
from flask_session import Session
import base64,requests,secrets
from werkzeug.utils import secure_filename
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle,Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from flask_mail import Mail, Message
import random
import string

from flask import request, jsonify, send_file
import os
import secrets

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
CORS(app, origins='http://localhost:3000')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/flaskprj'
""" app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False """
app.config['UPLOAD_FOLDER'] = 'flask/static'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg'}

db = SQLAlchemy(app)
migrate = Migrate(app, db)
app.secret_key = 'coder123'

# Configure session interface (Example using SQLAlchemy)
app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SESSION_SQLALCHEMY'] = db  # SQLAlchemy instance

# Configure email settings
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT='465',
    MAIL_USE_SSL=True,
    MAIL_USERNAME = "hackhustler58@gmail.com",
    MAIL_PASSWORD = "qeic vozg gtlb rhvw",
    MAIL_DEFAULT_SENDER = 'hackhustler58@gmail.com'
)


mail = Mail(app)
# Initialize Session
Session(app)
@app.route('/')
def my_index():
    return render_template("index.html", token="Hello Sayali")

class Users(db.Model):
    mis = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50))  # Corrected column type
    password = db.Column(db.String(100))
    voting_status = db.Column(db.Boolean, default=False)
    voted_for = db.Column(db.Integer, default=None)  # Adding votedFor column with default value None
    def __init__(self, email, password, mis=None, votingStatus='Not Voted', votedFor=None):
        self.email = email
        self.password = password
        self.mis = mis
        self.votingStatus = votingStatus
        self.votedFor = votedFor


class EligibleUsers(db.Model):
    mis = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50))  # Corrected column type
    def __init__(self, mis=None, email=None):  # Corrected order of arguments
        self.mis = mis
        self.email = email

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    votingStart = db.Column(db.Boolean, default=False)
    showResult = db.Column(db.Boolean, default=False)

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email


class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mis = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    branch = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(100), nullable=False)
    cgpa = db.Column(db.Float, nullable=False)
    linkedin_link = db.Column(db.String(200))
    mail_link = db.Column(db.String(200))
    twitter_link = db.Column(db.String(200))
    photo = db.Column(db.String(200))
    achievements = db.Column(db.Text)
    count = db.Column(db.Integer, default=0)

    def __init__(self, mis, name, branch, year, cgpa, linkedin_link=None, mail_link=None, twitter_link=None, photo=None, achievements=None):
        self.mis = mis
        self.name = name
        self.branch = branch
        self.year = year
        self.cgpa = cgpa
        self.linkedin_link = linkedin_link
        self.mail_link = mail_link
        self.twitter_link = twitter_link
        self.photo= photo
        self.achievements = achievements

class OTP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']



@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    admin = Admin.query.filter_by(username=username).first()
    if admin and admin.password == password and admin.email == email:
        session['admin_id'] = admin.id
        return jsonify({'message': 'Admin login successful'}), 200
    else:
        return jsonify({'error': 'Incorrect Credentials'}), 401




@app.route('/check_email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    # Check if email exists in the database
    existing_user = EligibleUsers.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 404
    

# Route for sending OTP
@app.route('/send_otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')

    # Generate OTP
    otp = ''.join(random.choices(string.ascii_letters + string.digits, k=6))

    # Send OTP via email
    send_otp_email(email, otp)

    return jsonify({'message': 'OTP sent successfully.'}), 200

# Function to send OTP via email
def send_otp_email(email, otp):
    msg = Message('Your OTP for Signup', recipients=[email])
    msg.body = f'Your OTP is: {otp}'
    mail.send(msg)

# Route for verifying OTP
@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    # Perform OTP verification here (compare with the stored OTP or any other method)

    
    return jsonify({'message': 'OTP verified successfully.'}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    mis = data.get('mis')
    email = data.get('email')
    password = data.get('password')
    print(mis,email)

    # Check if MIS exists and email matches the email in the database
    existing_user = EligibleUsers.query.filter_by(mis=mis, email=email).first()

    if not existing_user:
        # MIS or email does not exist, return error
        return jsonify({'message': 'MIS or email not found. Cannot register.'}), 400

    # Create a new user
    new_user = Users(email=email, password=password, mis=mis)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully.'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    mis = data.get('mis')
    email = data.get('email')
    password = data.get('password')

    # Check if MIS exists in EligibleUsers
    eligible_user = EligibleUsers.query.filter_by(mis=mis).first()
    if not eligible_user:
        return jsonify({'error': 'You are not eligible to vote'}), 401

    # Check if MIS exists in Users
    user = Users.query.filter_by(mis=mis).first()

    if user:
        # MIS exists in Users table
        if user.email == email and user.password == password:
            # Successful login
            session['mis'] = mis  # Store MIS in session
            return jsonify({'message': 'Login successful'})
        else:
            # Invalid email or password
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        # MIS not found in Users table
        return jsonify({'error': 'No account found. Signup first.'}), 401

@app.route('/add_candidate', methods=['POST'])
def add_candidate():
    data = request.form
    name = data['name']
    mis = data['mis']
    year = data['year']
    branch = data['branch']
    cgpa = data['cgpa']
    linkedin_link = data['link']
    mail_link = data['gmailLink']
    twitter_link = data['twitterLink']
    achievements = data['ach']

    # Get the file object from the request
    photo_file = request.files.get('photo')

    # Save the file with a unique name directly to the static folder
    if photo_file:
        photo_filename = secrets.token_hex(10) + ".jpg"  # Example: abcdef1234.jpg
        photo_file.save(os.path.join(app.static_folder, photo_filename))  # Save directly to app static folder
    else:
        # Handle case where no file is provided
        photo_filename = None

    candidate = Candidate(
        name=name,
        mis=mis,
        year=year,
        branch=branch,
        cgpa=cgpa,
        linkedin_link=linkedin_link,
        mail_link=mail_link,
        twitter_link=twitter_link,
        photo=photo_filename,
        achievements=achievements
    )

    # Add the candidate to the database
    db.session.add(candidate)
    db.session.commit()

    return jsonify({'message': 'Candidate added successfully'}), 201


with app.app_context():
    db.create_all()




@app.route('/get_winner')
def get_winner():
    winner = Candidate.query.order_by(Candidate.count.desc()).first()
    if winner:
        winner_data = {
            'id': winner.id,
            'name': winner.name,
            'count': winner.count,
            'branch':winner.branch,
            'photo':winner.photo
            # Add other fields as needed
        }
        return jsonify(winner_data), 200
    else:
        return jsonify({'message': 'No winner found'}), 404


@app.route('/admin/get_result_status', methods=['GET'])
def get_result_status():
    try:
        # Fetch the admin record from the database
        admin = Admin.query.first()
        if admin:
            print(admin.showResult)
            return jsonify({'showResult': admin.showResult}), 200
        else:
            return jsonify({'error': 'Admin record not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Endpoint to get election statistics
@app.route('/get_election_statistics')
def get_election_statistics():
    candidates = Candidate.query.all()
    statistics = []
    for candidate in candidates:
        candidate_data = {
            'id': candidate.id,
            'mis': candidate.mis,
            'name': candidate.name,
            'count': candidate.count,
            # Add other fields as needed
        }
        statistics.append(candidate_data)
    return jsonify(statistics), 200


@app.route('/api/add_voter', methods=['POST'])
def add_voter():
    data = request.json
    mis = data.get('mis')
    email = data.get('email')  # Get email from request data

    existing_voter = EligibleUsers.query.filter_by(mis=mis).first()
    if existing_voter:
        return jsonify({'error': 'Voter with the same MIS already exists'}), 400

    new_voter = EligibleUsers(mis=mis, email=email)  # Pass email to the constructor
    db.session.add(new_voter)
    db.session.commit()

    return jsonify({'message': 'Voter added successfully'})

@app.route('/api/voters', methods=['GET'])
def get_voters():
    voters = EligibleUsers.query.all()
    voters_list = [{'mis': voter.mis} for voter in voters]
    return jsonify(voters_list)


@app.route('/api/delete_voter', methods=['POST'])
def delete_voter():
    data = request.json
    mis = data.get('mis')

    # Delete from EligibleUsers table
    voter_to_delete_eligible = EligibleUsers.query.filter_by(mis=mis).first()
    if voter_to_delete_eligible:
        db.session.delete(voter_to_delete_eligible)
    else:
        return jsonify({'error': 'Voter not found in eligible users'}), 404

    # Delete from Users table
    voter_to_delete_users = Users.query.filter_by(mis=mis).first()
    if voter_to_delete_users:
        db.session.delete(voter_to_delete_users)

    # Commit the transaction after attempting deletion from both tables
    db.session.commit()
    return jsonify({'message': 'Voter deleted successfully'})



@app.route('/get_user_mis', methods=['GET'])
def get_user_mis():
    user_mis = session.get('mis')
    if user_mis:
        return jsonify({'mis': user_mis}), 200
    else:
        return jsonify({'error': 'User MIS not found'}), 404


@app.route('/vote', methods=['POST'])
def vote():
    data = request.json
    candidate_id = data.get('candidate_id')
    user_mis = data.get('user_mis')

    # Check if voting is enabled
    admin = Admin.query.first()
    if not admin or not admin.votingStart:
        return jsonify({'message': 'Voting is currently disabled. Please try again later.'}), 403

    # Check if the user has already voted
    user = Users.query.filter_by(mis=user_mis).first()
    if user and user.voting_status:
        return jsonify({'message': 'You have already voted.'}), 400

    # Perform the voting action and update the database
    candidate = Candidate.query.get(candidate_id)
    if candidate:
        candidate.count += 1
        user.voting_status = True
        db.session.commit()
        return jsonify({'message': 'Vote cast successfully.'}), 200
    else:
        return jsonify({'error': 'Candidate not found.'}), 404

# Route to delete candidate
@app.route('/delete_candidate/<int:candidate_id>', methods=['DELETE'])
def delete_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)
    if not candidate:
        return jsonify({'error': 'Candidate not found'}), 404

    db.session.delete(candidate)
    db.session.commit()
    return jsonify({'message': 'Candidate deleted successfully'}), 200


def serialize(candidate):
    return {
        'id': candidate.id,
        'mis': candidate.mis,
        'name': candidate.name,
        'branch': candidate.branch,
        'year': candidate.year,
        'cgpa': candidate.cgpa,
        'linkedin_link': candidate.linkedin_link,
        'mail_link': candidate.mail_link,
        'twitter_link': candidate.twitter_link,
        'photo': candidate.photo, 
        'achievements': candidate.achievements.split(',') if candidate.achievements else []
    }


@app.route('/api/candidates')
def get_candidates():
    candidates = Candidate.query.all()
    candidate_list = [serialize(candidate) for candidate in candidates]
    return jsonify(candidate_list) 

# Route for user registration

@app.route('/api/edit_candidate/<int:candidate_id>', methods=['PUT'])
def edit_candidate(candidate_id):
    candidate = Candidate.query.get_or_404(candidate_id)
    
    # Update candidate data with the data from the request
    data = request.json
    candidate.name = data['name']
    candidate.mis = data['mis']
    candidate.year = data['year']
    candidate.branch = data['branch']
    candidate.cgpa = data['cgpa']
    candidate.linkedin_link = data['link']
    candidate.mail_link = data['gmailLink']
    candidate.twitter_link = data['twitterLink']
    candidate.achievements = data['ach']
    
    # Save the changes to the database
    db.session.commit()

    return jsonify({'message': 'Candidate updated successfully'}), 200


# other imports...

from flask import send_file
from io import BytesIO
import matplotlib.pyplot as plt


from flask import jsonify, request

# Route to enable voting
@app.route('/admin/enable_voting', methods=['POST'])
def enable_voting():
    try:
        # Update votingStart to True in the admin table
        admin = Admin.query.first()  # Assuming you have a table named Admin
        admin.votingStart = True
        db.session.commit()
        return jsonify({'message': 'Voting enabled'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to disable voting
@app.route('/admin/disable_voting', methods=['POST'])
def disable_voting():
    try:
        # Update votingStart to False in the admin table
        admin = Admin.query.first()  # Assuming you have a table named Admin
        admin.votingStart = False
        db.session.commit()
        return jsonify({'message': 'Voting disabled'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to enable showing results
@app.route('/admin/enable_results', methods=['POST'])
def enable_results():
    try:
        # Update showResult to True in the admin table
        admin = Admin.query.first()  # Assuming you have a table named Admin
        admin.showResult = True
        db.session.commit()
        return jsonify({'message': 'Result display enabled'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to disable showing results
@app.route('/admin/disable_results', methods=['POST'])
def disable_results():
    try:
        # Update showResult to False in the admin table
        admin = Admin.query.first()  # Assuming you have a table named Admin
        admin.showResult = False
        db.session.commit()
        return jsonify({'message': 'Result display disabled'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/admin/get_voting_status', methods=['GET'])
def get_voting_status():
    try:
        # Fetch the admin record from the database
        admin = Admin.query.first()
        if admin:
            return jsonify({'votingEnabled': admin.votingStart}), 200
        else:
            return jsonify({'error': 'Admin record not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/get_total_candidates')
def get_total_candidates():
    total_candidates = Candidate.query.count()
    return jsonify({"totalCandidates": total_candidates})

@app.route('/get_total_users_voted')
def get_total_users_voted():
    total_users_voted = Users.query.filter_by(voting_status=True).count()
    return jsonify({"totalUsersVoted": total_users_voted})

@app.route('/get_total_users')
def get_total_users():
    total_users = EligibleUsers.query.count()
    return jsonify({"totalUsers": total_users})

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg'}


import matplotlib.pyplot as plt


import os
import os
from flask import send_file

@app.route('/get_vote_count_pie_chart')
def get_vote_count_pie_chart():
    candidates = Candidate.query.all()
    labels = [candidate.name for candidate in candidates]
    counts = [candidate.count for candidate in candidates]

    # Generate pie chart
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.pie(counts, labels=labels, autopct='%1.1f%%', startangle=140)
    ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
    ax.set_title('Vote Count for Each Candidate')

    # Save the pie chart as an image
    chart_image_path = os.path.join(app.static_folder, 'pie_chart.png')
    fig.savefig(chart_image_path)

    # Return the path to the saved image
    return send_file(chart_image_path, mimetype='image/png')   



from io import BytesIO

def generate_pdf():
    # Fetch data from the database
    total_users = Users.query.count()
    total_voted_users = Users.query.filter_by(voting_status=True).count()
    candidates = Candidate.query.all()

    # Prepare data for the PDF
    data = [
        ['Total Users', total_users],
        ['Total Voted Users', total_voted_users],
        ['Candidate ID', 'Name', 'Branch', 'Year', 'CGPA', 'Votes']
    ]
    for candidate in candidates:
        data.append([candidate.id, candidate.name, candidate.branch, candidate.year, candidate.cgpa, candidate.count])

    # Create BytesIO object to write PDF content to
    pdf_buffer = BytesIO()

    # Create PDF
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
    table = Table(data)
# Add "Total Users" and "Total Users Voted" as separate elements
    styles = getSampleStyleSheet()
    elements = []
    elements.append(Paragraph('COEP VOTING REPORT', styles['Heading1']))

    elements.append(Paragraph(f'Total Users: {total_users}', styles['Heading3']))
    elements.append(Paragraph(f'Total Users Voted: {total_voted_users}', styles['Heading3']))
    elements.append(Paragraph('\n', styles['Normal']))  # Add empty line
    

    # Add table to the PDF document
    doc.build([table])

    # Style the table
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])
    table.setStyle(style)

    # Move the cursor to the beginning of the BytesIO object
    pdf_buffer.seek(0)

    # Create response with PDF content
    response = make_response(pdf_buffer.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=report.pdf'
    response.headers['Content-Type'] = 'application/pdf'

    return response



@app.route('/generate_pdf', methods=['GET'])
def download_pdf():
    pdf = generate_pdf()
    return pdf



if __name__ == '__main__':
    app.run(debug=True)
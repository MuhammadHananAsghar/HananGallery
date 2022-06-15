import os
import random
from flask import Flask
from flask import render_template
from flask import redirect
from flask import url_for
from flask import request
from flask import session
from firebase_auth import FIREBASE
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRETKEY")
firebase_ = FIREBASE()


@app.errorhandler(404)
def page_not_found(e):
    print(e)
    return render_template('404.html'), 404


@app.route("/")
def login():
    if session.get("loggedIn") is None:
        return render_template("login.html")
    else:
        if session['loggedIn']:
            return redirect(url_for('main'))
    return render_template("login.html")


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/logout")
def logout():
    session['loggedIn'] = False
    return redirect(url_for("login"))


@app.route("/reset")
def reset():
    return render_template("reset.html")


@app.route("/resetNotification")
def resetNotification():
    return render_template("resetpass.html")


@app.route("/profile")
def profile():
    profile = firebase_.getProfile(session["email"])
    if not profile:
        data = {"image": None, "name": None}
    else:
        data = profile
    return render_template("profile.html", data=data)


@app.route("/main")
def main():
    if session.get("loggedIn") is None:
        return redirect(url_for('login'))
    else:
        if session['loggedIn']:
            condition = firebase_.profileIsPresent(session['email'])
            if condition:
                profile = firebase_.getProfile(session["email"])
                images_retrieved = firebase_.retrieveImages()
                return render_template("main.html", image=profile['image'], images=images_retrieved)
            else:
                return redirect(url_for('profile'))
    return redirect(url_for('login'))


@app.route("/postlogin", methods=['GET', 'POST'])
def postlogin():
    email = request.form.get('email')
    password = request.form.get('password')
    checkbox = request.form.get('checkbox')
    if checkbox == "true":
        session.permanent = True
    else:
        session.permanent = False
    msg, condition = firebase_.login(email=email, password=password)
    if condition:
        message = "true"
        session['loggedIn'] = True
        session['email'] = email
    else:
        message = msg.capitalize().replace("_", " ") + "."
        session['loggedIn'] = False
    return message


@app.route("/postRegister", methods=['GET', 'POST'])
def postRegister():
    email = request.form.get('email')
    password = request.form.get('password')
    msg, condition = firebase_.authentication(email=email, password=password)
    if condition:
        message = "true"
    else:
        message = msg.capitalize().replace("_", " ") + "."
    return message


@app.route("/resetPass", methods=["GET", "POST"])
def resetPass():
    email = request.form.get('email')
    msg, condition = firebase_.resetPassword(email=email)
    if condition:
        message = "true"
    else:
        message = msg.capitalize().replace("_", " ") + "."
    return message


@app.route("/postProfile", methods=["POST", "GET"])
def postProfile():
    try:
        image = "https://avatars.dicebear.com/v2/male/:" + str(random.randint(0, 999999)) + ".svg"
        name = request.form.get("name")
        firebase_.addProfile(session["email"], name, image)
        message = "true"
    except:
        message = "false"
    return message


@app.route("/postImage", methods=["POST", "GET"])
def postImage():
    image = request.form.get("image")
    condition = firebase_.postNewImage(session['email'], image)
    if condition:
        message = "true"
    else:
        message = "false"
    return message


if __name__ == "__main__":
    app.run(debug=True)

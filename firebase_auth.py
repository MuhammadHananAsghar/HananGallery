import os
import json
import pyrebase
from datetime import date
from dotenv import load_dotenv

load_dotenv()


class FIREBASE:
    def __init__(self):
        self.__firebaseConfig = {
            "apiKey": os.getenv("FIREBASE_APIKEY"),
            "authDomain": os.getenv("FIREBASE_AUTHDOMAIN"),
            "projectId": os.getenv("FIREBASE_PROJECTID"),
            "storageBucket": os.getenv("FIREBASE_STORAGEBUCKET"),
            "messagingSenderId": os.getenv("FIREBASE_MESSAGESENDERID"),
            "appId": os.getenv("FIREBASE_APPID"),
            "databaseURL": os.getenv("FIREBASE_DATABASEURL")
        }
        self.__firebase = self.__initialize()

    def __initialize(self):
        return pyrebase.initialize_app(self.__firebaseConfig)

    def __addKey(self, email):
        db = self.__firebase.database()
        emailID = email.split("@")[0]
        data = {"id": f"{emailID}"}
        db.child(f"{emailID}").set(data)
        return

    def authentication(self, email, password):
        try:
            auth = self.__firebase.auth()
            user = auth.create_user_with_email_and_password(email=str(email), password=str(password))
            self.__addKey(email=email)
            auth.send_email_verification(user['idToken'])
            return user, True
        except Exception as e:
            print(e)
            error = json.loads(str(e)[str(e).find("{"):])
            error_message = error['error']['message']
            return error_message, False

    def __isVerified(self, auth, idToken):
        user_information = auth.get_account_info(idToken)
        check_user = user_information['users'][0]['emailVerified']
        if check_user:
            return True
        else:
            return False

    def login(self, email, password):
        try:
            auth = self.__firebase.auth()
            check = auth.sign_in_with_email_and_password(email, password)
            if not self.__isVerified(auth, check['idToken']):
                error_message = "Email is not verified."
                return error_message, False
            return check, True
        except Exception as e:
            error = json.loads(str(e)[str(e).find("{"):])
            error_message = error['error']['message']
            return error_message, False

    def resetPassword(self, email):
        try:
            auth = self.__firebase.auth()
            check = auth.send_password_reset_email(email=email)
            return check, True
        except Exception as e:
            error = json.loads(str(e)[str(e).find("{"):])
            error_message = error['error']['message']
            return error_message, False

    def profileIsPresent(self, email):
        db = self.__firebase.database()
        emailID = email.split("@")[0]
        userProfile = db.child(emailID).get()
        try:
            profile = userProfile.val()['profile']
            return True
        except Exception as e:
            return False

    def addProfile(self, email, name, image):
        db = self.__firebase.database()
        emailID = email.split("@")[0]
        data = {"image": image, "name": name}
        db.child(emailID).child("profile").set(data)
        return

    def getProfile(self, email):
        try:
            db = self.__firebase.database()
            emailID = email.split("@")[0]
            profile = db.child(emailID).get()
            profile = profile.val()['profile']
            return profile
        except Exception as e:
            return False

    def __imageIsPresent(self, email):
        db = self.__firebase.database()
        emailID = email.split("@")[0]
        userProfile = db.child(emailID).get()
        try:
            image = userProfile.val()['image']
            return True
        except Exception as e:
            return False

    def postNewImage(self, email, image):
        try:
            db = self.__firebase.database()
            emailID = email.split("@")[0]
            dateCurrent = str(date.today())
            image = image
            data = {"date": dateCurrent, "image": image}
            db.child(emailID).child("image").push(data)
            return True
        except Exception as e:
            print(e)
            return False

    def retrieveImages(self):
        try:
            db = self.__firebase.database()
            database = db.get()
            dataset = []
            for data in database.each():
                name = data.val()["profile"]["name"].capitalize()
                pimage = data.val()["profile"]["image"]
                try:
                    for _, image_data in data.val()['image'].items():
                        udate = image_data["date"]
                        uimage = image_data["image"]
                        dataset.append({
                            "name": name,
                            "pimage": pimage,
                            "udate": udate,
                            "uimage": uimage
                        })
                except:
                    print("Images not present for this.")
            return dataset
        except Exception as e:
            print(e)
            return False



firebase_ = FIREBASE()
# firebase_.authentication("muhammadhananasghar@gmail.com", "muhammadhananasghar@gmail.com")
# firebase_.isVerified("muhammadhananasghar@gmail.com", "34563445756")
# firebase_.login("muhammadhananasghar@gmail.com", "124@gmail.com")
# firebase_.resetPassword("muhammadhananasgharrr@gmail.com")
# firebase_.getProfile("muhammadhananasghar@gmail.com")
# firebase_.retrieveImages()

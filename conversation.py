import webapp2
import json
from google.appengine.ext import ndb

class User(ndb.Model):
    """Models an individual Guestbook entry with content and date."""
    username = ndb.StringProperty(required=True)
    password = ndb.StringProperty(required=True)
    conversations = ndb.StringProperty(repeated=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    interests = ndb.StringProperty(repeated=True)

class Message(ndb.Model):
    user1 = ndb.StringProperty()
    user2 = ndb.StringProperty()
    time = ndb.DateTimeProperty()
    message = ndb.StringProperty()

class Conversation(ndb.Model):
    conversationID = ndb.StringProperty()
    messages = ndb.StructuredProperty(Message,repeated=True)


#def get_user(user):




def create_user(username, password):
    user = User(username=username, password=password)
    user.put()



class Register(webapp2.RequestHandler):
    def get(self):
        #username = self.request.get("user")
        #password = self.request.get("pass")
        user = User(username="matt", password="lee",conversations=["conv1","conv2"])
        user.put()

    def post(self):
        username = self.request.get("user")
        password = self.request.get("pass")

        user = User.query(User.username == username).fetch()

        if user:
            self.response.write("User Already Exists")
        else:
            user = User(username=username, password=password)
            user.put()


class ConvoHandler(webapp2.RequestHandler): #returns user data
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'

        username = self.request.get("user")
        password = self.request.get("pass")
        user = User.query(User.username == username).fetch()

        if user:
            self.response.write(str(user))

        else: #if user is not found
            return



app = webapp2.WSGIApplication([
    ('/conversation', ConvoHandler),
    ('/register', Register)
], debug=True)

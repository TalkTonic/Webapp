import webapp2
import json
from google.appengine.ext import ndb

class Message(ndb.Model):
    user1 = ndb.StringProperty()
    user2 = ndb.StringProperty()
    time = ndb.DateTimeProperty()
    message = ndb.StringProperty()

class Conversation(ndb.Model):
    messages = ndb.StructuredProperty(Message,repeated=True)
    user1 = ndb.StringProperty()
    user2 = ndb.StringProperty()
    nummessages = ndb.IntegerProperty()


class User(ndb.Model):
    """Models an individual Guestbook entry with content and date."""
    username = ndb.StringProperty(required=True)
    password = ndb.StringProperty(required=True)
    conversations = ndb.KeyProperty(repeated=True, kind=Conversation)
    date = ndb.DateTimeProperty(auto_now_add=True)
    interests = ndb.StringProperty(repeated=True)


#def get_user(user):




def create_user(username, password):
    user = User(username=username, password=password)
    user.put()



class Register(webapp2.RequestHandler):
    def post(self):
        username = self.request.get("user")
        password = self.request.get("pass")

        user = User.query(User.username == username).fetch()

        if user:
            self.response.status = 400
        else:
            user = User(username=username, password=password)
            user.put()
            self.response.status = 202


class ConvoHandler(webapp2.RequestHandler): #returns user data
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'

        username = self.request.get("user")
        password = self.request.get("pass")
        user = User.query(User.username == username).fetch()

        if user: 
            convodict = {}
            convodict['conversations'] = []

            conversations = user.conversations

            for convo in conversations:

                convo_object = convo.get() #get the conversation object from the key
                urlkey = convo.urlsafe() #get the urlsafe key for later reconstruction

                if convo_object.user1 == user.username:
                    otherperson = convo.user2
                else:
                    otherperson = convo.user1


                convoid = {"person": otherperson, "conversation": urlkey}
                convodict['conversations'].append(convoid)


            self.response.write(json.dumps(convodict))
            self.response.status = 202

        else: #if user is not found
            self.response.status = 403

class ConvoCreate(webapp2.RequestHandler):
    def post(self):
        


app = webapp2.WSGIApplication([
    ('/conversation', ConvoHandler),
    ('/register', Register),
    ('/create', ConvoCreate)
], debug=True)

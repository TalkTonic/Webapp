import webapp2
import json
from google.appengine.ext import ndb

class User(ndb.Model):
    """Models an individual Guestbook entry with content and date."""
    username = ndb.StringProperty()
    password = ndb.StringProperty()
    conversations = ndb.StringProperty(repeated=True)
    date = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def query_book(cls, ancestor_key):
        return cls.query(ancestor=ancestor_key).order(-cls.date)

class Message(ndb.Model):
    user1 = ndb.StringProperty()
    user2 = ndb.StringProperty()
    time = ndb.DateTimeProperty()
    message = ndb.StringProperty()

class Conversation(ndb.Model):
    conversationID = ndb.StringProperty
    messages = ndb.StructuredProperty(Message,repeated=True)


#def get_user(user):




def create_user(username, password):
    user = User(username=username, password=password)
    user.put()



#class Register(webapp2.requestHandler):
#   def post(self):





class ConvoHandler(webapp2.RequestHandler): #returns user data
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'

        self.response.write(self.request.get("Matt"))

app = webapp2.WSGIApplication([
    ('/conversation', ConvoHandler)
], debug=True)

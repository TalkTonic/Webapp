import webapp2
import json
from google.appengine.ext import ndb

class Message(ndb.Model):
    sender = ndb.StringProperty()
    receiver = ndb.StringProperty()
    time = ndb.DateTimeProperty(auto_now_add=True)
    message = ndb.StringProperty()

class Conversation(ndb.Model):
    messages = ndb.StructuredProperty(Message,repeated=True)
    user1 = ndb.StringProperty()
    user2 = ndb.StringProperty()
    num_messages = ndb.IntegerProperty()


class User(ndb.Model):
    """Models an individual Guestbook entry with content and date."""
    username = ndb.StringProperty(required=True)
    password = ndb.StringProperty(required=True)
    conversations = ndb.StringProperty(repeated=True)
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


class ConvoHandler(webapp2.RequestHandler): #returns user data upon login
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'

        username = self.request.get("user")
        password = self.request.get("pass")
        user = User.query(User.username == username).fetch()




        if user:
            user = user[0]
            if(password != user.password):
                self.response.write("wrong password")
                return

            convodict = {}
            convodict['conversations'] = []

            conversations = user.conversations

            for convo in conversations:
                convo_key = ndb.Key(urlsafe=convo)
                convo_object = convo_key.get()

                if convo_object.user1 == user.username:
                    otherperson = convo_object.user2
                else:
                    otherperson = convo_object.user1


                convoid = {"person": otherperson, "conversation": convo}
                convodict['conversations'].append(convoid)


            self.response.write(json.dumps(convodict))
            self.response.status = 202

        else: #if user is not found
            self.response.status = 403



# class openConversation(webapp2.RequestHandler):
#     convos = Conversation.query().fetch()
#     convodict = {}
#     count = 9999

#     for convo in convos:
#         convodict[count] = []

#         for message in convo.messages:
#             mess = {"sender": message.sender, "message": message.message}

#             convodict[count].append(mess)

#         count = count + 1

#     self.response.out.write(json.dumps(convodict))

class dummyData(webapp2.RequestHandler):
    def get(self):

        newconvo = Conversation(user1="matt",user2="swag", num_messages=0)
        user1 = User.query(User.username == "matt").fetch()[0]
        user2 = User.query(User.username == "swag").fetch()[0]

        for i in range(0, 150):
            if(i % 2 == 0):
                message = Message(sender="matt", receiver="swag", message=str(i))
                newconvo.messages.append(message)

            else:
                message = Message(sender="swag", receiver="matt", message=str(i))
                newconvo.messages.append(message)

        idkey = newconvo.put()
        idkey = idkey.urlsafe()

        put1 = False
        put2 = False

        if(user1.conversations!=None):
            user1.conversations.append(idkey)
            put1= True

        if(user2.conversations!=None):
            user2.conversations.append(idkey)
            put2=True

        if not put1:
            user1.conversations = [idkey]

        if not put2:
            user2.conversations = [idkey]

        user1.put()
        user2.put()

     


class ConvoCreate(webapp2.RequestHandler):
    def post(self):
        user1 = self.request.get("user")
        user2= "testconverser" #change this

        newconvo = Conversation(user1=user1, user2=user2, num_messages=0)

        user1 = User.query(User.username == user1).fetch()
        user2 = User.query(User.username == user2).fetch()

        user1.conversations.append(newconvo.key) #now add the conversation to the 
        user2.conversations.append(newconvo.key) #conversation list


class API(webapp2.RequestHandler):
    def get(self):
        convos = Conversation.query().fetch()
        convodict = {}
        count = 9999

        for convo in convos:
            convodict[count] = []

            for message in convo.messages:
                mess = {"sender": message.sender, "message": message.message}

                convodict[count].append(mess)

            count = count + 1

        self.response.out.write(json.dumps(convodict))
        self.response.status = 202



app = webapp2.WSGIApplication([
    ('/conversation', ConvoHandler),
    ('/register', Register),
    ('/create', ConvoCreate),
    ('/data', dummyData),
    ('/api', API)
], debug=True)

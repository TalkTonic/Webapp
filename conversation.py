import webapp2
import json

class conversation(webapp2.RequestHandler):
	def post(self):
		self.response.headers['Content-Type'] = 'application/json'
		print self.request.params
		self.response.write(self.request.params)

app = webapp2.WSGIApplication([
	('/conversation', conversation)
], debug=True)

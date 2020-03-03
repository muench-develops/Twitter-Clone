from flask import Flask,request,jsonify
from flask_cors import CORS, cross_origin
import logging, json, datetime
import pymongo

#Object to hold Tweetie
class Tweetie:
    def __init__(self, message, user, date):
        self.message = message
        self.user = user
        self.date = date
        
app = Flask(__name__)

#Connection to database
client = pymongo.MongoClient("...")
db = client["database"]
col = db["messages"]

#Api: Write Database Tweetie
@app.route('/api/tweetie/', methods=['POST'])
@cross_origin(origin='*', headers='Content-Type')
def write_one_tweetie():
    logging.info('API Aufruf')
    if request.is_json:
        message = request.json["message"]
        if not message or len(message)>= 281:
            return jsonify(message='failure', code=422)
        now = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        toAdd = {'message': message, 'date':now}
        col.insert_one(toAdd)
        return jsonify(message='success')       
    else:
        return jsonify(message='failure', code=422)

#Get Tweeties
@app.route('/api/tweetie/', methods=['GET'])
@cross_origin(origin='*', headers='Content-Type')
def read_all_tweeties():
    tweeties = []
    for doc in col.find():
        t = Tweetie(doc["message"],"Admin",str(doc["date"]))
        tweeties.append(t)
    json_string = json.dumps([ob.__dict__ for ob in tweeties])
    return json_string

@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request. %s', e)
    return "An internal error occured", 500

#Running in Debug Mode!!!
if __name__ == '__main__':
    app.run(debug=True, port=9090, threaded=True)

# import numpy as np
import time
import json
import warnings
from api.model import *
from flask_restful import Api, Resource, reqparse
from os import listdir
from flask_sqlalchemy import SQLAlchemy

class Post(Resource):
    def __init__(self, user="", description="", is_video=False, file=None, post_time=None, data_dict=None):
        if data_dict is not None:
            self.set_data(data_dict)
        else:
            self.user = user
            self.post_time = post_time
            self.description = description
            self.is_video = is_video
            self.file = file
            if post_time is None:
                self.post_time = time.time()

    def get_data_dict(self):
        return {'user': self.user,
                'post_time': self.post_time,
                'description': self.description,
                'is_video': self.is_video,
                'file': self.file}

    def set_data(self, data_dict):
        self.user = data_dict['user']
        self.post_time = data_dict['post_time']
        self.description = data_dict['description']
        self.is_video = data_dict['is_video']
        self.file = data_dict['file']


class Profile(Resource):
    def __init__(self, name="", status="", image="", friends=[], posts=[], current_views=[], data_dict=None):
        if data_dict is not None:
            self.set_data(data_dict)
        else:
            self.name = name
            self.status = status
            self.image = image
            self.friends = friends # list of string consisting of names
            self.posts = posts #list of Posts
            self.current_views = current_views #list of current views of friends' posts

    def add_post(self, post):
        assert isinstance(post, Post), "input of add_post should be of Class Post"
        self.posts.append(post)
        self.posts = sorted(self.posts, key=lambda p: p.post_time)

    def get_data_dict(self):
        return {'name': self.name,
                'status': self.status,
                'image': self.image,
                'friends': self.friends,
                'posts': [p.get_data_dict() for p in self.posts],
                'current_views': [p.get_data_dict() for p in self.current_views]
        }

    def set_data(self, data_dict):
        self.name = data_dict['name']
        self.status = data_dict['status']
        self.image = data_dict['image']
        self.friends = data_dict['friends'] # list of string consisting of names
        self.posts = [Post(data_dict=p_dict) for p_dict in data_dict['posts']]
        self.current_views = [Post(data_dict=p_dict) for p_dict in data_dict['current_views']]


class Database(Resource):
    def __init__(self, file=None):
        if file is None:
            self.data = {}
        else:
            self.load_data(file)

    def load_data(self, file):
        data = json.load(open(file))
        self.data = {n: Profile(data_dict=data[n]) for n in data}

    def get_data_dict(self):
        out_dict = {n: p.get_data_dict() for n, p in self.data.items()}
        return json.dumps(out_dict)

    def save_data(self, out_file):
        out_dict = {n: p.get_data_dict() for n, p in self.data.items()}
        with open(out_file, 'w') as outfile:
            json.dump(out_dict, outfile)

    def add_profile(self, profile):
        assert isinstance(profile, Profile), "input of add_profile should be of Class Profile"
        if profile.name in self.data: warnings.warn('exist profile with same name, replacing the original profile')
        self.data[profile.name] = profile

    def add_profile_post(self, post):
        assert isinstance(post, Post), "input of add_post should be of Class Post"
        assert post.user in self.data, "user of post does not exist"
        self.data[post.user].add_post(post)

class SocialNet(Resource):
    # def __init__(self):
    loggedIn = False # Get this value from the databse

    # def getLogin(self):
    #     #get from database the login status

    def get(self):
        # return {
        # 'resultStatus': 'SUCCESS',
        # 'message': "In Python"
        # }
        if (self.loggedIn):# Check with the database to see if the user is logged in
            return {'loginStatus': True}
        else:
            return {'loginStatus': False} 

    def post(self):
        #print(self)
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str)
        parser.add_argument('message', type=str)

        args = parser.parse_args()

        #print(args)
        # note, the post req from frontend needs to match the strings here (e.g. 'type and 'message')

        request_type = args['type']
        request_json = args['message']
        # ret_status, ret_msg = ReturnData(request_type, request_json)
        # currently just returning the req straight
        ret_status = request_type
        if (request_json is None):
            ret_msg = ""
        else:
            ret_msg = request_json.split('.') #split string by period
        message = "No message"
        current_user_name = ''
        posts = []
        users = []

        if request_type == "images":
            message = loadedImages(self.path)
            
        if request_type == "checkLogin":
            result = search_username('Accounts', ret_msg[0])
            if len(result) == 0:
                message = "No existing user found"
            else:
                pswd = result[0].Password

                if ret_msg[1] == pswd:# Check with the database for valid login
                # ret_msg is a string in the format of "username"."password"
                # so, you need to check the string before the period and after the period and return "ValidCombo" 
                # if the databse says that they are a valid combination
                    current_user_name = result[0].Username
                    # updt = update_login_status('Accounts', current_user_name, True) #update login status to true
                    self.loggedIn = True
                    message = "ValidCombo"
                else:
                    message = "UnvalidCombo"

        if request_type == "checkUniqueUsername": 
            result = search_username('Accounts', ret_msg[0])
            if len(result) == 0: # Check with the database
                message = "unique"
            else:
                message = "not unique"
                
        if request_type == "checkValidPassword":
            if ret_msg[0] ==  ret_msg[1]: # Check with the database
                # ret_msg is a string in the format of "password"."passwordConfirm"
                # so, you need to check the string before the period and after the period and return "match" if they match
                message = "match"
            else:
                message = "no match"
        
        if request_type == "newAccountCreated": #created and logged in at the same time
            Foo1 = meta.tables['Accounts'] #add accounts row
            ins1 = Foo1.insert({'Username':ret_msg[0], 'Password':ret_msg[1], 'LoginStatus': True})
            conn.execute(ins1)
            
            Foo2 = meta.tables['Profile'] #add profile row
            ins2 = Foo2.insert({'Username':ret_msg[0]})
            conn.execute(ins2)
            self.loggedIn = True
            message = "new account created"
        
        if request_type == "getFollowingTextPosts":
            if (ret_msg is not None):
                result = search_username('Feed', ret_msg[0]) #ret_msg is the followed user
                posts = [r.Text[0] for r in result] # Check with the backend for all text posts
        if request_type == "getFollowingImagePosts":
            if (ret_msg is not None):
                result = search_username('Feed', ret_msg[0]) #ret_msg is the followed user
                posts = [r.Text[0] for r in result] # Check with the backend for all text posts
        

        if request_type == "getMyTextPosts":
            result = search_username('Feed', current_user_name) #ret_msg is my username
            posts = [r.Text[0] for r in result] 
        
        if request_type == "newTextPost":
            # print(ret_msg)
            # posts.append(ret_msg[2])
            
            Foo = meta.tables['Feed']
            ins = Foo.insert({'Username':current_user_name, 'Text':ret_msg[0]})
            conn.execute(ins)
            message = "new text post added"
            # Store the ret_msg in database
            # Return the newTextPost
        
        if request_type == "getUsers":
            table = meta.tables['Accounts']
            st = select(table.c.Username)
            users = [r[0] for r in conn.execute(st)]
            message = "get user list"
            # Get an array of all users from the database
        
        if request_type == "follow":
            # send to databse code
            #ret_msg[0] is the username, ret_msg[2] is the one the user follows
            updt = update_username('Profile', current_user_name, ret_msg[0])
            message = ret_msg[0]
            
            # Store the ret_msg in the database as someone the user follows

        # if ret_msg:
        #     message = "Your message: {}".format(ret_msg)

        final_ret = {"status": "Success", "message": message, "arr": posts, "users": users}

        return final_ret
        
        
# db = Database()
# db.add_profile(Profile(name="y"))
# db.add_profile(Profile(name="y2"))
# db.add_profile(Profile(name="y3", friends=['y']))

# db.add_profile_post(Post(user="y", description="haha"))
# db.save_data("1.txt")
# p = Profile()

# db2 = Database("1.txt")
# #print(db.get_data_dict())

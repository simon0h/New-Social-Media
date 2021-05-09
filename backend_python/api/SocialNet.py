# import numpy as np
import time
import json
import warnings
import array
import os
from flask_restful import Api, Resource, reqparse
from os import listdir
from PIL import Image

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
    loggedIn = True # Get this value from the databse

    def get(self):
        if (self.loggedIn):
            # Check with the database to see if the user is logged in
            return {'loginStatus': True}
        else:
            return {'loginStatus': False} 

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str)
        parser.add_argument('message', type=str)
        args = parser.parse_args()

        request_type = args['type']
        request_json = args['message']
        ret_status = request_type
        ret_msg = request_json

        message = "No message"
        posts = []
        users = []

        if request_type == "images":
            message = loadedImages(self.path)
        if request_type == "checkLogin":
            if ret_msg[0] == "a" and ret_msg[2] == "a":
                # The if statement should check with the database for valid login combo
                # Currently, if the username is "a" and password is "a", it is true
                # ret_msg is a string in the format of "username"."password"
                # so, you need to check the string before the period and after the period and return "ValidCombo" 
                # if the databse says that they are a valid combination
                message = "ValidCombo"
        if request_type == "checkUniqueUsername":
            if ret_msg == "a":
                # The if statement should check with the database for valid unique username and store it if it is unique
                # Username is not allowed to have a period
                # Currently, if the username is "a", it is not unique
                message = "not unique"
            else:
                message = "unique"
        if request_type == "checkValidPassword":
            if ret_msg[0] ==  ret_msg[2]: 
                # The if statement should loop over the ret_msg to check if they match and store it if they match
                # ret_msg is a string in the format of "password"."passwordConfirm"
                # So, you need to check the string before the period and after the period and return "match" if they match
                message = "match"
            else:
                message = "no match"
        if request_type == "newAccountCreated":
            message = "new account created"

        if request_type == "getFollowingTextPosts":
            # Check with the databse for all text posts that people I follow have posted
            posts = ["Text post 1", "Text post 2"]
        if request_type == "getMyTextPosts":
            # Check with the backend for all text posts that I have posted
            posts = ["My text post 1", "My text post 2"]
        
        if request_type == "getFollowingImagePosts":
            # Get the URLs of all the image posts that people I follow have posted
            # Append the URL to loadedImages
            path = "./waterfall.jpg"        
            loadedImages = []
            loadedImages.append(os.path.abspath("./waterfall.jpg"))
            posts = loadedImages
        if request_type == "getMyImagePosts":
            # Get the URLs of all the image posts that I have posted
            # Append the URL to loadedImages
            path = "./waterfall.jpg"        
            loadedImages = []
            loadedImages.append(os.path.abspath("./waterfall.jpg"))
            posts = loadedImages

        if request_type == "newTextPost":
            posts.append(ret_msg)
            # Store ret_msg in database
            message = ret_msg
        if request_type == "newImages":
            message = ret_msg

        if request_type == "getUsers":
            users = ["user1", "user2", "user3"]
            # Get an array of all users from the database and set it to users
        if request_type == "follow":
            # ret_msg is the username of the person that I selected in Search
            # Store in database that I have followed the person
            message = ret_msg

        # if ret_msg:
        #     message = "Your message: {}".format(ret_msg)

        final_ret = {"status": "Success", "message": message, "arr": posts, "users": users}

        return final_ret
        
        
db = Database()
db.add_profile(Profile(name="y"))
db.add_profile(Profile(name="y2"))
db.add_profile(Profile(name="y3", friends=['y']))

db.add_profile_post(Post(user="y", description="haha"))
db.save_data("1.txt")
p = Profile()

db2 = Database("1.txt")
#print(db.get_data_dict())

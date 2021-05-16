# import numpy as np
import time
import json
import warnings
import os
from api.model import *
#from werkzeug.utils import secure_filename
from flask import Flask, flash, request, redirect, url_for, session
#from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
#import logging

# logging.basicConfig(level=logging.INFO)

# logger = logging.getLogger('HELLO WORLD')

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
    # To do - set it so that multiple posts by the same users can exist in the Feed table
    loggedIn = return_login_status('LoginStatus')
    current_user_name = return_current_user('LoginStatus')

    def get(self):
        getLogin = return_login_status('LoginStatus')
        if (getLogin):
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
        if (request_json is None):
            ret_msg = ""
        else: 
            if request_type != "newTextPost" and request_type != "newImagePost":
                ret_msg = request_json.split('.')
            else:
                ret_msg = request_json
        message = "No message"
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
                if ret_msg[1] == pswd:
                    current_user_name = result[0].Username
                    update_login_status('LoginStatus', False, True)
                    update_user_name('LoginStatus', True, current_user_name)
                    message = "ValidCombo"
                else:
                    message = "UnvalidCombo"

        if request_type == "checkUniqueUsername": 
            result = search_username('Accounts', ret_msg[0])
            if len(result) == 0:
                message = "unique"
            else:
                message = "not unique"
                
        if request_type == "checkValidPassword":
            if ret_msg[0] ==  ret_msg[1]:
                message = "match"
            else:
                message = "no match"
        
        if request_type == "newAccountCreated":
            Foo1 = meta.tables['Accounts']
            ins1 = Foo1.insert({'Username':ret_msg[0], 'Password':ret_msg[1]})
            conn.execute(ins1)
            print("SETTING NEW USER")
            
            Foo2 = meta.tables['Profile']
            ins2 = Foo2.insert({'Username':ret_msg[0]})
            conn.execute(ins2)
            
            update_login_status('LoginStatus', False, True)
            update_user_name('LoginStatus', True, ret_msg[0])
            message = "new account created"
            
        if request_type == "getMyColor":
            current_user_name = return_current_user('LoginStatus')
            if len(return_entry('Accounts', current_user_name, 'Color')) > 0:
                color = return_entry('Accounts', current_user_name, 'Color')[0]
                message = color
        
        if request_type == "getMyFont":
            current_user_name = return_current_user('LoginStatus')
            if len(return_entry('Accounts', current_user_name, 'Color')) > 0:
                font = return_entry('Accounts', current_user_name, 'Font')[0]
                message = font
        
        if request_type == "setMyColor":
            print(type(ret_msg[0]))
            current_user_name = return_current_user('LoginStatus')
            update_entry('Accounts', current_user_name, 'Color', ret_msg[0])
            update_entry('Profile', current_user_name, 'Color', ret_msg[0])
            
        if request_type == "setMyFont":
            current_user_name = return_current_user('LoginStatus')
            update_entry('Accounts', current_user_name, 'Font', ret_msg[0])
            update_entry('Profile', current_user_name, 'Font', ret_msg[0])
            message = ret_msg[0]
        
        if request_type == "getFollowingTextPosts":
            current_user_name = return_current_user('LoginStatus')
            lst_following = return_entry('Accounts', current_user_name, 'Followed')[0]
            post = []
            if (lst_following is not None):
                for koi in lst_following.split():
                    result = search_username('Feed', koi) 
                    post = [r.Text for r in result]
                    posts += post
            
        if request_type == "getFollowingImagePosts":
            current_user_name = return_current_user('LoginStatus')
            lst_following = return_entry('Accounts', current_user_name, 'Followed')[0]
            post = []
            if (lst_following is not None):
                for koi in lst_following.split('\t'):
                    result = search_username('Feed', koi) 
                    post = [r.Images for r in result] 
                    posts += str(post)
            # set posts to an array of urls
            # currently, this returns an array of all the characters in the url

        if request_type == "getMyTextPosts":
            current_user_name = return_current_user('LoginStatus')
            result = search_username('Feed', current_user_name) 
            posts = [r.Text for r in result]
            
        if request_type == "getMyImagePosts":
            current_user_name = return_current_user('LoginStatus')
            result = search_username('Feed', current_user_name) 
            posts = [r.Images for r in result] 
            
        if request_type == "newImagePost":
            current_user_name = return_current_user('LoginStatus')
            print("Image: ", ret_msg)
            Foo = meta.tables['Feed']
            ins = Foo.insert({'Username':current_user_name, 'Images':str(ret_msg)})
            conn.execute(ins)
            message = ("new image post at " + ret_msg)
        
        if request_type == "newTextPost":
            current_user_name = return_current_user('LoginStatus')
            
            Foo = meta.tables['Feed']
            ins = Foo.insert({'Username':current_user_name, 'Text':ret_msg})
            conn.execute(ins)
            message = "new text post added"
        
        if request_type == "getUsers":
            table = meta.tables['Accounts']
            st = select(table.c.Username)
            users = [r[0] for r in conn.execute(st)]
            message = "get user list"
        
        if request_type == "follow":
            current_user_name = return_current_user('LoginStatus')
            lst_following = return_entry('Accounts', current_user_name, 'Followed')[0]
            if (lst_following and (ret_msg[0] not in lst_following.split('\t'))):
                updt1 = update_entry('Profile', current_user_name, 'Followed', lst_following+'\t'+ret_msg[0])
                updt2 = update_entry('Accounts', current_user_name, 'Followed', lst_following+'\t'+ret_msg[0])
            elif (lst_following and (ret_msg[0] in lst_following.split('\t'))):
                1
            else: 
                updt1 = update_entry('Profile', current_user_name, 'Followed', ret_msg[0])
                updt2 = update_entry('Accounts', current_user_name, 'Followed', ret_msg[0])
            message = ret_msg[0]
         
        if request_type == "logOut":
            update_login_status('LoginStatus', True, False)
            message = "logged out"

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

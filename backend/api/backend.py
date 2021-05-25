# import numpy as np
import time
import json
import warnings
import os
from api.model import *
from flask import Flask, flash, request, redirect, url_for, session
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy

class backend(Resource):
    #loggedIn = return_login_status('LoginStatus')
    loggedIn = True
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
                    posts += post
            print(posts)

        if request_type == "getMyTextPosts":
            current_user_name = return_current_user('LoginStatus')
            result = search_username('Feed', current_user_name) 
            posts = [r.Text for r in result]
            print(posts)
            
        if request_type == "getMyImagePosts":
            current_user_name = return_current_user('LoginStatus')
            result = search_username('Feed', current_user_name) 
            posts = [r.Images for r in result] 
            
        if request_type == "newImagePost":
            current_user_name = return_current_user('LoginStatus')
            Foo = meta.tables['Feed']
            ins = Foo.insert({'Username':current_user_name, 'Images':str(ret_msg)})
            conn.execute(ins)
            message = ("new image post at " + ret_msg)
        
        if request_type == "newTextPost":
            current_user_name = return_current_user('LoginStatus')
            Foo = meta.tables['Feed']
            ins = Foo.insert({'Username':current_user_name, 'Text':ret_msg})
            conn.execute(ins)
            message = "new text post " + ret_msg
        
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

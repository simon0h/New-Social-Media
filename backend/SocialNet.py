import numpy as np
import time
import json
import warnings


class Post:
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


class Profile:
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


class Database:
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
        
        
db = Database()
db.add_profile(Profile(name="y"))
db.add_profile(Profile(name="y2"))
db.add_profile(Profile(name="y3", friends=['y']))

db.add_profile_post(Post(user="y", description="haha"))
db.save_data("1.txt")
p = Profile()

db2 = Database("1.txt")
print(db.get_data_dict())

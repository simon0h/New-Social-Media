# -*- coding: utf-8 -*-
"""
Created on Sun May  9 14:25:29 2021

@author: Yang
"""

import sqlalchemy as db
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, Boolean, String, ForeignKey, Time
from sqlalchemy.sql import select, update

#engine = create_engine('postgresql://postgres:postgres@csuy4523-vm-db/postgres') #local host address (//USERNAME:PASSWORD@HOSTNAME/DATABASENAME)
#engine = create_engine('postgresql://postgres:postgres@128.238.64.167/postgres') #local host address (DATABASE ENGINE://USERNAME:PASSWORD@HOSTNAME/DATABASENAME)
engine = create_engine('postgresql://postgres:1234@localhost/postgres') #

meta = MetaData()

accounts = Table(
    'Accounts', meta,
    Column('Username', String, primary_key = True),
    Column('First', String),
    Column('Last', String),
    Column('Password', String),
    Column('Images', String),
    Column('Followed', String),
    Column('Font', String),
    Column('Color', String)
)

feed = Table(
    'Feed', meta, 
    Column('Images', String),
    Column('Username', String, primary_key = True), 
    Column('Order', Integer),
    Column('Font', String),
    Column('TimePosted', Time),
    Column('Text', String)
)

profile = Table(
    'Profile', meta,
    Column('Username', String, primary_key = True),
    Column('First', String),
    Column('Last', String),
    Column('Font', String),
    Column('Color', String),
    Column('Followed', String),
    Column('Images', String)
)

login = Table(
    'LoginStatus', meta,
    Column('Status', Boolean),
    Column('Username', String))

# test_t = Table(
#     'test_t', meta,
#     Column('name', String),
#     Column('id', String),
# )

meta.create_all(engine)
conn = engine.connect()

if (len([1 for t in conn.execute(select(meta.tables['LoginStatus'].c.Status))]) == 0):
    ins = meta.tables['LoginStatus'].insert({'Status': False})
    conn.execute(ins)



# method_list = [func for func in dir(Foo) if callable(getattr(Foo, func))]
# print(method_list)
# ins = Foo.insert({'name':'libo', 'id':'123'})
# conn.execute(ins)
def search_username(tableName, Username):
    table = meta.tables[tableName]
    st = select(table).where(table.c.Username == Username)
    result = [r for r in conn.execute(st)]
    return result

def update_entry(tableName, Username, updateColumn, updateValue):
    table = meta.tables[tableName]
    stmt = (
        update(table).
        where(table.c.Username == Username).
        values(**{updateColumn:updateValue})
    )
    conn.execute(stmt)
    
def update_user_name(tableName, Status, updateValue):
    table = meta.tables[tableName]
    stmt = (
        update(table).
        where(table.c.Status == Status).
        values(Username=updateValue)
    )
    conn.execute(stmt)

def return_entry(tableName, Username, returnColumn):
    table = meta.tables[tableName]
    st = select(table).where(table.c.Username == Username)
    result = [getattr(r, returnColumn) for r in conn.execute(st)]
    return result

def update_login_status(tableName, Status, updateValue):
    table = meta.tables[tableName]
    stmt = (
        update(table).
        where(table.c.Status == Status).
        values(Status=updateValue, Username=None)
    )
    conn.execute(stmt)

# def return_color(tableName, color):
#     table = meta.tables[tableName]
#     st = select(table)
#     result = [r for r in conn.execute(st)]
#     return result[0][0]

def return_login_status(tableName):
    table = meta.tables[tableName]
    st = select(table)
    result = [r for r in conn.execute(st)]
    return result[0][0]

def return_current_user(tableName):
    table = meta.tables[tableName]
    st = select(table)
    result = [r for r in conn.execute(st)]
    return result[0][1]


# update_login_status('LoginStatus', False, True)
# return_login_status('LoginStatus')

# Foo = meta.tables['Accounts']
# ins = Foo.insert({'Username':'rr', 'Password':'rr', 'Followed':'e', 'Color': '#5d2424'})
# conn.execute(ins)

# Foo2 = meta.tables['Accounts']
# ins2 = Foo2.insert({'Username':'e', 'Password':'e'})
# conn.execute(ins2)

# Foo3 = meta.tables['Feed']
# ins3 = Foo3.insert({'Username':'e', 'Text':'test post'})
# conn.execute(ins3)

# #hard code of inserting a user row to Accounts
# Foo = meta.tables['Accounts']
# ins = Foo.insert({'Username':'libo', 'Password':'123'})
# conn.execute(ins)

# #hard code of deleting a specific user row using its username
# Foo = meta.tables['Accounts']
# stmt = Foo.delete().where(Foo.c.Username == 'libo')
# conn.execute(stmt)
    
# Foo = meta.tables['test_t']
# result = conn.execute(select(Foo).where(Foo.c.name == 'libo'))
# x.Username
# for t in result:
#      print(t)

# print(census.columns.keys())

# table = meta.tables['Accounts']
# st = select(table.c.Username)
# users = [r[0] for r in conn.execute(st)]
# print(users)

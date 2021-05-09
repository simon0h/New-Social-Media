# -*- coding: utf-8 -*-
"""
Created on Sun May  9 14:25:29 2021

@author: Yang
"""

import sqlalchemy as db
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, Boolean, String, ForeignKey, Time
from sqlalchemy.sql import select, update

engine = create_engine('postgresql://postgres:postgresql@localhost/postgres') #local host address (//USERNAME:PASSWORD@HOSTNAME/DATABASENAME)
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
    Column('Color', Integer),
    Column('LoginStatus', Boolean)
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
    Column('Color', Integer),
    Column('Followed', String),
    Column('Images', String)
)

# test_t = Table(
#     'test_t', meta,
#     Column('name', String),
#     Column('id', String),
# )

meta.create_all(engine)
conn = engine.connect()



# method_list = [func for func in dir(Foo) if callable(getattr(Foo, func))]
# print(method_list)
# ins = Foo.insert({'name':'libo', 'id':'123'})
# conn.execute(ins)
def search_username(tableName, Username):
    table = meta.tables[tableName]
    st = select(table).where(table.c.Username == Username)
    result = [r for r in conn.execute(st)]
    return result

def update_username(tableName, Username, updateValue):
    table = meta.tables[tableName]
    stmt = (
        update(table).
        where(table.c.Username == Username).
        values(Followed=updateValue)
    )
    conn.execute(stmt)

def update_login_status(tableName, Username, updateValue):
    table = meta.tables[tableName]
    stmt = (
        update(table).
        where(table.c.Username == Username).
        values(LoginStatus=updateValue)
    )
    conn.execute(stmt)

Foo = meta.tables['Accounts']
ins = Foo.insert({'Username':'r', 'Password':'r'})
conn.execute(ins)

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

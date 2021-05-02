PGDMP                         y           test    10.16    10.16     �
           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            �
           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            �
           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            �
           1262    16393    test    DATABASE     �   CREATE DATABASE test WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE test;
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            �
           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    6                        3079    12924    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false                        0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16394    Account Info    TABLE     %  CREATE TABLE public."Account Info" (
    "Username" character varying NOT NULL,
    "First Name" character varying,
    "Last Name" character varying,
    "Password" character varying,
    "Images" character varying[],
    "Followed" character varying[],
    "Font" text,
    "Color" bytea
);
 "   DROP TABLE public."Account Info";
       public         postgres    false    6            �            1259    16432    Feed    TABLE     �   CREATE TABLE public."Feed" (
    "Images" character varying,
    "Username" character varying,
    "Post Number" integer NOT NULL,
    "Font" character varying,
    "Time Posted" timestamp with time zone
);
    DROP TABLE public."Feed";
       public         postgres    false    6            �            1259    16424    Profile    TABLE       CREATE TABLE public."Profile" (
    "Owner Username" character varying NOT NULL,
    "First Name" character varying,
    "Last Name" character varying,
    "Font" character varying,
    "Color" bytea,
    "Followed" character varying[],
    "Images" character varying
);
    DROP TABLE public."Profile";
       public         postgres    false    6            �
          0    16394    Account Info 
   TABLE DATA                     public       postgres    false    196   =       �
          0    16432    Feed 
   TABLE DATA                     public       postgres    false    198   W       �
          0    16424    Profile 
   TABLE DATA                     public       postgres    false    197   q       x
           2606    16423    Account Info Account Info_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."Account Info"
    ADD CONSTRAINT "Account Info_pkey" PRIMARY KEY ("Username");
 L   ALTER TABLE ONLY public."Account Info" DROP CONSTRAINT "Account Info_pkey";
       public         postgres    false    196            |
           2606    16439    Feed Feed_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public."Feed"
    ADD CONSTRAINT "Feed_pkey" PRIMARY KEY ("Post Number");
 <   ALTER TABLE ONLY public."Feed" DROP CONSTRAINT "Feed_pkey";
       public         postgres    false    198            z
           2606    16431    Profile Profile_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("Owner Username");
 B   ALTER TABLE ONLY public."Profile" DROP CONSTRAINT "Profile_pkey";
       public         postgres    false    197            �
   
   x���          �
   
   x���          �
   
   x���         
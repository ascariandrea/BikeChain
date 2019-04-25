create table "users" ("id" SERIAL NOT NULL PRIMARY KEY,"email" VARCHAR NOT NULL UNIQUE,"password" VARCHAR NOT NULL,"salt" VARCHAR NOT NULL,"token" VARCHAR,"created_at" timestamp default now() NOT NULL);

create type "device_status" AS ENUM ('Ok', 'Lost');

create table "devices" ("id" SERIAL NOT NULL PRIMARY KEY,"uuid" VARCHAR NOT NULL UNIQUE,"name" VARCHAR NOT NULL,"user_id" INTEGER NOT NULL,"status" device_status DEFAULT 'Ok' NOT NULL,"created_at" timestamp default now() NOT NULL)

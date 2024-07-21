create database everything_is_ok;

use everything_is_ok;

create table users (
	id int auto_increment primary key,
    guest boolean not null,
    username varchar(100) unique not null,
    email varchar(100),
    password varchar(100)
);
 
create table concerns (
	id int auto_increment primary key,
    user_id int,
    title text,
    messages text not null,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users(id)
);
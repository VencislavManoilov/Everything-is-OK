create database everything_is_ok;

use everything_is_ok;

create table users (
	id int auto_increment primary key,
    guest bool not null,
    username varchar(100) unique,
    email varchar(100),
    password varchar(32)
);
 
create table concerns (
	id int auto_increment primary key,
    user_id int,
    message text not null,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users(id)
);
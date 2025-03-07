Create database book-film-db
use book-film-db

create table users (
    id int primary key auto_increment,
    name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp
)

create tables items (
    id int primary key auto_increment,
    title varchar(255) not null,
    type enum("book", "film") not null,
    picture_url varchar(255),
    user_id int,
    created_at timestamp default current_timestamp
    foreign key (user_id) references users(id)
)
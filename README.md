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

create table reviews (
    id int auto_increment primary key,
    item_id int,
    user_id int,
    rating int not null check(rating >= 1 and rating <=5),
    comment text,
    created_at timestamp default current_timestamp,
    foreign key (item_id) references items(id),
    foreign key (user_id) references users(id)
);

create table comments (
    id int auto_increment primary key,
    review_id int,
    user_id int,
    comment_text text not null,
    created_at timestamp default current_timestamp,
    foreign key (review_id) references reviews(id),
    foreign key (user_id) references users(id)
); 
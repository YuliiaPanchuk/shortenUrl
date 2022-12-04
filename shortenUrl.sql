DROP DATABASE IF EXISTS shorted_urls;
CREATE DATABASE shorted_urls;
USE shorted_urls;

CREATE TABLE links_data(
  long_url varchar(255),
  short_url_id varchar(255),
  count int,
  created_at DATETIME,
  id int auto_increment PRIMARY KEY
);
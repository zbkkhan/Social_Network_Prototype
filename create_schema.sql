DROP DATABASE IF EXISTS social_network;
CREATE DATABASE social_network;
USE social_network;

CREATE TABLE IF NOT EXISTS Person(
	userID INT AUTO_INCREMENT,
	firstName VARCHAR(30) NOT NULL,
	lastName VARCHAR(30) NOT NULL,
	birthDate DATE,
	lastReadFeedAt TIMESTAMP NOT NULL DEFAULT '2000-03-31 00:00:00',
	PRIMARY KEY (userId)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Friend_Group(
	groupID INT AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	PRIMARY KEY (groupID)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Group_Member(
	groupID INT NOT NULL,
	memberID INT NOT NULL,
	PRIMARY KEY (groupID, memberID),
	FOREIGN KEY fk_group(groupID) REFERENCES Friend_Group(groupID),
	FOREIGN KEY fk_member(memberID) REFERENCES Person(userID)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Nested_Topic(
	topicID INT AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	lft INT NOT NULL,
	rgt INT NOT NULL,
	PRIMARY KEY (topicID)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Following(
	userID INT NOT NULL,
	topicID INT NOT NULL,
	PRIMARY KEY (userID, topicID),
	FOREIGN KEY fk_following_user(userID) REFERENCES Person(userID),
	FOREIGN KEY fk_following_topic(topicID) REFERENCES Nested_Topic(topicID)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Post(
	postID INT AUTO_INCREMENT,
	userID INT NOT NULL,
	topicID INT NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT current_timestamp,
	postText VARCHAR(255) NOT NULL,
	PRIMARY KEY (postID),
	FOREIGN KEY fk_post_user(userID) REFERENCES Person(userID),
	FOREIGN KEY fk_post_topic(topicID) REFERENCES Nested_Topic(topicID)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Response(
	responseID INT NOT NULL,
	parentPostID INT NOT NULL,
	PRIMARY KEY (responseID, parentPostID),
	FOREIGN KEY fk_response_post_res(responseID) REFERENCES Post(postID),
	FOREIGN KEY fk_response_post_parent(parentPostID) REFERENCES Post(postID)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Engagement(
	userID INT NOT NULL,
	postID INT NOT NULL,
	isThumbsUp BOOL NOT NULL,
	PRIMARY KEY (userID, postID),
	FOREIGN KEY fk_like_user(userID) REFERENCES Person(userID),
	FOREIGN KEY fk_like_post(postID) REFERENCES Post(postID)
) ENGINE=INNODB;

SOURCE populate_data.sql;
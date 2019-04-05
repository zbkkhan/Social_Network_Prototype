# Social Network Prototype
## Setup

Requires NodeJS >= v8.10, MySQL server >= 5.6

1. Change MySQL credentials in `app.js` to match local instance  
(replace \<HOSTNAME>, \<USER>, and \<PASSWORD>)
```js
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '<HOSTNAME>',
  port: 3306,
  user     : '<USER>',
  password : '<PASSWORD>',
  database : 'social_network',
  multipleStatements: true
});
```
2. Login to MySQL and execute the command `source create_schema.sql`
```
mysql -u root -p -e "source create_schema.sql"
```

3. Run npm install and start the social network application server: 
```bash
npm install && node app.js
```

## Functionality
### 1. Create USER `localhost:3000/createUser/:firstName/:lastName`  
_The response from this request will contain all users ids, pick the ids of the users just created_
```bash
# Create three users
curl localhost:3000/createUser/zain/khan
curl localhost:3000/createUser/deepkaran/ghuman
curl localhost:3000/createUser/arthur/leung
```

### 2. Create GROUP `localhost:3000/createGroup/:groupName`  
_The response from this request request will contain all of the group ids, pick the id of the newly created group_
```bash
# Create a group
curl localhost:3000/createGroup/testGroup
```

### 3. Join GROUP `localhost:3000/user/:userId/joinGroup/:groupId`  
_This response from this request will show all members of all groups_
```bash
# Make user 1 and user 2 join the created group
curl localhost:3000/user/1/joinGroup/1
curl localhost:3000/user/2/joinGroup/1
```

### 4. Fetch TOPICS `localhost:3000/topics`  
_Keep the response open for later use_
```
curl localhost:3000/topics
```

### 5. Follow TOPIC `localhost:3000/user/:userId/followTopic/:topicId`
_Make user 1 follow the topic_
```bash
# Make user 1 follow the topic "PROGRAMMING"
curl localhost:3000/user/1/followTopic/4
```

### 6. Create POST `localhost:3000/createPost/user/:userId/postTopic/:topicId/postBody/:postBody`
_Note: the template ':postBody' accepts text_
```bash
# Make user 3 create a post on the topic "JAVA"
curl localhost:3000/createPost/user/3/postTopic/6/postBody/I%20love%20Java

# Make user 2 create a post on the topic "HEALTH"
curl localhost:3000/createPost/user/2/postTopic/1/postBody/Health%20post
```

### 7. Fetch FEED `localhost:3000/user/:userId/latestFeed`  
_Contains posts from all groups/topics the user follows_ 
```bash
curl localhost:3000/user/1/latestFeed
# Notice: There are posts in your feed

curl localhost:3000/user/1/latestFeed
# Notice: There are no posts this time(since all posts in the feed have been viewed by user 1 already)
```

### 8. Repeat 6 and 7
```bash
# Make user 2 create a post on the topic "HEALTH"
curl localhost:3000/createPost/user/2/postTopic/1/postBody/Health%20post2

curl localhost:3000/user/1/latestFeed
# Notice: There are posts in your feed again
```

### 9. Thumbs UP/DOWN a POST `localhost:3000/post/:postId/user/:userId/[thumbsUp, thumbsDown]`
_Allows users to vote on a post_
```bash
# Make user 1 thumbs up the first post
curl localhost:3000/post/1/user/1/thumbsUp

# Make user 2 thumbs down the first post
curl localhost:3000/post/1/user/2/thumbsDown
```

### 10. Create RESPONSE to a POST `localhost:3000/user/:userId/createPostResponse/:originalPostId/postBody/:postBody`
_Note: the template ':postBody' accepts text_
```bash
# Make user 1 create a response to post 1
curl localhost:3000/user/1/createPostResponse/1/postBody/Cool%20post

# Make user 2 create a response to post 1
curl localhost:3000/user/1/createPostResponse/1/postBody/I%20dont%20like%20this%20post
```

### 11. View all POSTS and RESPONSES `localhost:3000/posts`
```bash
curl localhost:3000/posts
```

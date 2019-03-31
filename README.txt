(1) Create three users using localhost:3000/createUser/:firstName/:lastName
    The response from this request will contain all users ids, pick the ids of the users just created

(2) Create a group using localhost:3000/createGroup/:groupName
    The response from this request request will contain all of the group ids, pick the id of the newly created group

(3) Make user 1 and user 2 join the created group together using localhost:3000/user/:userId/joinGroup/:groupId
    This response from this request will show all members of all groups

(4) Fetch all topics using localhost:3000/topics
    Keep the response open for later use

(5) Make user 1 follow the topic "PROGRAMMING" using its associated topicID from the result of (4) using localhost:3000/user/:userId/followTopic/:topicId

(6) Make user 3 create a post on the topic "JAVA" by using its associated topicID from the result of (4) using localhost:3000/createPost/user/:userId/postTopic/:topicId/postBody/:postBody
    Note: the template ':postBody' accepts text

(7) Make user 2 create a post on the topic "HEALTH" by using its associated topicID from the result of (4) using localhost:3000/createPost/user/:userId/postTopic/:topicId/postBody/:postBody
    Note: the template ':postBody' accepts text

(8) Make user 1 fetch the latest feed (which contains posts from all groups/topics the user follows) using localhost:3000/user/:userId/latestFeed
    Notice: There are posts in your feed

(9) Repeat (8) again
    Notice: There are no posts (since all posts in the feed have been viewed by user 1 already)

(10) Make user 2 create a post on the topic "HEALTH" by using its associated topicID from the result of (4) using localhost:3000/createPost/user/:userId/postTopic/:topicId/postBody/:postBody
    Note: the template ':postBody' accepts text

(11) Make user 1 fetch the latest feed (which contains posts from all groups/topics the user follows) using localhost:3000/user/:userId/latestFeed
    Notice: There are posts in your feed again

(12) Make user 1 thumbs up (or down) one of the posts in its feed with its associated postID using:
        Thumbsup: localhost:3000/post/:postId/user/:userId/thumbsUp
        Thumbsdown: localhost:3000/post/:postId/user/:userId/thumbsDown

(13) Make user 1 create a response to one of the posts using localhost:3000/user/:userId/createPostResponse/:originalPostId/postBody/:postBody
     Note: the template ':postBody' accepts text

(14) Make user 2 create a response to the response created by user 1 in (13) using localhost:3000/user/:userId/createPostResponse/:originalPostId/postBody/:postBody
     Note: the template ':postBody' accepts text

(15) Check that all posts (including responses) exist using localhost:3000/posts








const express = require('express')
const moment = require('moment')
const app = express()
var bodyParser = require('body-parser');
const port = 3000

//**********MYSQL************
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port: 3306,
  user     : 'root',
  password : 'password',
  database : 'social_network',
  multipleStatements: true
});
//**********MYSQL************

connection.connect();



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => res.send('Hello World!'))
//**************** FETCH ALL ROUTES **************************
app.get('/users', (req, res) => {
  connection.query(`SELECT * FROM Person`, (err, results, fields) => {
    if (err) throw err;
    res.send(['Person Table:       '].concat(results))
  })
})

app.get('/groups', (req, res) => {
  let selectSqlGroup = `SELECT * FROM Friend_Group`
  let selectSqlGroupMember = `SELECT * FROM Group_Member`
  connection.query(selectSqlGroup, (err, results, fields) => {
    if(err) throw err;
    connection.query(selectSqlGroupMember, (error, resultsMember) => {
      if (error) throw error;
      res.send(['Group Table:    '].concat(results).concat(['Group Members:     ']).concat(resultsMember))
    })
  })
})

app.get('/groups/:groupId', (req, res) => {
  let selectSqlGroupMember = `SELECT * FROM Group_Member WHERE groupID = ${req.params.groupId}`
  connection.query(selectSqlGroupMember, (error, resultsMember) => {
    if (error) throw error;
    res.send(['Group Members:     '].concat(resultsMember))
  })
})

app.get('/topics', (req, res) => {
  let selectSql = `SELECT * FROM Nested_Topic`
  connection.query(selectSql, (err, results, fields) => {
    if(err) throw err;
    res.send(['Topic Table:      '].concat(results))
  })
})

app.get('/posts', (req, res) => {
  let selectSql = `SELECT * FROM Post`
  connection.query(selectSql, (error, results) => {
    if (error) throw error;
    res.send((['Posts:     ']).concat(results))
  })
})
app.get('/following', (req, res) => {
  let selectSql = `SELECT * FROM Following`
  connection.query(selectSql, (error, results) => {
    if (error) throw error;
    res.send((['Following:     ']).concat(results))
  })
})

app.get('/user/:userId/following', (req, res) => {
  let selectSql = `SELECT * FROM Following WHERE userID = ${req.params.userId}`
  connection.query(selectSql, (error, results) => {
    if (error) throw error;
    res.send((['User Following:     ']).concat(results))
  })
})

app.get('/user/:userId/latestFeed', (req, res) => {
  let fetchUserTopicsSql = `SELECT node.topicID FROM (SELECT NT1.topicID, NT1.lft, NT1.rgt FROM (SELECT * FROM Following WHERE userID = ${req.params.userId}) AS F LEFT JOIN Nested_Topic AS NT1 ON NT1.topicID = F.topicID) AS parent, Nested_Topic AS node WHERE node.lft BETWEEN parent.lft AND parent.rgt`
  let fetchUserGroupMembersSql = `SELECT G2.memberID AS memberID FROM (SELECT * FROM Group_Member WHERE memberID = ${req.params.userId}) AS G1 INNER JOIN Group_Member AS G2 WHERE G1.groupID = G2.groupID GROUP BY memberID`

  connection.query(fetchUserTopicsSql, (err, topics) => {
    if (err) throw err
    topicIds = topics.map((topic) => topic.topicID)
    connection.query(fetchUserGroupMembersSql, (err, groupMembers) => {
      if (err) throw err
      console.log(groupMembers)
      groupMemberIds = groupMembers.map((groupMember) => groupMember.memberID)
      connection.beginTransaction((err) => {
        if(err) throw err;
        let fetchUserLastReadFeedAtSql = `SELECT lastReadFeedAt FROM Person WHERE userID = '${req.params.userId}'`
        connection.query(fetchUserLastReadFeedAtSql, (err, lastReadFeedAt) => {
          if (err) {
            connection.rollback(() => {
              throw err;
            })
          }
          lastReadFeedAt = moment(lastReadFeedAt[0].lastReadFeedAt).format("YYYY-MM-DD HH:mm:ss")
          let currentTimestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          console.log(lastReadFeedAt)
          let updateUserTimeStampSql = `UPDATE Person SET lastReadFeedAt = '${currentTimestamp}' WHERE userID = ${req.params.userId}`
          connection.query(updateUserTimeStampSql, (err) => {
            if (err) {
              connection.rollback(() => {
              throw err;
              })
            }

            let whereClause = null
            let fetchFeedQueryWhereMemberClause = (groupMemberIds.length > 0) ? `P.userID IN (${groupMemberIds.join(',')})` : null
            let fetchFeedQueryWhereTopicClause = (topicIds.length > 0) ? `P.topicID IN (${topicIds.join(',')})` : null
            if(fetchFeedQueryWhereMemberClause && fetchFeedQueryWhereTopicClause) {
              whereClause = '(' + fetchFeedQueryWhereMemberClause + ' OR ' + fetchFeedQueryWhereTopicClause + ')'
            } else if(fetchFeedQueryWhereMemberClause) {
              whereClause = fetchFeedQueryWhereMemberClause
            }
            else if(fetchFeedQueryWhereTopicClause) {
              whereClause = fetchFeedQueryWhereTopicClause
            }

            if(whereClause) {
              whereClause = `${whereClause} AND P.createdAt BETWEEN '${lastReadFeedAt}' AND '${currentTimestamp}'`
            } else {
              whereClause = `WP.createdAt BETWEEN '${lastReadFeedAt}' AND '${currentTimestamp}'`
            }

            let fetchFeedQuery = `SELECT * FROM Post AS P WHERE ${whereClause}`
            console.log(fetchFeedQuery)
            connection.query(fetchFeedQuery, (err, feedPosts) => {
              if (err) {
                connection.rollback(() => {
                  throw err;
                })
              }
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    throw err;
                  })
                }
                res.send(feedPosts)
              })
            })
          })
        })
      })

    })
  })
})


//***************** CREATE ROUTES ***************************
app.get('/createUser/:firstName/:lastName', (req, res) => {
    connection.query(`INSERT INTO Person (firstName, lastName) VALUES ('${req.params.firstName}', '${req.params.lastName}')`, function (error, results, fields) {
      if (error) throw error;
      connection.query(`SELECT * FROM Person`, (err, results, fields) => {
        if (err) throw err;
        res.send(results)
      })
      console.log('The solution is: ', results);

    });

})

app.get('/createGroup/:groupName', (req, res) => {
  let insertSql = `INSERT INTO Friend_Group (name) VALUES('${req.params.groupName}')`
  let selectSql = `SELECT * FROM Friend_Group`
  connection.query(insertSql, (error) => {
    if(error) throw error;
    connection.query(selectSql, (err, results, fields) => {
      if(err) throw err;
      res.send(results)
    })
  })
})

app.get('/user/:userId/joinGroup/:groupId', (req, res) => {
  let sql = `INSERT INTO Group_Member (groupID, memberID) VALUES (${req.params.groupId}, ${req.params.userId})`
  let selectSqlGroupMember = `SELECT * FROM Group_Member`
  connection.query(sql, (err) => {
    if(err) return res.send(err);
    connection.query(selectSqlGroupMember, (error, resultsMember) => {
      if (error) throw error;
      res.send((['Group Members:     ']).concat(resultsMember))
    })
  })
})

app.get('/createPost/user/:userId/postTopic/:topicId/postBody/:postBody', (req, res) => {
  let insertSql = `INSERT INTO Post (userID, topicID, postText) VALUES('${req.params.userId}', '${req.params.topicId}', '${req.params.postBody}')`
  let selectSql = `SELECT * FROM Post`
  connection.query(insertSql, (err) => {
    if(err) return res.send(err);
    connection.query(selectSql, (error, results) => {
      if (error) throw error;
      res.send((['Posts:     ']).concat(results))
    })
  })
})

app.get('/user/:userId/followTopic/:topicId', (req, res) => {
  let insertSql = `INSERT INTO Following (userID, topicID) VALUES ('${req.params.userId}', '${req.params.topicId}')`
  let selectSql = `SELECT * FROM Following WHERE userID = ${req.params.userId}`
  connection.query(insertSql, (err) => {
    if(err) return res.send(err);
    connection.query(selectSql, (error, results) => {
      if (error) throw error;
      res.send((['User Following:     ']).concat(results))
    })
  })
})

app.get('/post/:postId/user/:userId/thumbsUp', (req, res) => {
  engagement(req.params.postId, req.params.userId, true, res)
})

app.get('/post/:postId/user/:userId/thumbsDown', (req, res) => {
  engagement(req.params.postId, req.params.userId, false, res)
})

let engagement = (postId, userId, isLike, res) => {
  let insertSql =  `INSERT INTO Engagement (userID, postID, isThumbsUp) VALUES (${userId},${postId},${isLike ? 1 : 0})`
  let selectSql = `SELECT * FROM Engagement WHERE postID = ${postId}`
  connection.query(insertSql, (err) => {
    if(err) throw err
    connection.query(selectSql, (err, result) => {
      if(err) throw err
      res.send(result)
    })
  })
}

app.get('/user/:userId/createPostResponse/:originalPostId/postBody/:postBody', (req, res) => {
  let selectOrigPostSql = `SELECT * FROM Post WHERE postID = ${req.params.originalPostId}`
  connection.query(selectOrigPostSql, (err, originalPost) => {
    if(err) throw err
    originalPost = originalPost[0]
    connection.beginTransaction((err) => {
      if(err) throw err
      let insertAndSelectSql = `INSERT INTO Post (userID, topicID, postText) VALUES('${req.params.userId}', '${originalPost.topicID}', '${req.params.postBody}'); SELECT LAST_INSERT_ID() AS postID`
      connection.query(insertAndSelectSql, (err, data) => {
        if(err){
          connection.rollback(() => {
            console.log('First Rollback')
            throw err
          })
        }
        responsePostId = data[1][0].postID
        let insertResponseRelationSql = `INSERT INTO Response (responseID, parentPostID) VALUES (${responsePostId}, ${originalPost.postID}); SELECT * FROM Response WHERE Response.responseID = LAST_INSERT_ID()`
        connection.query(insertResponseRelationSql, (err, result) => {
          if(err){
            connection.rollback(() => {
              console.log('Second Rollback')
              throw err
            })
          }
          connection.commit((err) => {
            if (err) {
              connection.rollback(() => {
                console.log('Third Rollback')
                throw err;
              });
            }
            res.send(result[1])
          })
        })
      })
    })
  })
})

app.listen(port, () => console.log(`Social Network app listening on port ${port}!`))

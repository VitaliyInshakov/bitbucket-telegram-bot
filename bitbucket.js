require("dotenv").config();
const { Bitbucket } = require("bitbucket");

// database = DataBase()
// connection = database.connect_to_db()
// cursor = database.create_cursor(connection)

const approves = [];
const dictionary = [];
const requests = {};

const listOfComments = [];
const requestComments = {};
const listOfCommentsIds = [];

let startSize;
let comments;

const bitbucket = new Bitbucket({
  baseUrl: "https://api.bitbucket.org/2.0",
  auth: {
    username: process.env.BITBUCKET_USER_NAME,
    password: process.env.BITBUCKET_USER_PASSWORD,
  },
});

async function getSizePullRequests() {
  try {
    const { data } = await bitbucket.pullrequests.list({
      repo_slug: process.env.BITBUCKET_PROJECT_NAME,
      workspace: process.env.BITBUCKET_WORKSPACE_NAME,
      page: "1",
      pagelen: 10,
    });

    return data.size;
  } catch (error) {
    console.error("Error 'getSizePullRequests':", error);
    return 0;
  }
}

async function getOpenPullRequests() {
  dictionary.length = 0;
  let count = 0;

  const {
    data: { values = [] },
  } = await bitbucket.pullrequests.list({
    repo_slug: process.env.BITBUCKET_PROJECT_NAME,
    workspace: process.env.BITBUCKET_WORKSPACE_NAME,
    page: "1",
    pagelen: 10,
  });

  for (const request of values) {
    approves.length = 0;

    for (const user of request.participants ?? []) {
      if (user.role === "REVIEWER" && user.state === "approved") {
        approves.push(user.state);
        count = approves.length;
      } else {
        continue;
      }
    }

    if (request.comment_count) {
      comments = request.comment_count;
    } else {
      comments = 0;
    }

    const requests = {
      title: request.title,
      state: request.state,
      author: request.author.display_name,
      checkState: request.author.state,
      count,
      comments,
      link: request.links.self.href,
    };

    dictionary.push(requests);
    count = 0;
  }

  return dictionary;
}

module.exports = {
  startSize,
  comments,
  getSizePullRequests,
  getOpenPullRequests,
};

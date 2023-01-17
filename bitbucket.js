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
      repo_slug: process.env.BITBUCKET_REPO_NAME,
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

module.exports = {
  startSize,
  comments,
  getSizePullRequests,
};

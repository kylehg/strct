
// Examples
var Version = makeEnum({
  LATEST: 'latest',
  LATEST_PUBLISHED: 'latestPublished',
})

var PostView = makeStruct({
  limit: Number,
  includeEmpty: Boolean,
  publishedAfter: Date,
  includeContentFromVersion: Version,
})

var DEFAULT_VIEW = new PostView({
  limit: 0,
  includeEmpty: false,
  publishedAfter: null,
  includeContentFromVersion: Version.LATEST_PUBLISHED,
})

try {
  var view = new PostView({publishedAfter: Date.now()})
} catch (err) {
  // publishedAfter must be a Date, not a number
}


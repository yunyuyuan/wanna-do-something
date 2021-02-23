const name = '云与原',
  githubName = 'yunyuyuan',
  repo = 'do-something'

module.exports = {
  owner: githubName,
  repo: repo,
  email: '326178275@qq.com',
  corsServer: 'https://cors.bridged.cc/',
  domain: 'http://localhost:8080/',
  cdn: `https://cdn.jsdelivr.net/gh/${githubName}/${repo}@latest`,
  timeStamp: new Date().getTime(),

  platforms: ['gitee', 'github']
}
import axios from "axios";
import siteConfig from '@/site-config'

const apiPrefix = {
  gitee: 'https://gitee.com/api/v5/repos',
  github: 'https://api.github.com'
};
const redirect_uri = {
  gitee: siteConfig.domain + 'oauth/gitee',
  github: siteConfig.domain + 'oauth/github'
};
const oauth_token_url = {
  gitee: 'https://gitee.com/oauth/token?grant_type=authorization_code',
  github: 'https://github.com/login/oauth/access_token'
};
const client_id = {
  gitee: '356f7922c4e1a4d20826ae40a0581f4cb2778ed4638906006e50011b5ade53e2',
  github: '59973e9b0325c779813c'
}
const client_secret = {
  gitee: '8a0a1cdca730fc476efdb7987be59467daa25b6637193114f0da1372ac28b86b',
  github: '913817f49eb9fa4f285dcc8cedbd67c974b37ac2'
}

export const oauthUrl = {
  gitee: `https://gitee.com/oauth/authorize?client_id=${client_id.gitee}&redirect_uri=${redirect_uri.gitee}&response_type=code&scope=user_info%20projects`,
  github: `https://github.com/login/oauth/authorize?client_id=${client_id.github}&redirect_uri=${redirect_uri.github}&scope=public_repo`,
}

let owner = '',
  repo = ''

// base //

export function stringToB64(s) {
  return btoa(unescape(encodeURIComponent(s)))
}

function updateInfo ({owner_, repo_}){
  owner = owner_;
  repo = repo_;
}

export function getToken ({code, platform}){
  return new Promise((resolve, reject) => {
    axios({
      url: siteConfig.corsServer + oauth_token_url[platform],
      method: 'post',
      params: {
        redirect_uri: redirect_uri[platform],
        client_id: client_id[platform],
        client_secret: client_secret[platform],
        code: code,
      }
    }).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err)
    })
  })
}


// info //

export function getUserInfo ({platform, token}){
  return axios({
    url: apiPrefix[platform] + '/user',
    method: 'get',
    params: {
      access_token: token
    }
  })
}

// file //

function makeFile (path, content, msg){
  return axios({
    url: apiPrefix+`${owner}/${repo}/contents/${path}`,
    method: 'POST',
    data: {
      owner, repo, path, msg,
      content: stringToB64(content),
    }
  })
}

function getFile (path){
  return axios({
    url: 'https://gitee.com/yunyuyuan/do-something/raw/master/'+path.replace(/^\//, ''),
    method: 'get'
  })
}

function updateFile (path){

}

function deleteFile (path){

}
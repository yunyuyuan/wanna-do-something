import axios from "axios";
import siteConfig from '@/site-config'
import {encryptData, stringToGithubContent} from "@/utils/utils";

const apiPrefix = {
  // 码云的api需要cors
  gitee: siteConfig.corsServer+'https://gitee.com/api/v5',
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

export function updateInfo ({owner_, repo_}){
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

const githubApi = ({data, token})=>{
  return new Promise(((resolve, reject) => {
    axios({
      url: 'https://api.github.com/',
      method: 'post',
      data,
      headers: {
        Authorization: 'token '+token
      }
    }).then(res=>{
      console.log(res)
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  }))
}

const giteeApi = ({data, token})=>{
  axios({
    url: 'https://api.github.com/',
    method: 'post',
    data,
    headers: {
      Authorization: 'token '+token
    }
  })
}


// info //

export function getUserInfo ({platform, token}){
  return new Promise(((resolve, reject) => {
    switch (platform){
      case "github":
        axios({
          url: 'https://api.github.com/user',
          method: 'get',
          headers: {
            Authorization: 'token '+token
          }
        }).then(res=>{
          if (res.status === 200) {
            const data = res.data;
            resolve({
              login: data.login,
              avatar: data.avatar_url,
              name: data.name,
              url: data.html_url
            })
          }else{
            reject(res.statusText)
          }
        }).catch(err=>{
          reject(err)
        })
        break
    }
  }))
}

// file //
const fixPathUrl = (path)=>{
  return path.replace(/^\/?(.*)$/, '$1')
}

export function makeFile ({owner, path, platform, token, content, secret}){
  switch (platform) {
    case "github":
      return new Promise(((resolve, reject) => {
        axios({
          url: `https://api.github.com/repos/${owner}/${siteConfig.projectName}/contents/${fixPathUrl(path)}`,
          method: 'put',
          data: {
            message: 'make file:'+path,
            content: stringToGithubContent(content, secret)
          },
          headers: {
            Authorization: 'token ' + token
          }
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }))
  }
}

export function getFile ({owner, path, platform, token}){
  switch (platform) {
    case "github":
      return new Promise(((resolve, reject) => {
        axios({
          url: `https://api.github.com/repos/${owner}/${siteConfig.projectName}/contents/${fixPathUrl(path)}`,
          method: 'get',
          headers: {
            Authorization: 'token ' + token
          }
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }))
  }
}

export function updateFile (path){

}

export function deleteFile (path){

}
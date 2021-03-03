import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import {useStore} from "vuex";

export function encryptData (data, secret){
  return AES.encrypt(data, secret).toString()
}

export function stringToGithubContent(s, secret) {
  return btoa(encryptData(s, secret))
}

export function decryptData (data, secret){
  return AES.decrypt(data, secret).toString(Utf8)
}

export function githubContentToString(s, secret) {
  return decryptData(atob(s), secret)
}

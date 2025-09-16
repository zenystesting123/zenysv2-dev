import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-encrypt-decrypt',
  templateUrl: './encrypt-decrypt.component.html',
  styleUrls: ['./encrypt-decrypt.component.scss']
})
export class EncryptDecryptComponent implements OnInit {
  //stores the key size for encryption/decryption
   private static keySize = CryptoJS.enc.Utf8.parse(environment.EmailEncryptKeySize);
   //stores the initialization vector for encryption/decryption
   private static iv = CryptoJS.enc.Utf8.parse(environment.EmailEncryptIV);
  constructor() { }

  ngOnInit(): void {
  }

  
    // Method for encryption using AES algorithm
    static encryptUsingAES256(text, threadId): any {
      //get the randomly generated key
      var key = this.generateRandomKey(threadId);
      //encrypted text
      var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
          keySize: 128 / 8,
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    }
    //Method for decrytion using AES algorithm
    static decryptUsingAES256(decString, threadId) {
      //randomly generated key
      var key = this.generateRandomKey(threadId);
      //decrpted text
      var decrypted = CryptoJS.AES.decrypt(decString, key, {
          keySize: 128 / 8,
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    //generates random key
    static generateRandomKey(threadId: string) {
      //use hashing to generate key
      let sum = 0;
      //hash threadId using charCode
      for (let i = 0; i < threadId.length; i++){
        sum += threadId.charCodeAt(i);
      }
      //restrict the size to keysize
      let result = sum % this.keySize;
      //return the key
      return result;
    }

}

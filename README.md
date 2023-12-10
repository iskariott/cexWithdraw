> [!IMPORTANT]
> This script does not store any private information. All your private data is stored only on your computer. Please keep your api data in a safe place, because an attacker can steal all your funds if he takes possession of it!

### Previous preparation
<details>
<summary>OKX</summary>
 
1. Install [node.js](https://nodejs.org/en/download) if it is not already installed.

   To check that `node.js` is installed, write the command in the cmd
```ruby
> node -v
v18.13.0
```
2. Create [okx api](https://www.okx.com/ua/account/my-api) with the ability to withdraw funds and save your `apikey`, `secretKey` and `password` in a safe place.
<p align="left">
 <img src="https://github.com/iskariott/cexWithdraw/assets/97576455/fc84b72d-f901-4d9a-baf9-271e2fa350d7" >
</p>

3. Add crypto addresses which you want to use in script to Whitelist and mark up "Save as verified address to skip future verification"
<p align="left">
 <img src="https://github.com/iskariott/cexWithdraw/assets/97576455/51f24330-c403-4124-af2b-8a1f9ed138b3">
</p>

</details>

<details>
<summary>Binance</summary>
 
1. Install [node.js](https://nodejs.org/en/download) if it is not already installed.

   To check that `node.js` is installed, write the command in the cmd
```ruby
> node -v
v18.13.0
```
2. Create [binance api](https://www.binance.com/uk-UA/my/settings/api-management) with the ability to withdraw funds and save your `apikey` and `secretKey` in a safe place.
<p align="left">
 <img src="https://github.com/iskariott/cexWithdraw/assets/97576455/0b947951-4316-43a5-9eac-335007aaed85" >
</p>

</details>

### Script usage

1. Clone or download this repo.
2. In root dir create file `wallets.txt` and add addresses there.
3. In folder binance and okx create file `privateKeys.mjs` (separately for every folder) and insert your api data

binance

![image](https://github.com/iskariott/cexWithdraw/assets/97576455/2b02b1e9-d2ef-430b-bf84-b1f1325133e9)

okx

![image](https://github.com/iskariott/cexWithdraw/assets/97576455/494846f0-27bb-4efa-847d-1e89b3c48755)


5. Configure script in file `config.js`
6. Open cmd in root folder and run
```ruby
> nmp install
> npm start
```

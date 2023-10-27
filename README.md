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
2. Add addresses from Whitelist to `wallets.txt`
3. Insert your api data to `privateKeys.mjs` (separately for every cex)
4. Go to the root folder and run
```ruby
> nmp install
> npm start
```

### Functional

1. Send tokens to wallets in a random order?
<p align="left">
 <img src="https://github.com/iskariott/cexWithdraw/assets/97576455/734ec9ac-ea2f-44a8-989e-d3e3eef03bd1" >
</p>

2. Choose token and chain
3. Set range from/to token amount in order to randomize each withdrawal
4. Set range from/to delay to randomize the delay between each operation
<p align="left">
 <img src="https://github.com/iskariott/cexWithdraw/assets/97576455/d2af0624-21a5-4ce4-9610-82929fcb3111" >
</p>

5. If you run out of funds while the script is running, it will notify you and terminate the work
<p align="left">
 <img src="https://github.com/iskariott/cexWithdraw/assets/97576455/744ed2cb-622d-4e3f-b44e-81e4f569004d" >
</p>

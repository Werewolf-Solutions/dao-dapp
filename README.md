# DAO dapp

`git clone`

`npm i`

Make sure dao-dapp is in same parent folder of dao-project and you deployed smart contracts, in dao-project/ run `make deploy-local`

```
parent_folder/
  dao-dapp
  dao-project
```

`npm start`

# TODO

- [] DAO

  - [x] create proposal

  - [>] queue proposal

  - [] execute proposal

- [] CompaniesHouse

  - [] create company

  - [] delete company

  - [] edit company

  - [] hire employee

  - [] fire employee

  - [] pay employees

- [] TokenSale

  - [] buy tokens with USDC, USDT, WBTC, ETH and any other allowed token chosen in DAO

- [] Staking

  - [] see staked positions

  - [] stake tokens

  - [] unstake and withdraw tokens

# bugs/notes/questions

- why don't I get proposalState?

- why datas, targets, signatures are not stored in proposal? or at least why they are not shown in DAO abi?

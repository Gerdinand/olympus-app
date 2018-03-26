'use strict';

import BigNumber from 'bignumber.js';

// abis
export const ERC20 = [{
  constant: true,
  inputs: [],
  name: 'name',
  outputs: [{ name: '', type: 'string' }],
  payable: false, type: 'function',
},
{
  constant: true,
  inputs: [],
  name: 'minter',
  outputs: [{ name: '', type: 'address' }],
  payable: false, type: 'function',
},
{
  constant: false,
  inputs: [{ name: '_spender', type: 'address' },
  { name: '_value', type: 'uint256' }], name: 'approve',
  outputs: [{ name: 'o_success', type: 'bool' }],
  payable: false,
  type: 'function',
},
{
  constant: true,
  inputs: [], name: 'totalSupply',
  outputs: [{ name: '', type: 'uint256' }],
  payable: false, type: 'function',
},
{
  constant: false,
  inputs: [{ name: '_recipient', type: 'address' }, { name: '_value', type: 'uint256' }],
  name: 'createIlliquidToken',
  outputs: [{ name: 'o_success', type: 'bool' }], payable: false, type: 'function',
},
{
  constant: false, inputs: [{ name: '_from', type: 'address' },
  { name: '_recipient', type: 'address' }, { name: '_amount', type: 'uint256' }],
  name: 'transferFrom', outputs: [{ name: 'o_success', type: 'bool' }],
  payable: false, type: 'function',
},
{
  constant: true, inputs: [],
  name: 'endMintingTime',
  outputs: [{ name: '', type: 'uint256' }],
  payable: false, type: 'function',
},
{
  constant: true, inputs: [], name: 'decimals',
  outputs: [{ name: '', type: 'uint256' }],
  payable: false, type: 'function',
}, {
  constant: false,
  inputs: [{ name: '_recipient', type: 'address' }, {
    name: '_value', type: 'uint256',
  }], name: 'createToken',
  outputs: [{ name: 'o_success', type: 'bool' }], payable: false, type: 'function',
},
{
  constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf',
  outputs: [{ name: 'balance', type: 'uint256' }], payable: false, type: 'function',
}, {
  constant: true, inputs: [{ name: '', type: 'address' }], name: 'illiquidBalance',
  outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function',
}, {
  constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }],
  payable: false, type: 'function',
}, {
  constant: false, inputs: [{ name: '_recipient', type: 'address' },
  { name: '_amount', type: 'uint256' }], name: 'transfer',
  outputs: [{ name: 'o_success', type: 'bool' }], payable: false, type: 'function',
}, {
  constant: true, inputs: [], name: 'LOCKOUT_PERIOD', outputs: [{ name: '', type: 'uint256' }],
  payable: false, type: 'function',
}, {
  constant: true, inputs: [{ name: '_owner', type: 'address' },
  { name: '_spender', type: 'address' }], name: 'allowance',
  outputs: [{ name: 'o_remaining', type: 'uint256' }], payable: false, type: 'function',
}, {
  constant: false, inputs: [], name: 'makeLiquid',
  outputs: [], payable: false, type: 'function',
}, {
  inputs: [{ name: '_minter', type: 'address' },
  { name: '_endMintingTime', type: 'uint256' }], payable: false, type: 'constructor',
}, {
  anonymous: false, inputs: [{ indexed: true, name: '_from', type: 'address' },
  { indexed: true, name: '_recipient', type: 'address' },
  { indexed: false, name: '_value', type: 'uint256' }], name: 'Transfer', type: 'event',
}, {
  anonymous: false, inputs: [{ indexed: true, name: '_owner', type: 'address' },
  { indexed: true, name: '_spender', type: 'address' },
  { indexed: false, name: '_value', type: 'uint256' }], name: 'Approval', type: 'event',
}];

export const KYBER_ABI = [
  {
    constant: false, inputs: [
      {
        name: 'alerter', type: 'address',
      },
    ],
    name: 'removeAlerter', outputs: [], payable: false,
    stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'reserve', type: 'address',
      },
      {
        name: 'source', type: 'address',
      },
      {
        name: 'dest', type: 'address',
      },
      {
        name: 'add', type: 'bool',
      },
    ], name: 'listPairForReserve', outputs: [],
    payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'kyberWhiteList',
    outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'getReserves',
    outputs: [
      {
        name: '', type: 'address[]',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [],
    name: 'pendingAdmin', outputs: [
      {
        name: '', type: 'address',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'getOperators',
    outputs: [
      {
        name: '', type: 'address[]',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'negligiblePriceDiff',
    outputs: [
      {
        name: '', type: 'uint256',
      },
    ], payable: false,
    stateMutability: 'view', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'token', type: 'address',
      },
      {
        name: 'amount', type: 'uint256',
      },
      {
        name: 'sendTo', type: 'address',
      },
    ],
    name: 'withdrawToken', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'maxGasPrice',
    outputs: [
      {
        name: '', type: 'uint256',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newAlerter', type: 'address',
      },
    ],
    name: 'addAlerter', outputs: [], payable: false,
    stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [],
    name: 'feeBurnerContract',
    outputs: [
      {
        name: '', type: 'address',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'expectedRateContract',
    outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false,
    stateMutability: 'view', type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'user', type: 'address',
      },
    ],
    name: 'getUserCapInWei', outputs: [
      {
        name: '', type: 'uint256',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newAdmin', type: 'address',
      },
    ], name: 'transferAdmin', outputs: [],
    payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_enable', type: 'bool',
      },
    ],
    name: 'setEnable',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'claimAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [
      {
        name: '', type: 'address',
      },
    ],
    name: 'isReserve', outputs: [
      {
        name: '', type: 'bool',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'getAlerters',
    outputs: [
      {
        name: '', type: 'address[]',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [
      {
        name: 'source', type: 'address',
      },
      {
        name: 'dest', type: 'address',
      },
      {
        name: 'srcQuantity', type: 'uint256',
      },
    ],
    name: 'getExpectedRate', outputs: [
      {
        name: 'expectedPrice', type: 'uint256',
      },
      {
        name: 'slippagePrice', type: 'uint256',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [
      {
        name: '', type: 'uint256',
      },
    ], name: 'reserves',
    outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'newOperator', type: 'address',
      },
    ], name: 'addOperator',
    outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'reserve', type: 'address',
      },
      {
        name: 'add', type: 'bool',
      },
    ], name: 'addReserve', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [], name: 'enable', outputs: [
      {
        name: '', type: 'bool',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'operator', type: 'address',
      },
    ], name: 'removeOperator', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'source', type: 'address',
      },
      {
        name: 'srcAmount', type: 'uint256',
      },
      {
        name: 'dest', type: 'address',
      },
      {
        name: 'destAddress', type: 'address',
      },
      {
        name: 'maxDestAmount', type: 'uint256',
      },
      {
        name: 'minConversionRate',
        type: 'uint256',
      },
      {
        name: 'walletId', type: 'address',
      },
    ], name: 'walletTrade', outputs: [
      {
        name: '', type: 'uint256',
      },
    ], payable: true, stateMutability: 'payable', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: '_whiteList', type: 'address',
      },
      {
        name: '_expectedRate', type: 'address',
      },
      {
        name: '_feeBurner', type: 'address',
      },
      {
        name: '_maxGasPrice', type: 'uint256',
      },
      {
        name: '_negligibleDiff', type: 'uint256',
      },
    ], name: 'setParams', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [
      {
        name: 'source', type: 'address',
      },
      {
        name: 'dest', type: 'address',
      },
      {
        name: 'srcQty', type: 'uint256',
      },
    ], name: 'findBestRate', outputs: [
      {
        name: '', type: 'uint256',
      },
      {
        name: '', type: 'uint256',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'source', type: 'address',
      },
      {
        name: 'srcAmount', type: 'uint256',
      },
      {
        name: 'dest', type: 'address',
      },
      {
        name: 'destAddress', type: 'address',
      },
      {
        name: 'maxDestAmount', type: 'uint256',
      },
      {
        name: 'minConversionRate', type: 'uint256',
      },
      {
        name: 'walletId', type: 'address',
      },
    ], name: 'trade', outputs: [
      {
        name: '', type: 'uint256',
      },
    ], payable: true, stateMutability: 'payable', type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'amount', type: 'uint256',
      },
      {
        name: 'sendTo', type: 'address',
      },
    ],
    name: 'withdrawEther', outputs: [], payable: false,
    stateMutability: 'nonpayable', type: 'function',
  },
  {
    constant: true, inputs: [],
    name: 'getNumReserves', outputs: [
      {
        name: '', type: 'uint256',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [
      {
        name: 'token', type: 'address',
      },
      {
        name: 'user', type: 'address',
      },
    ], name: 'getBalance',
    outputs: [
      {
        name: '', type: 'uint256',
      },
    ],
    payable: false, stateMutability: 'view', type: 'function',
  },
  {
    constant: true, inputs: [],
    name: 'admin', outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false, stateMutability: 'view', type: 'function',
  },
  {
    inputs: [
      {
        name: '_admin', type: 'address',
      },
    ], payable: false, stateMutability: 'nonpayable', type: 'constructor',
  },
  {
    payable: true, stateMutability: 'payable', type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true, name: 'sender', type: 'address',
      },
      {
        indexed: false, name: 'source', type: 'address',
      },
      {
        indexed: false, name: 'dest', type: 'address',
      },
      {
        indexed: false, name: 'actualSrcAmount', type: 'uint256',
      },
      {
        indexed: false, name: 'actualDestAmount', type: 'uint256',
      },
    ],
    name: 'Trade', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'reserve', type: 'address',
      },
      {
        indexed: false, name: 'add', type: 'bool',
      },
    ], name: 'AddReserve', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'reserve', type: 'address',
      },
      {
        indexed: false, name: 'source', type: 'address',
      },
      {
        indexed: false, name: 'dest', type: 'address',
      },
      {
        indexed: false, name: 'add', type: 'bool',
      },
    ], name: 'ListPairsForReserve', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: true, name: 'sender', type: 'address',
      },
      {
        indexed: false, name: 'amount', type: 'uint256',
      },
    ], name: 'EtherReceival', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'token', type: 'address',
      },
      {
        indexed: false, name: 'amount', type: 'uint256',
      },
      {
        indexed: false, name: 'sendTo', type: 'address',
      },
    ], name: 'WithdrawToken', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'amount', type: 'uint256',
      },
      {
        indexed: false, name: 'sendTo', type: 'address',
      },
    ], name: 'WithdrawEther', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'pendingAdmin', type: 'address',
      },
    ], name: 'TransferAdmin', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'newAdmin', type: 'address',
      },
      {
        indexed: false, name: 'previousAdmin', type: 'address',
      },
    ], name: 'ClaimAdmin', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'newAlerter', type: 'address',
      },
      {
        indexed: false, name: 'isAdd', type: 'bool',
      },
    ], name: 'AddAlerter', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'newOperator', type: 'address',
      },
      {
        indexed: false, name: 'isAdd', type: 'bool',
      },
    ], name: 'AddOperator', type: 'event',
  },
];
export const KYBER_WALLET = [
  {
    constant: true, inputs: [], name: 'ETH_TOKEN_ADDRESS', outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false, type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'srcToken', type: 'address',
      },
      {
        name: 'srcAmount', type: 'uint256',
      },
      {
        name: 'destToken', type: 'address',
      },
      {
        name: 'maxDestAmount', type: 'uint256',
      },
      {
        name: 'minRate', type: 'uint256',
      },
      {
        name: 'destination', type: 'address',
      },
      {
        name: 'destinationData', type: 'bytes',
      },
      {
        name: 'onlyApproveTokens', type: 'bool',
      },
      {
        name: 'throwOnFail', type: 'bool',
      },
    ], name: 'convertAndCall', outputs: [], payable: false, type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'network', type: 'address',
      },
    ], name: 'setKyberNetwork', outputs: [], payable: false, type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'token', type: 'address',
      },
      {
        name: 'from', type: 'address',
      },
      {
        name: 'amount', type: 'uint256',
      },
    ], name: 'recieveTokens', outputs: [], payable: false, type: 'function',
  },
  {
    constant: true, inputs: [], name: 'owner', outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false, type: 'function',
  },
  {
    constant: false, inputs: [], name: 'recieveEther', outputs: [], payable: true, type: 'function',
  },
  {
    constant: false, inputs: [
      {
        name: 'to', type: 'address',
      },
      {
        name: 'value', type: 'uint256',
      },
      {
        name: 'data', type: 'bytes',
      },
    ], name: 'execute', outputs: [], payable: false, type: 'function',
  },
  {
    constant: true, inputs: [], name: 'kyberNetwork', outputs: [
      {
        name: '', type: 'address',
      },
    ], payable: false, type: 'function',
  },
  {
    inputs: [
      {
        name: '_kyberNetwork', type: 'address',
      },
    ], payable: false, type: 'constructor',
  },
  {
    payable: true, type: 'fallback',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: true, name: 'origin', type: 'address',
      },
      {
        indexed: false, name: 'error', type: 'uint256',
      },
      {
        indexed: false, name: 'errorInfo', type: 'uint256',
      },
    ], name: 'ErrorReport', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: true, name: 'owner', type: 'address',
      },
      {
        indexed: false, name: 'kyberNetwork', type: 'address',
      },
    ], name: 'NewWallet', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: true, name: 'sender', type: 'address',
      },
      {
        indexed: false, name: 'network', type: 'address',
      },
    ], name: 'SetKyberNetwork', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'sender', type: 'address',
      },
      {
        indexed: false, name: 'amountInWei', type: 'uint256',
      },
    ], name: 'IncomingEther', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: false, name: 'from', type: 'address',
      },
      {
        indexed: false, name: 'token', type: 'address',
      },
      {
        indexed: false, name: 'amount', type: 'uint256',
      },
    ], name: 'IncomingTokens', type: 'event',
  },
  {
    anonymous: false, inputs: [
      {
        indexed: true, name: 'sender', type: 'address',
      },
      {
        indexed: false, name: 'destination', type: 'address',
      },
      {
        indexed: false, name: 'destAmount', type: 'uint256',
      },
    ], name: 'ConvertAndCall', type: 'event',
  },
]
  ;
export const CHAIN_ID = 42; // 3 is ropsten, 42 is kovan.;
export const CHAIN_NAME = 'kovan';
export const MINIMUN_GAS_PRICE = 184000;
export const GAS_LIMIT = 200000;
export const MAX_GAS_PRICE = 15000000000 * 10; // 20 times half of default one from API

// contract datas
// compiled with v0.4.11+commit.68ef5810
// tslint:disable-next-line:max-line-length
export const KYBER_WALLET_DATA = '6060604052600a600655640ba43b7400600c556001600d60006101000a81548160ff021916908315150217905550341561003857600080fd5b60405160208061416e83398101604052808051906020019091905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061408a806100e46000396000f300606060405260043610610196576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806301a12fd31461023e57806303141fcd14610277578063036a6195146102f95780630902f1ac1461034e57806326782247146103b857806327a099d81461040d5780633b075f93146104775780633ccdbb28146104a05780633de39c1114610501578063408ee7fe1461052a578063579425b7146105635780635dada964146105b85780636432679f1461060d57806375829def1461065a5780637726bed31461069357806377f50f97146106b85780637a2b0587146106cd5780637c423f541461071e578063809a9e55146107885780638334278d146108045780639870d7fe14610867578063a0d7bb1b146108a0578063a3907d71146108e4578063ac8a584a14610911578063b02cbe1a1461094a578063b5caadf214610a04578063b8388aca14610a8d578063cb3c28c714610b09578063ce56c45414610bc3578063cfff25bb14610c05578063d4fac45d14610c2e578063f851a44014610c9a575b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156101ee57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff167f75f33ed68675112c77094e7c5b073890598be1d23e27cd7f6907b4a7d98ac619346040518082815260200191505060405180910390a2005b341561024957600080fd5b610275600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610cef565b005b341561028257600080fd5b6102f7600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080351515906020019091905050610fb1565b005b341561030457600080fd5b61030c6113f0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561035957600080fd5b610361611416565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156103a4578082015181840152602081019050610389565b505050509050019250505060405180910390f35b34156103c357600080fd5b6103cb6114aa565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561041857600080fd5b6104206114d0565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610463578082015181840152602081019050610448565b505050509050019250505060405180910390f35b341561048257600080fd5b61048a611564565b6040518082815260200191505060405180910390f35b34156104ab57600080fd5b6104ff600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061156a565b005b341561050c57600080fd5b610514611737565b6040518082815260200191505060405180910390f35b341561053557600080fd5b610561600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061173d565b005b341561056e57600080fd5b61057661191f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156105c357600080fd5b6105cb611945565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561061857600080fd5b610644600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061196b565b6040518082815260200191505060405180910390f35b341561066557600080fd5b610691600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611a54565b005b341561069e57600080fd5b6106b660048080351515906020019091905050611bb4565b005b34156106c357600080fd5b6106cb611c2c565b005b34156106d857600080fd5b610704600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611e08565b604051808215151515815260200191505060405180910390f35b341561072957600080fd5b610731611e28565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610774578082015181840152602081019050610759565b505050509050019250505060405180910390f35b341561079357600080fd5b6107e7600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050611ebc565b604051808381526020018281526020019250505060405180910390f35b341561080f57600080fd5b610825600480803590602001909190505061204a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561087257600080fd5b61089e600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050612089565b005b34156108ab57600080fd5b6108e2600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035151590602001909190505061226b565b005b34156108ef57600080fd5b6108f7612617565b604051808215151515815260200191505060405180910390f35b341561091c57600080fd5b610948600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061262a565b005b6109ee600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506128ef565b6040518082815260200191505060405180910390f35b3415610a0f57600080fd5b610a8b600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190505061290d565b005b3415610a9857600080fd5b610aec600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050612a40565b604051808381526020018281526020019250505060405180910390f35b610bad600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050612e8d565b6040518082815260200191505060405180910390f35b3415610bce57600080fd5b610c03600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061310b565b005b3415610c1057600080fd5b610c18613215565b6040518082815260200191505060405180910390f35b3415610c3957600080fd5b610c84600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050613222565b6040518082815260200191505060405180910390f35b3415610ca557600080fd5b610cad613352565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d4c57600080fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610da457600080fd5b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600090505b600580549050811015610fad578173ffffffffffffffffffffffffffffffffffffffff16600582815481101515610e3457fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610fa2576005600160058054905003815481101515610e9357fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600582815481101515610ece57fe5b906000526020600020900160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506005805480919060019003610f2c9190613f4d565b507f483b8090fb9483248853509c7f556286f45c7c554beaa8cd132546f774202a4d826000604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a1610fad565b806001019050610e01565b5050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561100c57600080fd5b80600e60008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008585604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019250505060405180910390206000191660001916815260200190815260200160002060006101000a81548160ff02191690831515021790555073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151561131357801561124a578273ffffffffffffffffffffffffffffffffffffffff1663095ea7b3857f80000000000000000000000000000000000000000000000000000000000000006000604051602001526040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b151561122957600080fd5b6102c65a03f1151561123a57600080fd5b5050506040518051905050611312565b8273ffffffffffffffffffffffffffffffffffffffff1663095ea7b385600080604051602001526040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15156112f557600080fd5b6102c65a03f1151561130657600080fd5b50505060405180519050505b5b7ffec320f49e655894166933e8c35f01cdb484dc623f4fb53441633fbedb78dba884848484604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018215151515815260200194505050505060405180910390a150505050565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61141e613f79565b60078054806020026020016040519081016040528092919081815260200182805480156114a057602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611456575b5050505050905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6114d8613f8d565b600480548060200260200160405190810160405280929190818152602001828054801561155a57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611510575b5050505050905090565b60065481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115c557600080fd5b8273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb82846000604051602001526040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b151561167057600080fd5b6102c65a03f1151561168157600080fd5b50505060405180519050151561169357fe5b7fc7de2d139afb8c4257b3fac58f791fb657180f2f86753ed057e0c3a404f705a3838383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a1505050565b600c5481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561179857600080fd5b600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515156117f157600080fd5b7f483b8090fb9483248853509c7f556286f45c7c554beaa8cd132546f774202a4d816001604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a16001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600580548060010182816118cd9190613fa1565b9160005260206000209001600083909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636432679f836000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515611a3257600080fd5b6102c65a03f11515611a4357600080fd5b505050604051805190509050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611aaf57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515611aeb57600080fd5b7fda7b0a7bc965abdec8a1a995575a891838264c2968e14bd456c5391827b7aa30600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a180600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611c0f57600080fd5b80600d60006101000a81548160ff02191690831515021790555050565b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515611c8857600080fd5b7f60cae9fabd3bef6b015e14f55d6c66df6c507bbacdb16149e2bf7c440690da27600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60086020528060005260406000206000915054906101000a900460ff1681565b611e30613f8d565b6005805480602002602001604051908101604052809291908181526020018280548015611eb257602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611e68575b5050505050905090565b600080600073ffffffffffffffffffffffffffffffffffffffff16600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515611f1d57600080fd5b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663809a9e558686866000604051604001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506040805180830381600087803b151561201d57600080fd5b6102c65a03f1151561202e57600080fd5b5050506040518051906020018051905091509150935093915050565b60078181548110151561205957fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156120e457600080fd5b600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151561213d57600080fd5b7fbadd5a134a60c76befc7e7d53706d47a82ac7037171f88c24a7f70faa2998ef1816001604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a16001600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600480548060010182816122199190613fa1565b9160005260206000209001600083909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156122c857600080fd5b81156123fe57600780548060010182816122e29190613fcd565b9160005260206000209001600085909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506001600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055507f7fb71e76e724c32dea5a20b853f4e3a5878fde6e20ced9c2d40ec3257cb49416836001604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a1612611565b6000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600090505b600780549050811015612610578273ffffffffffffffffffffffffffffffffffffffff1660078281548110151561248e57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561260357600060078054905014156124e957612612565b60078080546001900390816124fe9190613ff9565b81548110151561250a57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660078281548110151561254557fe5b906000526020600020900160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f7fb71e76e724c32dea5a20b853f4e3a5878fde6e20ced9c2d40ec3257cb49416836000604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a1612610565b808060010191505061245b565b5b5b505050565b600d60009054906101000a900460ff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561268757600080fd5b600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156126df57600080fd5b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600090505b6004805490508110156128eb578173ffffffffffffffffffffffffffffffffffffffff1660048281548110151561276f57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156128e05760046001600480549050038154811015156127ce57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660048281548110151561280957fe5b906000526020600020900160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160048181805490500391508161286a9190613f4d565b507fbadd5a134a60c76befc7e7d53706d47a82ac7037171f88c24a7f70faa2998ef1826000604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a16128eb565b80600101905061273c565b5050565b600061290088888888888888612e8d565b9050979650505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561296857600080fd5b84600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600b60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600c81905550806006819055505050505050565b600080600080600080612a51614025565b612a59614025565b60008060008098506000975060009650600780549050955085604051805910612a7f5750595b9080825280602002602001820160405250945085604051805910612aa05750595b90808252806020026020018201604052509350600092505b85831015612d9e57600e6000600785815481101515612ad357fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008f8f604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019250505060405180910390206000191660001916815260200190815260200160002060009054906101000a900460ff161515612bfe57612d91565b600783815481101515612c0d57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637cd442728f8f8f436000604051602001526040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001945050505050602060405180830381600087803b1515612d1f57600080fd5b6102c65a03f11515612d3057600080fd5b505050604051805190508584815181101515612d4857fe5b9060200190602002018181525050888584815181101515612d6557fe5b906020019060200201511115612d90578483815181101515612d8357fe5b9060200190602002015198505b5b8280600101935050612ab8565b6000891115612e765760009150600654612710016127108a02811515612dc057fe5b049050600092505b85831015612e2157808584815181101515612ddf57fe5b90602001906020020151101515612e1457828488806001019950815181101515612e0557fe5b90602001906020020181815250505b8280600101935050612dc8565b6001871115612e415786600143034060019004811515612e3d57fe5b0691505b8382815181101515612e4f57fe5b9060200190602002015197508488815181101515612e6957fe5b9060200190602002015198505b87899a509a50505050505050505050935093915050565b6000806000806000806000600d60009054906101000a900460ff161515612eb357600080fd5b612ebd8e33613222565b9550612ec98c8c613222565b93506000612edc8f8f8f8f8f8f8f613377565b111515612ee557fe5b612eef8e33613222565b9450612efb8c8c613222565b9250858511151515612f0c57600080fd5b838310151515612f1b57600080fd5b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168e73ffffffffffffffffffffffffffffffffffffffff161415612f6c5760129150612ff6565b8d73ffffffffffffffffffffffffffffffffffffffff1663313ce5676000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515612fd857600080fd5b6102c65a03f11515612fe957600080fd5b5050506040518051905091505b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168c73ffffffffffffffffffffffffffffffffffffffff16141561304757601290506130d1565b8b73ffffffffffffffffffffffffffffffffffffffff1663313ce5676000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15156130b357600080fd5b6102c65a03f115156130c457600080fd5b5050506040518051905090505b670de0b6b3a764000082600a0a858503020281600a0a8a8789030202111515156130fa57600080fd5b505050505050979650505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561316657600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f1935050505015156131a657600080fd5b7fc82aba305b4a836b632cf1783a60b69af4f4b88b73d07be6fdf3ee5bfb2c7b358282604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15050565b6000600780549050905090565b600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561328b578173ffffffffffffffffffffffffffffffffffffffff1631905061334c565b8273ffffffffffffffffffffffffffffffffffffffff166370a08231836000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b151561332e57600080fd5b6102c65a03f1151561333f57600080fd5b5050506040518051905090505b92915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000806000806000600c543a1115151561339357600080fd5b600073ffffffffffffffffffffffffffffffffffffffff16600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515156133f157600080fd5b600073ffffffffffffffffffffffffffffffffffffffff16600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415151561344f57600080fd5b6134598e8e613789565b151561346457600080fd5b61346f8e8d8f612a40565b809650819750505060078681548110151561348657fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1693506000851115156134c057fe5b620f4240670de0b6b3a764000002851015156134d857fe5b8885101515156134e457fe5b8c92506134f38e8d858861391a565b91508982111561350f5789915061350c8e8d8488613942565b92505b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168e73ffffffffffffffffffffffffffffffffffffffff16141561355f57829050613563565b8190505b61356c3361196b565b811115151561357a57600080fd5b61358b8e848e8e86898b600161396a565b151561359357fe5b600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663fd062d3b82868b6000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019350505050602060405180830381600087803b151561369457600080fd5b6102c65a03f115156136a557600080fd5b5050506040518051905015156136b757fe5b3373ffffffffffffffffffffffffffffffffffffffff167fec0d3e799aa270a144d7e3be084ccfc657450e33ecea1b1a4154c95cedaae5c38f8e8686604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200194505050505060405180910390a2819650505050505050979650505050505050565b60006b204fce5e3e25026110000000821015156137a557600080fd5b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156138005781341415156137fb57600080fd5b613910565b60003414151561380f57600080fd5b818373ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306000604051602001526040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b15156138e757600080fd5b6102c65a03f115156138f857600080fd5b505050604051805190501015151561390f57600080fd5b5b6001905092915050565b60006139388361392987613d75565b61393287613d75565b85613e57565b9050949350505050565b60006139608361395187613d75565b61395a87613d75565b85613ed2565b9050949350505050565b6000806000905073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff1614156139c157889050613abd565b8973ffffffffffffffffffffffffffffffffffffffff166323b872dd33308c6000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b1515613aa057600080fd5b6102c65a03f11515613ab157600080fd5b50505060405180519050505b8473ffffffffffffffffffffffffffffffffffffffff16636cf69811828c8c8c308a8a6000604051602001526040518863ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018215151515815260200196505050505050506020604051808303818588803b1515613be457600080fd5b6125ee5a03f11515613bf557600080fd5b50505050604051805190501515613c0857fe5b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff161415613c95578673ffffffffffffffffffffffffffffffffffffffff166108fc879081150290604051600060405180830381858888f193505050501515613c9057600080fd5b613d64565b8773ffffffffffffffffffffffffffffffffffffffff1663a9059cbb88886000604051602001526040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b1515613d4057600080fd5b6102c65a03f11515613d5157600080fd5b505050604051805190501515613d6357fe5b5b600191505098975050505050505050565b600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415613dc85760129050613e52565b8173ffffffffffffffffffffffffffffffffffffffff1663313ce5676000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515613e3457600080fd5b6102c65a03f11515613e4557600080fd5b5050506040518051905090505b919050565b60008383101515613e9857601284840311151515613e7457600080fd5b670de0b6b3a7640000848403600a0a83870202811515613e9057fe5b049050613eca565b601283850311151515613eaa57600080fd5b828403600a0a670de0b6b3a764000002828602811515613ec657fe5b0490505b949350505050565b60008284101515613f1357601283850311151515613eef57600080fd5b81838503600a0a86670de0b6b3a76400000202811515613f0b57fe5b049050613f45565b601284840311151515613f2557600080fd5b838303600a0a820285670de0b6b3a764000002811515613f4157fe5b0490505b949350505050565b815481835581811511613f7457818360005260206000209182019101613f739190614039565b5b505050565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b815481835581811511613fc857818360005260206000209182019101613fc79190614039565b5b505050565b815481835581811511613ff457818360005260206000209182019101613ff39190614039565b5b505050565b8154818355818115116140205781836000526020600020918201910161401f9190614039565b5b505050565b602060405190810160405280600081525090565b61405b91905b8082111561405757600081600090555060010161403f565b5090565b905600a165627a7a723058203a87ef3514d67149d017675828e12a3af8e4226db5310773ae91067d65188de80029000000000000000000000000bf3a8018427994b1c9f5bede3e0efa7954c50efc';

// constants
export const EPSILON = 1000;
export const RATE_EPSILON = 0.002;
export const ETHER_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const ETH = 'ETH';

// ropsten
export const KYBER_NETWORK_ADDRESS = '0x65b1faad1b4d331fd0ea2a50d5be2c20abe42e50';
export const TRADE_TOPIC = '0xec0d3e799aa270a144d7e3be084ccfc657450e33ecea1b1a4154c95cedaae5c3';
export const INIT_EXCHANGE_FORM_STATE = {
  advanced: false,
  isCrossSend: false,
  selectedAccount: '',
  sourceToken: ETHER_ADDRESS,
  sourceTokenSymbol: 'ETH',
  sourceAmount: 0,
  destToken: '',
  destTokenSymbol: '',
  minConversionRate: 0,
  destAddress: '',
  minDestAmount: 0,
  maxDestAmount: (new BigNumber(2)).pow(255).toString(10),
  offeredRateExpiryBlock: 0,
  offeredRateBalance: 0,
  offeredRate: 0,
  throwOnFailure: false,
  gas: 1000000,
  gasPrice: 20,
  step: 1,
  broadcasting: true,
  bcError: '',
  txHash: '',
  errors: {
    selectedAccountError: '',
    destAddressError: '',
    sourceTokenError: '',
    sourceAmountError: '',
    destTokenError: '',
    maxDestAmountError: '',
    minDestAmountError: '',
    gasPriceError: '',
    gasError: '',
    passwordError: '',
  },
};

// reserves
export const RESERVES = [{ index: 0, name: 'Olympus && Kyber official reserve' }];

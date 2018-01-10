'use strict';

import '../../shim.js'
import WalletService from "./Wallet";

var ws = null;
var address = null;

class WebSocketService {

  constructor() {
  }

  static myInstance = null;

  static getInstance(addr) {
    if (this.myInstance == null) {
      this.myInstance = new WebSocketService();
    }
    address = addr;
    return this.myInstance;
  }
  connect() {
      ws = new WebSocket('wss://socket.etherscan.io/wshandler');
      ws.onopen = () => {
          console.log("connect socket node");
          ws.send(JSON.stringify({"event": "txlist", "address": "0x2a65aca4d5fc5b5c859090a6c34d164135398226"}));

          this.intervalID = setInterval(()=>{
              ws.send(JSON.stringify({"event": "ping"}));
              console.log("heartbeat");
          }, 20000);

      }
      ws.onmessage = (e) => {
          console.log(e.data);
      }


  }


  invalidateTimer () {
        window.clearInterval(this.intervalID);
  }
}

export default WebSocketService;

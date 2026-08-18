const PEERJS_CDN = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js';

async function loadPeerJs(){
  if(globalThis.Peer) return globalThis.Peer;
  await new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-peerjs]');
    if(existing){ existing.addEventListener('load',resolve,{once:true}); existing.addEventListener('error',reject,{once:true}); return; }
    const s=document.createElement('script'); s.src=PEERJS_CDN; s.async=true; s.dataset.peerjs='1'; s.onload=resolve; s.onerror=()=>reject(new Error('Could not load the PeerJS transport.'));
    document.head.appendChild(s);
  });
  if(!globalThis.Peer) throw new Error('PeerJS did not initialize.');
  return globalThis.Peer;
}

function normalizeRoomCode(value){ return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6); }
function createRoomCode(){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code='';
  crypto.getRandomValues(new Uint32Array(6)).forEach(v=>code+=alphabet[v%alphabet.length]);
  return code;
}
function hostPeerId(code){ return `frontiers-v1-${normalizeRoomCode(code).toLowerCase()}`; }
function getClientToken(){
  const key='frontiers-client-token';
  let token=localStorage.getItem(key);
  if(!token){ token=crypto.randomUUID(); localStorage.setItem(key,token); }
  return token;
}

class FrontiersNetwork {
  constructor(){ this.peer=null; this.connections=new Map(); this.hostConnection=null; this.role='offline'; this.roomCode=null; this.onStatus=()=>{}; this.onState=()=>{}; this.onCommand=()=>{}; this.onJoin=()=>{}; this.onDisconnect=()=>{}; }
  async host(code,{onCommand,onJoin,onDisconnect,onStatus}={}){
    const Peer=await loadPeerJs(); this.role='host'; this.roomCode=normalizeRoomCode(code)||createRoomCode();
    this.onCommand=onCommand||(()=>{}); this.onJoin=onJoin||(()=>{}); this.onDisconnect=onDisconnect||(()=>{}); this.onStatus=onStatus||(()=>{});
    this.peer=new Peer(hostPeerId(this.roomCode));
    return new Promise((resolve,reject)=>{
      this.peer.on('open',()=>{this.onStatus({kind:'open',roomCode:this.roomCode});resolve(this.roomCode);});
      this.peer.on('connection',conn=>this.#accept(conn));
      this.peer.on('error',err=>{this.onStatus({kind:'error',error:err});reject(err);});
    });
  }
  #accept(conn){
    let token=null;
    conn.on('data',payload=>{
      if(payload?.type==='join'){
        token=String(payload.token||'').slice(0,128);
        if(!token){ this.onStatus({kind:'connection-error',error:new Error('Missing reconnect token.')}); return; }
        const previous=this.connections.get(token);
        this.connections.set(token,conn);
        if(previous&&previous!==conn){ try{previous.close();}catch{} }
        this.onJoin({token,name:String(payload.name||'Guest').slice(0,24),conn}); return;
      }
      if(payload?.type==='command'&&token) this.onCommand({token,command:payload.command,conn});
    });
    conn.on('close',()=>{if(token&&this.connections.get(token)===conn){this.connections.delete(token);this.onDisconnect({token});}});
    conn.on('error',error=>this.onStatus({kind:'connection-error',error,token}));
  }
  async join(code,name,{onState,onStatus}={}){
    const Peer=await loadPeerJs(); this.role='guest'; this.roomCode=normalizeRoomCode(code); this.onState=onState||(()=>{}); this.onStatus=onStatus||(()=>{});
    this.peer=new Peer();
    return new Promise((resolve,reject)=>{
      this.peer.on('open',()=>{
        const conn=this.peer.connect(hostPeerId(this.roomCode),{reliable:true}); this.hostConnection=conn;
        conn.on('open',()=>{conn.send({type:'join',token:getClientToken(),name});this.onStatus({kind:'open',roomCode:this.roomCode});resolve(this.roomCode);});
        conn.on('data',payload=>{if(payload?.type==='state')this.onState(payload.state);if(payload?.type==='notice')this.onStatus({kind:'notice',message:payload.message});});
        conn.on('close',()=>this.onStatus({kind:'closed'})); conn.on('error',error=>this.onStatus({kind:'connection-error',error}));
      });
      this.peer.on('error',err=>{this.onStatus({kind:'error',error:err});reject(err);});
    });
  }
  broadcastState(state){ if(this.role!=='host')return; for(const conn of this.connections.values()){if(conn.open)conn.send({type:'state',state});} }
  sendStateTo(token,state){ const conn=this.connections.get(token); if(conn?.open)conn.send({type:'state',state}); }
  sendNotice(token,message){ const conn=this.connections.get(token); if(conn?.open)conn.send({type:'notice',message}); }
  sendCommand(command){ if(this.role==='guest'&&this.hostConnection?.open)this.hostConnection.send({type:'command',command}); }
  close(){ try{this.hostConnection?.close();this.peer?.destroy();}catch{} this.connections.clear(); this.role='offline'; }
}

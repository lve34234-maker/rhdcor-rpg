const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

function getAllWeapons() {
  return [
    { id: 'sword_1', name: '녹슨 검', type: 'sword', atk: 10, grade: 'F', enhance: 0, price: 100 },
    { id: 'sword_2', name: '강철 검', type: 'sword', atk: 30, grade: 'D', enhance: 0, price: 300 },
    { id: 'sword_3', name: '미스릴 검', type: 'sword', atk: 70, grade: 'C', enhance: 0, price: 800 },
    { id: 'sword_4', name: '드래곤 검', type: 'sword', atk: 150, grade: 'B', enhance: 0, price: 2000 },
    { id: 'sword_5', name: '전설의 검', type: 'sword', atk: 300, grade: 'A', enhance: 0, price: 5000 },
    { id: 'sword_6', name: '신성의 검', type: 'sword', atk: 600, grade: 'S', enhance: 0, price: 15000 },
    { id: 'axe_1', name: '나무 도끼', type: 'axe', atk: 12, grade: 'F', enhance: 0, price: 120 },
    { id: 'axe_2', name: '전투 도끼', type: 'axe', atk: 35, grade: 'D', enhance: 0, price: 350 },
    { id: 'axe_3', name: '오크 도끼', type: 'axe', atk: 80, grade: 'C', enhance: 0, price: 900 },
    { id: 'axe_4', name: '화염 도끼', type: 'axe', atk: 170, grade: 'B', enhance: 0, price: 2200 },
    { id: 'axe_5', name: '용암 도끼', type: 'axe', atk: 350, grade: 'A', enhance: 0, price: 5500 },
    { id: 'axe_6', name: '파괴의 도끼', type: 'axe', atk: 700, grade: 'S', enhance: 0, price: 18000 },
    { id: 'bow_1', name: '나무 활', type: 'bow', atk: 8, grade: 'F', enhance: 0, price: 80 },
    { id: 'bow_2', name: '장거리 활', type: 'bow', atk: 28, grade: 'D', enhance: 0, price: 280 },
    { id: 'bow_3', name: '요정의 활', type: 'bow', atk: 65, grade: 'C', enhance: 0, price: 750 },
    { id: 'bow_4', name: '달빛 활', type: 'bow', atk: 140, grade: 'B', enhance: 0, price: 1900 },
    { id: 'bow_5', name: '천둥 활', type: 'bow', atk: 280, grade: 'A', enhance: 0, price: 4800 },
    { id: 'bow_6', name: '신궁의 활', type: 'bow', atk: 580, grade: 'S', enhance: 0, price: 14000 },
    { id: 'staff_1', name: '나무 지팡이', type: 'staff', atk: 15, grade: 'F', enhance: 0, price: 150 },
    { id: 'staff_2', name: '마법 지팡이', type: 'staff', atk: 40, grade: 'D', enhance: 0, price: 400 },
    { id: 'staff_3', name: '수정 지팡이', type: 'staff', atk: 90, grade: 'C', enhance: 0, price: 1000 },
    { id: 'staff_4', name: '드래곤 지팡이', type: 'staff', atk: 190, grade: 'B', enhance: 0, price: 2500 },
    { id: 'staff_5', name: '대마법사 지팡이', type: 'staff', atk: 380, grade: 'A', enhance: 0, price: 6000 },
    { id: 'staff_6', name: '신화의 지팡이', type: 'staff', atk: 760, grade: 'S', enhance: 0, price: 20000 },
    { id: 'dagger_1', name: '작은 단검', type: 'dagger', atk: 9, grade: 'F', enhance: 0, price: 90 },
    { id: 'dagger_2', name: '독 단검', type: 'dagger', atk: 32, grade: 'D', enhance: 0, price: 320 },
    { id: 'dagger_3', name: '암살자 단검', type: 'dagger', atk: 72, grade: 'C', enhance: 0, price: 850 },
    { id: 'dagger_4', name: '그림자 단검', type: 'dagger', atk: 155, grade: 'B', enhance: 0, price: 2100 },
    { id: 'dagger_5', name: '죽음의 단검', type: 'dagger', atk: 310, grade: 'A', enhance: 0, price: 5200 },
    { id: 'dagger_6', name: '운명의 단검', type: 'dagger', atk: 620, grade: 'S', enhance: 0, price: 16000 },
    { id: 'spear_1', name: '목창', type: 'spear', atk: 11, grade: 'F', enhance: 0, price: 110 },
    { id: 'spear_2', name: '철창', type: 'spear', atk: 33, grade: 'D', enhance: 0, price: 330 },
    { id: 'spear_3', name: '기사의 창', type: 'spear', atk: 75, grade: 'C', enhance: 0, price: 870 },
    { id: 'spear_4', name: '성스러운 창', type: 'spear', atk: 160, grade: 'B', enhance: 0, price: 2100 },
    { id: 'spear_5', name: '번개 창', type: 'spear', atk: 320, grade: 'A', enhance: 0, price: 5300 },
    { id: 'spear_6', name: '신의 창', type: 'spear', atk: 640, grade: 'S', enhance: 0, price: 17000 },
    { id: 'hammer_1', name: '나무 망치', type: 'hammer', atk: 14, grade: 'F', enhance: 0, price: 140 },
    { id: 'hammer_2', name: '철 망치', type: 'hammer', atk: 42, grade: 'D', enhance: 0, price: 420 },
    { id: 'hammer_3', name: '거인 망치', type: 'hammer', atk: 95, grade: 'C', enhance: 0, price: 1100 },
    { id: 'hammer_4', name: '지진 망치', type: 'hammer', atk: 200, grade: 'B', enhance: 0, price: 2700 },
    { id: 'hammer_5', name: '파괴자 망치', type: 'hammer', atk: 400, grade: 'A', enhance: 0, price: 6500 },
    { id: 'hammer_6', name: '신계의 망치', type: 'hammer', atk: 800, grade: 'S', enhance: 0, price: 22000 },
  ];
}

function getAllArmors() {
  return [
    { id: 'armor_1', name: '천 갑옷', type: 'light', def: 5, grade: 'F', enhance: 0, price: 80 },
    { id: 'armor_2', name: '가죽 갑옷', type: 'light', def: 20, grade: 'D', enhance: 0, price: 250 },
    { id: 'armor_3', name: '체인 갑옷', type: 'medium', def: 50, grade: 'C', enhance: 0, price: 700 },
    { id: 'armor_4', name: '강철 갑옷', type: 'heavy', def: 110, grade: 'B', enhance: 0, price: 1800 },
    { id: 'armor_5', name: '드래곤 갑옷', type: 'heavy', def: 230, grade: 'A', enhance: 0, price: 4500 },
    { id: 'armor_6', name: '신화의 갑옷', type: 'divine', def: 480, grade: 'S', enhance: 0, price: 12000 },
    { id: 'robe_1', name: '낡은 로브', type: 'robe', def: 3, grade: 'F', enhance: 0, price: 60 },
    { id: 'robe_2', name: '마법사 로브', type: 'robe', def: 15, grade: 'D', enhance: 0, price: 200 },
    { id: 'robe_3', name: '원소의 로브', type: 'robe', def: 40, grade: 'C', enhance: 0, price: 600 },
    { id: 'robe_4', name: '대현자 로브', type: 'robe', def: 90, grade: 'B', enhance: 0, price: 1600 },
    { id: 'robe_5', name: '별빛 로브', type: 'robe', def: 190, grade: 'A', enhance: 0, price: 4000 },
    { id: 'robe_6', name: '우주의 로브', type: 'divine', def: 400, grade: 'S', enhance: 0, price: 11000 },
  ];
}

// ===== 관리자 계정 하드코딩 =====
const ADMIN_ID = 'admin';
const ADMIN_PW = 'dlgustjr!@34';

function createNewUser(username, password) {
  return {
    username,
    password,
    isAdmin: username === ADMIN_ID,
    level: 1,
    exp: 0,
    gold: 500,
    gems: 10,
    attack: 10,
    defense: 5,
    hp: 100,
    maxHp: 100,
    weapons: username === 'admin' ? getAllWeapons() : [],
    armors: username === 'admin' ? getAllArmors() : [],
    equippedWeapon: null,
    equippedArmor: null,
    unlockedStage: username === 'admin' ? 9999 : 1,
    friends: [],
    friendRequests: [],
    inventory: [],
    craftRecipes: []
  };
}

function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) {
    const admin = createNewUser(ADMIN_ID, ADMIN_PW);
    const initial = { admin };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    // 관리자 계정 항상 최신 비밀번호로 강제 업데이트
    if (data[ADMIN_ID]) {
      data[ADMIN_ID].password = ADMIN_PW;
      data[ADMIN_ID].isAdmin = true;
    } else {
      data[ADMIN_ID] = createNewUser(ADMIN_ID, ADMIN_PW);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

let users = loadUsers();
// Auto-save every 30s
setInterval(() => saveUsers(users), 30000);

// API Routes
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ ok: false, msg: '아이디와 비밀번호를 입력하세요.' });
  if (users[username]) return res.json({ ok: false, msg: '이미 존재하는 아이디입니다.' });
  if (username.length < 3) return res.json({ ok: false, msg: '아이디는 3자 이상이어야 합니다.' });
  users[username] = createNewUser(username, password);
  saveUsers(users);
  res.json({ ok: true, user: sanitize(users[username]) });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // 관리자 하드코딩 검증
  if (username === ADMIN_ID && password !== ADMIN_PW) {
    return res.json({ ok: false, msg: '비밀번호가 틀렸습니다.' });
  }
  const user = users[username];
  if (!user) return res.json({ ok: false, msg: '존재하지 않는 아이디입니다.' });
  if (user.password !== password) return res.json({ ok: false, msg: '비밀번호가 틀렸습니다.' });
  res.json({ ok: true, user: sanitize(user) });
});

app.post('/api/save', (req, res) => {
  const { username, password, data } = req.body;
  const user = users[username];
  if (!user || user.password !== password) return res.json({ ok: false, msg: 'Auth failed' });
  Object.assign(users[username], data);
  saveUsers(users);
  res.json({ ok: true });
});

app.get('/api/users', (req, res) => {
  const list = Object.keys(users).map(u => ({ username: u, level: users[u].level, isAdmin: users[u].isAdmin }));
  res.json(list);
});

app.get('/api/user/:name', (req, res) => {
  const u = users[req.params.name];
  if (!u) return res.json({ ok: false });
  res.json({ ok: true, user: sanitize(u) });
});

app.post('/api/admin/setuser', (req, res) => {
  const { adminUser, adminPass, target, field, value } = req.body;
  // 요청한 사람이 어드민인지 확인 (어느 어드민이든 가능)
  const requester = adminUser ? users[adminUser] : users['admin'];
  if (!requester || !requester.isAdmin || requester.password !== adminPass) {
    return res.json({ ok: false, msg: '권한 없음' });
  }
  if (!users[target]) return res.json({ ok: false, msg: 'User not found' });
  users[target][field] = value;
  saveUsers(users);
  res.json({ ok: true });
});

app.post('/api/admin/makeadmin', (req, res) => {
  const { adminUser, adminPass, target, grant } = req.body;
  const requester = adminUser ? users[adminUser] : users['admin'];
  if (!requester || !requester.isAdmin || requester.password !== adminPass) {
    return res.json({ ok: false, msg: '권한 없음' });
  }
  if (!users[target]) return res.json({ ok: false, msg: '유저 없음' });
  users[target].isAdmin = grant ? true : false;
  saveUsers(users);
  res.json({ ok: true });
});

function sanitize(u) {
  const { password, ...rest } = u;
  return rest;
}

// Server setup
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Online players
const clients = new Map(); // ws -> { username }
const chatHistory = { global: [], guild: [], party: [], trade: [] };
const parties = {}; // partyId -> { id, name, leader, members, stageId }

function getUserParty(username) {
  return Object.values(parties).find(p => p.members.includes(username)) || null;
}

function getStageUsers(stageId, excludeUsername) {
  const result = [];
  for (const [, info] of clients) {
    if (info.stageId === stageId && info.username !== excludeUsername) {
      result.push(info.username);
    }
  }
  return result;
}

function broadcastToStage(stageId, msg, excludeUsername) {
  for (const [ws, info] of clients) {
    if (info.stageId === stageId && info.username !== excludeUsername) {
      try { ws.send(JSON.stringify(msg)); } catch(e) {}
    }
  }
}

function broadcastPartyList() {
  const openParties = Object.values(parties).filter(p => p.members.length < 3);
  broadcast({ type: 'party_list', parties: openParties });
}

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      handleWS(ws, msg);
    } catch(e) {}
  });
  ws.on('close', () => {
    const info = clients.get(ws);
    if (info) {
      const { username, stageId } = info;
      // 스테이지에서 나감 알림
      if (stageId) {
        broadcastToStage(stageId, { type: 'stage_user_left', username, stageId }, username);
      }
      // 파티에서 제거
      const party = getUserParty(username);
      if (party) {
        party.members = party.members.filter(m => m !== username);
        if (party.members.length === 0 || party.leader === username) {
          party.members.forEach(m => sendToUser(m, { type: 'party_disbanded' }));
          delete parties[party.id];
        } else {
          party.leader = party.members[0];
          party.members.forEach(m => sendToUser(m, { type: 'party_update', party }));
        }
      }
      clients.delete(ws);
      broadcast({ type: 'online', users: getOnlineUsers() });
    }
  });
});

function handleWS(ws, msg) {
  if (msg.type === 'auth') {
    const u = users[msg.username];
    if (u && u.password === msg.password) {
      clients.set(ws, { username: msg.username, stageId: null });
      ws.send(JSON.stringify({ type: 'auth_ok', user: sanitize(u) }));
      broadcast({ type: 'online', users: getOnlineUsers() });
      // Send recent chat history
      ws.send(JSON.stringify({ type: 'history', history: chatHistory }));
    }
    return;
  }

  const info = clients.get(ws);
  if (!info) return;
  const { username } = info;
  const user = users[username];

  if (msg.type === 'chat') {
    const channel = msg.channel || 'global';
    const text = msg.text?.trim();
    if (!text) return;

    // Check for admin commands
    if (user?.isAdmin && text.startsWith('/')) {
      handleAdminCommand(ws, username, text, msg.channel);
      return;
    }

    const chatMsg = {
      type: 'chat',
      channel,
      username,
      text,
      isAdmin: user?.isAdmin || false,
      ts: Date.now()
    };
    if (!chatHistory[channel]) chatHistory[channel] = [];
    chatHistory[channel].push(chatMsg);
    if (chatHistory[channel].length > 100) chatHistory[channel].shift();
    broadcastChannel(channel, chatMsg);
    return;
  }

  if (msg.type === 'friend_request') {
    const target = users[msg.target];
    if (!target) { ws.send(JSON.stringify({ type: 'error', msg: '존재하지 않는 유저입니다.' })); return; }
    if (!target.friendRequests) target.friendRequests = [];
    if (target.friends?.includes(username)) { ws.send(JSON.stringify({ type: 'error', msg: '이미 친구입니다.' })); return; }
    target.friendRequests.push(username);
    saveUsers(users);
    ws.send(JSON.stringify({ type: 'system', msg: `${msg.target}에게 친구 요청을 보냈습니다.` }));
    // Notify target if online
    sendToUser(msg.target, { type: 'friend_request_received', from: username });
    return;
  }

  if (msg.type === 'friend_accept') {
    const requester = msg.from;
    if (!user.friendRequests?.includes(requester)) return;
    user.friendRequests = user.friendRequests.filter(r => r !== requester);
    if (!user.friends) user.friends = [];
    if (!users[requester].friends) users[requester].friends = [];
    user.friends.push(requester);
    users[requester].friends.push(username);
    saveUsers(users);
    ws.send(JSON.stringify({ type: 'friend_list', friends: user.friends, requests: user.friendRequests }));
    sendToUser(requester, { type: 'system', msg: `${username}님이 친구 요청을 수락했습니다.` });
    return;
  }

  if (msg.type === 'friend_delete') {
    user.friends = (user.friends || []).filter(f => f !== msg.target);
    if (users[msg.target]) users[msg.target].friends = (users[msg.target].friends || []).filter(f => f !== username);
    saveUsers(users);
    ws.send(JSON.stringify({ type: 'friend_list', friends: user.friends, requests: user.friendRequests || [] }));
    return;
  }

  if (msg.type === 'save_game') {
    const allowed = ['level','exp','gold','gems','attack','defense','hp','maxHp','weapons','armors',
      'equippedWeapon','equippedArmor','unlockedStage','inventory'];
    for (const k of allowed) {
      if (msg.data[k] !== undefined) users[username][k] = msg.data[k];
    }
    saveUsers(users);
    ws.send(JSON.stringify({ type: 'save_ok' }));
    return;
  }

  // ====== 파티 시스템 ======
  if (msg.type === 'party_list_request') {
    const openParties = Object.values(parties).filter(p => p.members.length < 3);
    ws.send(JSON.stringify({ type: 'party_list', parties: openParties }));
    return;
  }

  if (msg.type === 'party_create') {
    if (getUserParty(username)) {
      ws.send(JSON.stringify({ type: 'system', msg: '이미 파티에 속해 있습니다.' }));
      return;
    }
    const partyId = 'party_' + Date.now();
    parties[partyId] = { id: partyId, name: msg.name, leader: username, members: [username] };
    ws.send(JSON.stringify({ type: 'party_update', party: parties[partyId] }));
    ws.send(JSON.stringify({ type: 'system', msg: `파티 [${msg.name}] 생성 완료!` }));
    broadcastPartyList();
    return;
  }

  if (msg.type === 'party_join') {
    const party = parties[msg.partyId];
    if (!party) { ws.send(JSON.stringify({ type: 'system', msg: '파티를 찾을 수 없습니다.' })); return; }
    if (party.members.length >= 3) { ws.send(JSON.stringify({ type: 'system', msg: '파티가 가득 찼습니다.' })); return; }
    if (getUserParty(username)) { ws.send(JSON.stringify({ type: 'system', msg: '이미 파티에 속해 있습니다.' })); return; }
    party.members.push(username);
    const memberSlot = party.members.indexOf(username);
    // 모든 파티원에게 업데이트
    party.members.forEach(m => sendToUser(m, { type: 'party_update', party }));
    ws.send(JSON.stringify({ type: 'system', msg: `파티 [${party.name}] 참가 완료!` }));
    // 파티가 이미 전투 중이면 즉시 해당 전장으로 순간이동
    if (party.inBattle && party.stageId) {
      ws.send(JSON.stringify({
        type: 'party_battle_start',
        party,
        stageId: party.stageId,
        memberSlot,
        wave: party.currentWave || 1,
        instant: true  // 순간이동 플래그
      }));
      ws.send(JSON.stringify({ type: 'system', msg: `⚡ 전투 중인 파티에 합류! 스테이지 ${party.stageId}` }));
    }
    broadcastPartyList();
    return;
  }

  if (msg.type === 'party_leave') {
    const party = getUserParty(username);
    if (!party) return;
    party.members = party.members.filter(m => m !== username);
    if (party.members.length === 0 || party.leader === username) {
      // 파티 해산
      party.members.forEach(m => sendToUser(m, { type: 'party_disbanded' }));
      delete parties[party.id];
    } else {
      // 새 리더 지정
      party.leader = party.members[0];
      party.members.forEach(m => sendToUser(m, { type: 'party_update', party }));
    }
    ws.send(JSON.stringify({ type: 'party_disbanded' }));
    broadcastPartyList();
    return;
  }

  if (msg.type === 'party_kick') {
    const party = getUserParty(username);
    if (!party || party.leader !== username) return;
    party.members = party.members.filter(m => m !== msg.target);
    sendToUser(msg.target, { type: 'party_kicked' });
    party.members.forEach(m => sendToUser(m, { type: 'party_update', party }));
    broadcastPartyList();
    return;
  }

  if (msg.type === 'party_start_battle') {
    const party = getUserParty(username);
    if (!party || party.leader !== username) return;
    party.stageId = msg.stageId;
    party.inBattle = true;
    party.currentWave = 1;
    party.members.forEach((m, i) => {
      sendToUser(m, { type: 'party_battle_start', party, stageId: msg.stageId, memberSlot: i, wave: 1 });
    });
    return;
  }

  if (msg.type === 'party_wave_update') {
    // 파티장이 웨이브 진행 상황 서버에 알림
    const party = getUserParty(username);
    if (party && party.leader === username) {
      party.currentWave = msg.wave;
    }
    return;
  }

  if (msg.type === 'party_battle_end') {
    const party = getUserParty(username);
    if (party && party.leader === username) {
      party.inBattle = false;
      party.currentWave = 1;
    }
    return;
  }

  if (msg.type === 'party_battle_action') {
    const party = getUserParty(username);
    if (!party) return;
    // 파티원들에게 전투 액션 브로드캐스트
    party.members.forEach(m => {
      if (m !== username) sendToUser(m, { type: 'party_battle_sync', username, ...msg });
    });
    return;
  }

  // ====== 같은 스테이지 유저 표시 ======
  if (msg.type === 'stage_enter') {
    const info = clients.get(ws);
    if (!info) return;
    info.stageId = msg.stageId;
    // 이 스테이지에 있는 다른 유저 목록 수집
    const stageUsers = getStageUsers(msg.stageId, username);
    // 나한테: 이미 여기 있는 유저 목록 전송
    ws.send(JSON.stringify({ type: 'stage_users', stageId: msg.stageId, users: stageUsers }));
    // 다른 유저들한테: 내가 들어왔다고 알림
    broadcastToStage(msg.stageId, { type: 'stage_user_joined', username, stageId: msg.stageId }, username);
    return;
  }

  if (msg.type === 'stage_leave') {
    const info = clients.get(ws);
    if (!info) return;
    const prevStage = info.stageId;
    info.stageId = null;
    if (prevStage) {
      broadcastToStage(prevStage, { type: 'stage_user_left', username, stageId: prevStage }, username);
    }
    return;
  }

  // ====== VILLAGE ======
  if (msg.type === 'village_enter') {
    const info = clients.get(ws);
    if (!info) return;
    info.inVillage = true;
    info.villageX = msg.x || 50;
    info.villageY = msg.y || 60;
    info.heroClass = msg.heroClass || 0;
    // Send current village players to newcomer
    const villagers = [];
    for (const [, ci] of clients) {
      if (ci.inVillage && ci.username !== username) {
        villagers.push({ username: ci.username, x: ci.villageX, y: ci.villageY, heroClass: ci.heroClass || 0 });
      }
    }
    ws.send(JSON.stringify({ type: 'village_players', players: villagers }));
    // Announce arrival
    for (const [ow, oi] of clients) {
      if (oi.inVillage && oi.username !== username) {
        ow.send(JSON.stringify({ type: 'village_player_join', username, x: info.villageX, y: info.villageY, heroClass: info.heroClass }));
      }
    }
    return;
  }

  if (msg.type === 'village_move') {
    const info = clients.get(ws);
    if (!info || !info.inVillage) return;
    info.villageX = msg.x;
    info.villageY = msg.y;
    for (const [ow, oi] of clients) {
      if (oi.inVillage && oi.username !== username) {
        ow.send(JSON.stringify({ type: 'village_player_move', username, x: msg.x, y: msg.y }));
      }
    }
    return;
  }

  if (msg.type === 'village_leave') {
    const info = clients.get(ws);
    if (!info) return;
    info.inVillage = false;
    for (const [ow, oi] of clients) {
      if (oi.inVillage && oi.username !== username) {
        ow.send(JSON.stringify({ type: 'village_player_leave', username }));
      }
    }
    return;
  }
}

function handleAdminCommand(ws, username, text, channel) {
  const ch = channel || 'global';
  const broadcastMsg = (msg) => {
    const chatMsg = { type: 'chat', channel: ch, username: '[관리자]', text: msg, isAdmin: true, ts: Date.now(), isSystem: true };
    broadcastChannel(ch, chatMsg);
  };

  // /kill @a or /kill <name>
  if (text.startsWith('/kill')) {
    const target = text.replace('/kill', '').trim();
    if (target === '@a' || target === '모두') {
      broadcastMsg('⚔️ 관리자가 모든 몬스터를 처치했습니다!');
      broadcast({ type: 'admin_kill', target: 'monsters' });
    } else if (target === '@s' || target === 'me') {
      broadcastMsg('💀 관리자가 자신을 처치했습니다!');
    } else if (target === '@p') {
      const online = getOnlineUsers().filter(u => u !== username);
      const random = online[Math.floor(Math.random() * online.length)];
      if (random) {
        sendToUser(random, { type: 'admin_kill', target: 'player', username: random });
        broadcastMsg(`💀 ${random}님이 관리자에 의해 처치되었습니다!`);
      }
    } else if (target.startsWith('@')) {
      const tname = target.slice(1);
      sendToUser(tname, { type: 'admin_kill', target: 'player', username: tname });
      broadcastMsg(`💀 ${tname}님이 관리자에 의해 처치되었습니다!`);
    } else {
      sendToUser(target, { type: 'admin_kill', target: 'player', username: target });
      broadcastMsg(`💀 ${target}님이 관리자에 의해 처치되었습니다!`);
    }
    return;
  }

  // /give <player> <item>
  if (text.startsWith('/give')) {
    const parts = text.split(' ');
    let playerTarget = parts[1] || '';
    const itemName = parts.slice(2).join(' ');

    let targets = [];
    if (playerTarget === '@a' || playerTarget === '모두') targets = getOnlineUsers();
    else if (playerTarget === '@p') { const o = getOnlineUsers(); targets = [o[Math.floor(Math.random()*o.length)]]; }
    else if (playerTarget === '@s' || playerTarget === 'me') targets = [username];
    else if (playerTarget.startsWith('@')) targets = [playerTarget.slice(1)];
    else targets = [playerTarget];

    const allItems = [...getAllWeapons(), ...getAllArmors()];
    const item = allItems.find(i => i.name === itemName || i.id === itemName);

    for (const t of targets) {
      if (users[t]) {
        if (item) {
          const isWeapon = item.hasOwnProperty('atk');
          if (isWeapon) { if (!users[t].weapons) users[t].weapons = []; users[t].weapons.push({...item}); }
          else { if (!users[t].armors) users[t].armors = []; users[t].armors.push({...item}); }
          sendToUser(t, { type: 'item_received', item, username });
          broadcastMsg(`🎁 ${t}에게 [${item.name}]을 지급했습니다!`);
        } else {
          ws.send(JSON.stringify({ type: 'system', msg: `아이템을 찾을 수 없습니다: ${itemName}` }));
        }
      }
    }
    saveUsers(users);
    return;
  }

  // /gold <player> <amount>
  if (text.startsWith('/gold')) {
    const parts = text.split(' ');
    const t = parts[1];
    const amount = parseInt(parts[2]) || 0;
    if (users[t]) { users[t].gold = (users[t].gold || 0) + amount; saveUsers(users); broadcastMsg(`💰 ${t}에게 골드 ${amount}를 지급했습니다!`); sendToUser(t, { type: 'stat_update', field: 'gold', value: users[t].gold }); }
    return;
  }

  // /announce <msg>
  if (text.startsWith('/announce')) {
    const announcement = text.replace('/announce', '').trim();
    broadcast({ type: 'announcement', msg: announcement, from: username });
    broadcastMsg(`📢 공지: ${announcement}`);
    return;
  }

  // /clear
  if (text.startsWith('/clear')) {
    chatHistory[ch] = [];
    broadcast({ type: 'chat_clear', channel: ch });
    return;
  }

  // /online
  if (text.startsWith('/online')) {
    const online = getOnlineUsers();
    ws.send(JSON.stringify({ type: 'system', msg: `온라인 유저 (${online.length}명): ${online.join(', ')}` }));
    return;
  }

  // /help
  if (text.startsWith('/help')) {
    ws.send(JSON.stringify({ type: 'system', msg: '명령어: /kill @a|@p|@s|<이름>, /give <이름> <아이템>, /gold <이름> <양>, /announce <내용>, /clear, /online' }));
    return;
  }

  const chatMsg = { type: 'chat', channel: ch, username, text, isAdmin: true, ts: Date.now() };
  broadcastChannel(ch, chatMsg);
}

function getOnlineUsers() {
  return [...clients.values()].map(c => c.username);
}

function broadcast(data) {
  const str = JSON.stringify(data);
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(str); });
}

function broadcastChannel(channel, data) {
  const str = JSON.stringify(data);
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(str);
  });
}

function sendToUser(username, data) {
  const str = JSON.stringify(data);
  for (const [ws, info] of clients.entries()) {
    if (info.username === username && ws.readyState === 1) {
      ws.send(str);
    }
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🎮 서버 실행중: port ${PORT}`));

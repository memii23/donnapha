// ข้อมูลช่องบนกระดาน 12 ช่อง
const boardData = [
    { name: "จุดเริ่มต้น", type: "start", icon: "🚩" },
    { name: "อกไก่ต้ม", type: "food", group: 1, hpCost: 10, icon: "🍗" },
    { name: "ข้าวกล้อง", type: "food", group: 2, hpCost: 10, icon: "🍚" },
    { name: "การ์ดสุ่ม", type: "chance", icon: "❓" },
    { name: "ผักบล็อกโคลี", type: "food", group: 3, hpCost: 10, icon: "🥦" },
    { name: "แอปเปิ้ล", type: "food", group: 4, hpCost: 10, icon: "🍎" },
    { name: "พักผ่อน", type: "rest", icon: "🏕️" },
    { name: "น้ำมันมะกอก", type: "food", group: 5, hpCost: 10, icon: "🫒" },
    { name: "การ์ดสุ่ม", type: "chance", icon: "❓" },
    { name: "ไข่ต้ม", type: "food", group: 1, hpCost: 10, icon: "🥚" },
    { name: "กล้วยหอม", type: "food", group: 4, hpCost: 10, icon: "🍌" },
    { name: "ฟาสต์ฟู้ด (ป่วย)", type: "sick", icon: "🍔" }
];

let playerPos = 0;
let playerHP = 100;
let inventory = { 1: false, 2: false, 3: false, 4: false, 5: false };

// สร้างกระดาน
function createBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    
    boardData.forEach((tile, index) => {
        const tileDiv = document.createElement('div');
        tileDiv.className = `tile ${index === playerPos ? 'active' : ''}`;
        tileDiv.innerHTML = `
            ${index === playerPos ? '<span class="player-marker">🏃</span>' : ''}
            <div style="font-size: 24px;">${tile.icon}</div>
            <div><strong>${tile.name}</strong></div>
        `;
        boardEl.appendChild(tileDiv);
    });
}

// ทอยลูกเต๋า
function rollDice() {
    const diceNum = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-num').innerText = diceNum;
    
    // เดินตามลูกเต๋า
    playerPos = (playerPos + diceNum) % boardData.length;
    createBoard();
    
    // ตรวจสอบช่องที่ตก
    handleTileAction(boardData[playerPos]);
}

// จัดการเหตุการณ์ในช่อง
function handleTileAction(tile) {
    let logText = `ตกช่อง ${tile.icon} ${tile.name}: `;

    if (tile.type === 'food') {
        if (!inventory[tile.group]) {
            inventory[tile.group] = true;
            playerHP -= tile.hpCost;
            document.getElementById(`nut-${tile.group}`).innerText = "✅ ได้รับแล้ว";
            logText += `ซื้อสารอาหารหมู่ ${tile.group} (-${tile.hpCost} HP)`;
        } else {
            logText += `คุณมีสารอาหารหมู่นี้แล้ว`;
        }
    } else if (tile.type === 'chance') {
        const bonus = Math.random() > 0.5 ? 15 : -10;
        playerHP += bonus;
        logText += bonus > 0 ? `ดวงดี! ได้รับ +${bonus} HP` : `เจออาหารหมดอายุ! เสีย ${bonus} HP`;
    } else if (tile.type === 'rest') {
        playerHP += 20;
        logText += `ได้พักผ่อนเต็มที่ (+20 HP)`;
    } else if (tile.type === 'sick') {
        playerHP -= 20;
        logText += `ทานอาหารขยะ คุณป่วย! (-20 HP)`;
    } else if (tile.type === 'start') {
        playerHP += 10;
        logText += `ผ่านจุดเริ่มต้น (+10 HP)`;
    }

    // อัปเดต HP
    document.getElementById('player-hp').innerText = playerHP;

    // เช็คเงื่อนไขชนะ (สะสมครบ 5 หมู่)
    if (Object.values(inventory).every(val => val === true)) {
        logText += " 🎉 ยินดีด้วย! คุณสะสมอาหารครบ 5 หมู่แล้ว ชนะเกม!";
    }

    addLog(logText);
}

function addLog(msg) {
    const logBox = document.getElementById('game-log');
    const p = document.createElement('p');
    p.className = 'log-item';
    p.innerText = msg;
    logBox.prepend(p);
}

// เริ่มต้นเกม
createBoard();
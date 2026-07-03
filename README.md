# 🪙 Mini Crypto Exchange API

โปรเจกต์ Backend จำลองระบบ Exchange สำหรับซื้อขายคริปโต (Cryptocurrency Trading System)
รองรับการโอนเหรียญ, ฝาก-ถอน, ซื้อขาย และระบบ Matching แบบ Simplified

---

## 🚀 เทคโนโลยีที่ใช้

- Node.js
- TypeScript
- Express.js
- MySQL
- Redis (สำหรับอนาคต / Event System)
- WebSocket (สำหรับอนาคต / Real-time)
- JWT Authentication
- UUID

---

## 📦 ฟีเจอร์หลัก

### 🔐 ระบบ Authentication

- สมัครสมาชิก
- เข้าสู่ระบบ
- ใช้ JWT Token
- Middleware ตรวจสอบสิทธิ์

---

### 💰 ระบบ Assets (เหรียญ)

- จัดการเหรียญในระบบ
- รองรับทั้ง Fiat และ Crypto เช่น BTC, THB

---

### 👛 ระบบ Wallet

- สร้าง Wallet อัตโนมัติเมื่อสมัครสมาชิก
- มี 2 ประเภท Balance:
  - available_balance (ยอดที่ใช้ได้)
  - locked_balance (ยอดที่ถูกล็อก)

---

### 💸 ฝาก / ถอน (Deposit / Withdraw)

- ฝากเงินเข้าสู่ระบบ
- ถอนเงินออกจากระบบ
- มีสถานะ:
  - PENDING
  - CONFIRMED
  - FAILED

---

### 🔁 ระบบโอนเงินภายใน (Transfer)

- โอนเหรียญระหว่างผู้ใช้ในระบบ
- ใช้ Transaction เพื่อความปลอดภัย
- อัปเดต Wallet ทั้งผู้ส่งและผู้รับ
- บันทึกประวัติการโอน

---

### 📊 ระบบ Order (ซื้อขาย)

- สร้างคำสั่งซื้อ / ขาย (BUY / SELL)
- ใช้ Asset Pair เช่น BTC_THB
- ใช้ระบบ Locked Balance
- สถานะ Order:
  - OPEN
  - PARTIAL
  - FILLED
  - CANCELLED

---

### 🔄 ระบบ Matching (แบบ Simplified)

- ระบบจับคู่คำสั่งซื้อขายทันทีเมื่อสร้าง Order
- รองรับ Partial Fill
- สร้าง Trade อัตโนมัติเมื่อ Match สำเร็จ

---

### 📈 ระบบ Trades

- บันทึกธุรกรรมการซื้อขายจริง
- เชื่อม BUY / SELL Order
- เก็บราคาและจำนวนที่ Match กัน

---

## 🧠 ภาพรวมระบบ

User -> API (Express.js) -> Service Layer -> MySQL (Transaction) -> Wallet / Order / Trade Update

---

## 🗄 โครงสร้างฐานข้อมูลหลัก

- users
- assets
- wallets
- orders
- trades
- transfers
- deposits
- withdrawals

---

## ⚙️ วิธีติดตั้ง

1. yarn install
2. ตั้งค่า .env
3. import SQL
4. yarn seed
5. yarn dev

---

## 🌱 Seed Data

Alice / Bob พร้อม Wallet BTC + THB

---

## 📌 API

Auth / Assets / Wallet / Transfer / Deposit / Withdraw / Orders / Trades

---

## 🔥 แนวคิดสำคัญ

- Available vs Locked balance
- Transaction safety
- Simplified matching engine
- Ledger audit system

---

## 🚀 Future

- WebSocket
- Redis Pub/Sub
- Full Order Book
- Admin Dashboard

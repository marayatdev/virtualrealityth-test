## ⚙️ วิธีติดตั้ง Project

1. git clone https://github.com/marayatdev/virtualrealityth-test.git
2. cd server
3. ใช้คำสั่ง yarn install เพื่อติดตั้ง node และ dependencies
4. import SQL ชื่อไฟล์ virtualrealityth.sql
5. yarn seed เพิ่มข้อมูลเริ่มต้นไว้
6. yarn seed:reset ล้างข้อมูลทั้งหมด
7. ตั้งค่า .env

DB_HOST=localhost
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=

PORT=8000
JWT_SECRET=zxxxxxz
REFRESH_SECRET=zxxxxxxz

8. yarn dev
9. เพิ่ม postman_collection ด้วยไฟล์ virtualrealityth.postman_collection.json

---

## 🚀 เทคโนโลยีที่ใช้

- Node.js
- TypeScript
- Express.js
- MySQL
- JWT Authentication
- UUID

---

## 📦 ฟีเจอร์หลัก

### 🔐 ระบบ Authentication

- สมัครสมาชิก
- เข้าสู่ระบบ
- ใช้ JWT Token เก็บไว้ใน cookie

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

- โอนเหรียญระหว่างผู้ใช้ในระบบใช้อีเมล
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

### 📈 ระบบ Trades

- บันทึกธุรกรรมการซื้อขายจริง
- เชื่อม BUY / SELL Order
- เก็บราคาและจำนวนที่ Match กัน

---

## 🗄 โครงสร้างฐานข้อมูลหลัก

- users คือ เก็บข้อมูลผู้ใช้งานระบบ เช่น ชื่อ, อีเมล, รหัสผ่าน (Hash Password) และสถานะของบัญชีผู้ใช้

- assets คือ เก็บข้อมูลสินทรัพย์ที่รองรับภายในระบบ ทั้งสกุลเงิน Fiat และ Cryptocurrency เช่น THB, BTC, ETH พร้อมรายละเอียดของแต่ละเหรียญ

- wallets คือ กระเป๋าเงินของผู้ใช้สำหรับแต่ละสินทรัพย์ โดยเก็บยอดเงินที่สามารถใช้งานได้ (available_balance) และยอดเงินที่ถูกล็อกไว้สำหรับการซื้อขาย (locked_balance)

- orders คือ เก็บคำสั่งซื้อ (BUY) และคำสั่งขาย (SELL) ของผู้ใช้ รวมถึงราคา จำนวน และสถานะของคำสั่ง เช่น OPEN, PARTIAL, FILLED และ CANCELLED

- trades คือ เก็บประวัติการจับคู่คำสั่งซื้อขาย (Matched Order) ระหว่างผู้ซื้อและผู้ขาย พร้อมรายละเอียดราคา จำนวน และค่าธรรมเนียมที่เกิดขึ้น

- transfers คือ เก็บประวัติการโอนสินทรัพย์ระหว่างผู้ใช้ภายในระบบ รวมถึงผู้โอน ผู้รับ จำนวนสินทรัพย์ และสถานะของการโอน

- deposits คือ เก็บประวัติการฝากสินทรัพย์เข้าสู่ระบบ พร้อมจำนวนสินทรัพย์และสถานะของรายการ เช่น PENDING, CONFIRMED และ FAILED

- withdrawals คือ เก็บประวัติการถอนสินทรัพย์ออกจากระบบ โดยบันทึกจำนวนสินทรัพย์ ค่าธรรมเนียม ที่อยู่ปลายทาง (Address) และสถานะของการถอน

---

## 📌 API

Auth / Assets / Wallet / Transfer / Deposit / Withdraw / Orders / Trades

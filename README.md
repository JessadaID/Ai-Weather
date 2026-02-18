# 🌤️ AI Weather Thailand

โปรเจกต์เว็บแอปพลิเคชันสำหรับตรวจสอบสภาพอากาศในประเทศไทย โดยมีการผสานพลังของ **AI** เพื่อวิเคราะห์และให้คำแนะนำสภาพอากาศได้อย่างชาญฉลาด พร้อมแผนที่ประเทศไทยที่ตอบสนองการใช้งาน (Interactive Map) และข้อมูลคุณภาพอากาศ (AQI)

![Head Screenshot](/src/assets/head.png)
![Body Screenshot](/src/assets/body.png)

---

## ✨ ฟีเจอร์เด่น (Key Features)

### 1. 🌦️ ตรวจสอบสภาพอากาศเรียลไทม์
- แสดงอุณหภูมิ, ความชื้น, แรงลม, และทัศนวิสัย
- ข้อมูลแม่นยำจาก **OpenWeather API**
- รองรับการค้นหาตำแหน่งปัจจุบันอัตโนมัติ (Geolocation)

### 2. 😷 ข้อมูลคุณภาพอากาศ (AQI) **(ใหม่!)**
- แสดงค่าฝุ่น PM2.5 และคุณภาพอากาศรวม (AQI)
- **Interactive Card**: สามารถกดที่ค่า AQI เพื่อดูรายละเอียดมลพิษต่างๆ เชิงลึกได้ (เช่น PM10, O3, NO2)

### 3. 🗺️ แผนที่ประเทศไทย Interactive **(ใหม่!)**
- แผนที่ SVG ที่สวยงาม แบ่งตามภูมิภาค
- **Hover & Click**: เลื่อนเมาส์เพื่อดูสภาพอากาศย่อ หรือคลิกที่จังหวัดเพื่อดูข้อมูลเต็มรูปแบบของจังหวัดนั้นๆ
- ระบบจะเลื่อนหน้าจอ (Scroll) ไปที่ข้อมูลทันทีเมื่อเลือกจังหวัด

### 4. 🤖 AI Weather Analysis
- มี **Chatbot AI** ให้คำปรึกษาเรื่องสภาพอากาศ
- สามารถถามคำถามเช่น "พรุ่งนี้แต่งตัวยังไงดี?", "เย็นนี้ฝนจะตกไหม?"
- มีระบบ **Quick Prompts** ปุ่มคำถามด่วนเพื่อความสะดวกรวดเร็ว

### 5. 🎨 UI/UX ที่ทันสมัย
- ดีไซน์สวยงาม สบายตา (Modern Clean Look)
- รองรับการใช้งานทั้งบนคอมพิวเตอร์และมือถือ (Responsive Design)
- มี Animation แสดงสถานะการโหลดที่ลื่นไหล

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: 
  - [OpenWeatherMap](https://openweathermap.org/) (Weather Data)
  - [WAQI](https://waqi.info/) (Air Quality Data)
  - [Groq AI](https://groq.com/) (AI Chat Capabilities)

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Installation)

1. **Clone โปรเจกต์**
   ```bash
   git clone https://github.com/your-username/ai-weather.git
   cd ai-weather
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**
   สร้างไฟล์ `.env` ที่ root folder และใส่ Key ของคุณ:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_key
   VITE_GROQ_API_KEY=your_groq_key
   VITE_AIR_QUALITY_API_KEY=your_waqi_key
   ```

4. **รันโปรเจกต์**
   ```bash
   npm run dev
   ```
   เปิด Browser ไปที่ `http://localhost:5173`

---

## 📄 โครงสร้างโปรเจกต์ (Folder Structure)

```
src/
├── components/      # คอมโพเนนต์ต่างๆ (WeatherCard, ThailandMap, AIChatBox)
├── services/        # ไฟล์เรียก API (weatherService, aiService)
├── data/            # ข้อมูลคงที่ (แผนที่ SVG, รายชื่อจังหวัด)
└── App.jsx          # หน้าหลักของแอปพลิเคชัน
```

---

พัฒนาโดย [Jessada] ❤️

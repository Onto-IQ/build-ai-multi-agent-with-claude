export const meta = {
  name: "map-and-check",
  description: "Demo: agent แรกสรุป endpoints ใน server.js แล้ว agent ที่สองตรวจว่าสรุปครบไหม",
  phases: [{ title: "Map" }, { title: "Check" }],
};

phase("Map");
const summary = await agent(
  "อ่านไฟล์ server.js ในโปรเจกต์นี้ แล้วสรุป HTTP endpoint ทั้งหมดเป็น JSON array หนึ่งชุด โดยแต่ละรายการมี method, path, และ does (ทำอะไรหนึ่งประโยค)",
  {
    model: "haiku",
    schema: {
      type: "object",
      properties: {
        endpoints: {
          type: "array",
          items: {
            type: "object",
            properties: { method: { type: "string" }, path: { type: "string" }, does: { type: "string" } },
            required: ["method", "path", "does"],
          },
        },
      },
      required: ["endpoints"],
    },
  }
);

phase("Check");
const check = await agent(
  "อ่านไฟล์ server.js แล้วตรวจว่าสรุป endpoint ชุดนี้ครบถ้วนหรือไม่ ตอบสั้น ๆ: ถ้าตกหล่นบอกว่าตกหล่นอะไร ถ้าครบตอบ OK\nสรุปชุดที่ต้องตรวจ:\n" + JSON.stringify(summary),
  { model: "haiku" }
);
console.log(`สรุปได้ ${summary.endpoints.length} endpoint — ผลตรวจ: ${check}`);

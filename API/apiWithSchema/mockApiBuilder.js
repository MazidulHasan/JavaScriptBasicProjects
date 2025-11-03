// mockApiBuilder_debug.js
const fs = require('fs');

function randomString() {
  const words = ["QA", "Automation", "Engineer", "Test", "Mock", "Script", "Data"];
  return words[Math.floor(Math.random() * words.length)];
}

function randomEmail() {
  const domains = ["example.com", "test.com", "qa.com", "automation.dev"];
  const namePart = randomString().toLowerCase();
  return `${namePart}.${Math.floor(Math.random() * 100)}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function randomNumber() {
  return Math.floor(Math.random() * 1000) + 1;
}

function randomBoolean() {
  return Math.random() > 0.5;
}

function randomDate() {
  return new Date().toISOString();
}

// 🧭 Debug-enhanced recursive function
function generateMockResponse(schema, depth = 0) {
  const indent = '  '.repeat(depth); // Indent for readability

  console.log(`${indent}▶️ Processing schema:`, JSON.stringify(schema));

  if (typeof schema === "string") {
    let value;
    switch (schema) {
      case "string": value = randomString(); break;
      case "number": value = randomNumber(); break;
      case "boolean": value = randomBoolean(); break;
      case "email": value = randomEmail(); break;
      case "date": value = randomDate(); break;
      default: value = null;
    }
    console.log(`${indent}  🧩 Primitive type "${schema}" → ${value}`);
    return value;
  }

  // Array schema case (e.g. ["string"])
  if (Array.isArray(schema) && schema.length === 1) {
    const itemType = schema[0];
    const count = Math.floor(Math.random() * 3) + 3;
    console.log(`${indent}📦 Array schema detected, generating ${count} items of type "${itemType}"`);
    const arr = Array.from({ length: count }, () => generateMockResponse(itemType, depth + 1));
    console.log(`${indent}  ✅ Generated array:`, arr);
    return arr;
  }

  // Object schema case (including nested)
  if (typeof schema === "object") {
    console.log(`${indent}🧱 Object schema detected`);
    const result = {};
    for (const key in schema) {
      console.log(`${indent}  🔹 Processing key: "${key}"`);
      result[key] = generateMockResponse(schema[key], depth + 1);
    }
    console.log(`${indent}  ✅ Completed object:`, result);
    return result;
  }

  console.log(`${indent}⚠️ Unknown schema type`);
  return null;
}

// Wrapper
function generateMockData(schema, count = 1) {
  console.log(`\n🚀 Generating ${count} mock response(s)...`);
  const data = Array.from({ length: count }, () => generateMockResponse(schema));
  return count === 1 ? data[0] : data;
}

// Save to file
function saveMockToFile(fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  console.log(`\n✅ Mock data saved to ${fileName}`);
}

// Example schema
const schema = {
  id: "number",
  name: "string",
  email: "email",
  isActive: "boolean",
  createdAt: "date",
  tags: ["string"],
  user: {
    name: "string",
    contact: { email: "email", phone: "string" }
  }
};

// Run and debug
const mockData = generateMockData(schema, 1);
console.log("\n🧾 Final Mock Data:\n", mockData);
saveMockToFile("mockData_debug.json", mockData);

# Chatbot Test Cases - Post-Improvement Validation

## Test these scenarios manually or via API to validate improvements

### API Endpoint
```
POST /api/chatbot/ask
Body: { "message": "your message", "sessionId": "test-session-xyz" }
```

---

## 🧪 Test Suite 1: Context Maintenance

### Test 1.1: Question During Name Collection
```json
Session: new-session-001

Request 1: { "message": "", "sessionId": "new-session-001" }
Expected: "👋 Namaste! Tutvex me aapka swagat hai. Aapka naam kya hai?"

Request 2: { "message": "tutor kaise bane", "sessionId": "new-session-001" }
Expected: Should contain BOTH:
  - Registration link
  - "Aapka naam kya hai?"
```

### Test 1.2: Question During Role Collection
```json
Session: new-session-002

Request 1: { "message": "", "sessionId": "new-session-002" }
Request 2: { "message": "Rohit", "sessionId": "new-session-002" }
Expected: "Dhanyavaad Rohit! Aap kaun ho? (Parent / Student / Tutor)"

Request 3: { "message": "fees kitni hai", "sessionId": "new-session-002" }
Expected: Should contain BOTH:
  - Fees information (₹2000 to ₹8000)
  - "Aap kaun ho? (Parent / Student / Tutor)"
```

---

## 🧪 Test Suite 2: Intent Recognition

### Test 2.1: Tutor Registration (Hindi/Hinglish)
```json
Test queries:
- "tutor kaise bane"
- "tutor kaise ban"
- "tutor banna hai"
- "teacher banna hai"
- "mai tutor banna chahta hu"

Expected: Registration link
https://tutvex.com/tutor-flow/tutor-registration/...
```

### Test 2.2: Tutor Wants Students
```json
Test queries:
- "student chahiye"
- "students chahiye"
- "I want students"
- "mujhe student do"
- "students kab milenge"

Expected: "📚 Students paane ke liye:" with 4 steps + contact number
```

### Test 2.3: Approval Status
```json
Session: Complete profile first (name=Test, role=tutor, phone=9999999999)

Test queries:
- "meri approval nahi hui"
- "kab approval hoga"
- "application status"

Expected: Selection process with contact number 9305275932
```

### Test 2.4: Location-Specific Query
```json
Test queries:
- "noida me hai kya"
- "civil lines me available hai"
- "sector 62 me tuition"

Expected: "Offline tutoring is available in... Noida..."
```

---

## 🧪 Test Suite 3: Language Detection

### Test 3.1: Hinglish Detection
```json
Test queries (should get Hindi response):
- "fees kitni hai"
- "tutor kaise bane"
- "student chahiye"
- "approval kab hoga"

Expected: Response in Hindi (not English)
```

### Test 3.2: English Detection
```json
Test queries (should get English response):
- "how to become tutor"
- "what are the fees"
- "I want students"

Expected: Response in English
```

---

## 🧪 Test Suite 4: Fallback Reduction

### Test 4.1: Should NOT Trigger Fallback
```json
These queries should match intents (not fallback):
- "tutor bane" ✅
- "student chahiye" ✅
- "fees" ✅
- "cities" ✅
- "approval" ✅
- "profile complete kaise kare" ✅
```

### Test 4.2: Fallback Should Include Contact
```json
Test query: "random gibberish xyz abc"

Expected fallback should contain:
- "🤖 Main aapki madad kar sakta hoon:"
- List of topics
- "9305275932"
```

---

## 🧪 Test Suite 5: Full Conversation Flow

### Test 5.1: Happy Path (Tutor Registration)
```json
Session: full-flow-001

1. Bot: "Aapka naam kya hai?"
2. User: "Priya Sharma"
   Bot: "Dhanyavaad Priya Sharma! Aap kaun ho? (Parent / Student / Tutor)"

3. User: "tutor"
   Bot: "Apna mobile number batayein 📱"

4. User: "9876543210"
   Bot: "✅ Dhanyavaad! Ab aap apna sawal pooch sakte hain."

5. User: "tutor kaise bane"
   Bot: [Registration link]

6. User: "students kaise milenge"
   Bot: "📚 Students paane ke liye: [4 steps]"
```

### Test 5.2: Question During Onboarding
```json
Session: full-flow-002

1. Bot: "Aapka naam kya hai?"

2. User: "fees kitni hai"
   Bot: [Fees info] + "Aapka naam kya hai?"

3. User: "Amit"
   Bot: "Dhanyavaad Amit! Aap kaun ho?"

4. User: "approval kaise hota hai"
   Bot: [Selection process] + "Aap kaun ho? (Parent / Student / Tutor)"

5. User: "tutor"
   Bot: "Apna mobile number batayein 📱"

6. User: "9123456789"
   Bot: "✅ Dhanyavaad!"
```

---

## 🧪 Test Suite 6: Edge Cases

### Test 6.1: Typos and Misspellings
```json
Test queries (should still work):
- "kease bane" → "kaise bane" ✅
- "chiye" → "chahiye" ✅
- "milegi" → "milega" ✅
- "muje" → "mujhe" ✅
```

### Test 6.2: Multiple Roles in Text
```json
Test query: "I am a parent and want tutor for my son"
Expected: Should detect "parent" role
```

### Test 6.3: Phone in Name Field
```json
Session: edge-001

Request 1: Bot asks for name
Request 2: User: "9876543210"
Expected: "Kripya apna naam batayein 🙂" (should reject phone as name)
```

---

## ✅ Success Criteria

### Intent Matching
- [ ] "tutor kaise bane" → Registration link ✅
- [ ] "student chahiye" → Students guide ✅
- [ ] "approval nahi hui" → Selection process + contact ✅
- [ ] "noida" → Cities list ✅

### Context Preservation
- [ ] Questions during onboarding are answered ✅
- [ ] Onboarding still completes after questions ✅
- [ ] No context reset mid-conversation ✅

### Language Detection
- [ ] Hinglish queries → Hindi responses ✅
- [ ] English queries → English responses ✅

### Fallback Rate
- [ ] Common queries don't trigger fallback ✅
- [ ] Fallback includes contact number ✅
- [ ] Fallback is helpful (not repetitive generic message) ✅

---

## 📊 Validation Checklist

After testing, validate:

- [ ] No context loss during onboarding
- [ ] Common Hindi/Hinglish queries recognized
- [ ] Tutor-specific queries handled properly
- [ ] Location queries recognized
- [ ] Fallback reduced by ~60-70%
- [ ] Language detection accurate
- [ ] No build errors
- [ ] No TypeScript errors
- [ ] Database operations work correctly

---

## 🐛 Known Limitations

1. **Multi-turn context:** Still doesn't remember previous questions in same session
2. **Complex queries:** Very complex or unusual phrasings may still hit fallback
3. **Slang:** Heavy slang or regional dialects may not be recognized

These can be addressed in future iterations with AI integration (OpenAI/Gemini).

---

**Test Document Created:** September 18, 2026
**Status:** Ready for QA Testing

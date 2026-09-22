const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Tutvex123:Tutvex123@tutvex-cluster.xhgwaiv.mongodb.net/tutvex';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Count all student leads
    const StudentLead = mongoose.connection.collection('studentleads');
    const count = await StudentLead.countDocuments();
    console.log(`📊 Total StudentLeads in database: ${count}`);
    
    // Get first 5 leads
    const leads = await StudentLead.find().limit(5).toArray();
    console.log('\n📋 Sample leads:');
    leads.forEach((lead, i) => {
      console.log(`\n${i + 1}. ID: ${lead._id}`);
      console.log(`   Student: ${lead.studentName || 'N/A'}`);
      console.log(`   Class: ${lead.studentClass}`);
      console.log(`   Subject: ${lead.subject}`);
      console.log(`   Status: ${lead.status}`);
      console.log(`   Created: ${lead.createdAt}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

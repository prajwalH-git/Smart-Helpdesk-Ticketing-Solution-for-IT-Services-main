const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Ensures every ticket belongs to someone
  },
  title: String,
  description: String,
  category: {
    type: String,
    enum: ['Hardware', 'Software', 'Network', 'Account', 'Security', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  aiConfidence: { type: Number, default: 0 },
  aiReasoning: String,
  department: {
    type: String,
    enum: ['IT Support', 'Network Team', 'Security Team', 'Help Desk', 'Unassigned'],
    default: 'Unassigned'
  },
  status: {
    type: String,
    enum: ['Open', 'Assigned', 'In Progress', 'Waiting', 'Resolved', 'Closed', 'Escalated'],
    default: 'Open'
  },
  sla: {
    responseDeadline: Date,
    resolutionDeadline: Date,
    respondedAt: Date,
    resolvedAt: Date,
    breached: { type: Boolean, default: false }
  },
  messages: [
    {
      role: String,
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TicketSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

TicketSchema.methods.calculateSLA = function() {
  const now = new Date();
  let resMin = 60, relHrs = 24;
  if(this.priority === 'Critical') { resMin = 15; relHrs = 4; }
  else if(this.priority === 'High') { resMin = 30; relHrs = 8; }
  this.sla.responseDeadline = new Date(now.getTime() + resMin * 60000);
  this.sla.resolutionDeadline = new Date(now.getTime() + relHrs * 3600000);
};

module.exports = mongoose.model('Ticket', TicketSchema);
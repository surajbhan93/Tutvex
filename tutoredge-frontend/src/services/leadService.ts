import apiClient from "@/lib/apiClient";

export interface StudentLead {
  _id: string;
  parentId: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  studentName?: string;
  studentClass: string;
  board?: string;
  schoolName?: string;
  subject: string;
  teachingMode: "online" | "home" | "hybrid";
  location: {
    city?: string;
    area?: string;
    state?: string;
    pincode?: string;
  };
  budget: number;
  budgetType: "per_hour" | "per_month";
  preferredTime?: string;
  additionalRequirements?: string;
  urgency: "immediate" | "within_week" | "within_month" | "flexible";
  status: "new" | "active" | "assigned" | "closed" | "expired";
  availability: "active" | "already_filled";
  qualityScore: number;
  creditsRequired: number;
  totalUnlocks: number;
  maxUnlocks: number;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  // Populated parent info (only after unlock)
  parent?: {
    fullName: string;
    phone: string;
    email: string;
  };
}

export interface LeadUnlock {
  _id: string;
  leadId: StudentLead;
  tutorId: string;
  creditsUsed: number;
  status: string;
  contactedAt?: string;
  demoScheduledAt?: string;
  demoCompletedAt?: string;
  convertedAt?: string;
  unlockedAt: string;
  notes?: string;
}

export interface LeadStats {
  availableLeads: number;
  unlockedLeads: number;
  activeStudents: number;
  creditsRemaining: number;
}

const leadService = {
  /**
   * Get marketplace leads for tutor (matched to profile)
   */
  async getMarketplaceLeads(filters?: {
    subject?: string;
    studentClass?: string;
    city?: string;
    teachingMode?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.subject) params.append("subject", filters.subject);
    if (filters?.studentClass) params.append("studentClass", filters.studentClass);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.teachingMode) params.append("teachingMode", filters.teachingMode);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const query = params.toString();
    const response = await apiClient.get(`/leads/marketplace${query ? `?${query}` : ""}`);
    return response.data;
  },

  /**
   * Get single lead by ID
   */
  async getLeadById(leadId: string) {
    const response = await apiClient.get(`/leads/${leadId}`);
    return response.data;
  },

  /**
   * Unlock a lead with credits
   */
  async unlockLead(leadId: string) {
    const response = await apiClient.post("/leads/unlock", { leadId });
    return response.data;
  },

  /**
   * Get tutor's unlocked leads
   */
  async getMyLeads(status?: string) {
    const query = status ? `?status=${status}` : "";
    const response = await apiClient.get(`/leads/my-leads${query}`);
    return response.data;
  },

  /**
   * Update lead status in pipeline
   */
  async updateLeadStatus(unlockId: string, status: string, notes?: string) {
    const response = await apiClient.put("/leads/update-status", {
      unlockId,
      status,
      notes,
    });
    return response.data;
  },

  /**
   * Mark lead as converted
   */
  async markAsConverted(unlockId: string, monthlyFee: number, commissionPercentage?: number) {
    const response = await apiClient.post("/leads/mark-converted", {
      unlockId,
      monthlyFee,
      commissionPercentage,
    });
    return response.data;
  },

  /**
   * Get tutor lead stats
   */
  async getLeadStats(): Promise<{ success: boolean; data: LeadStats }> {
    const response = await apiClient.get("/leads/stats");
    return response.data;
  },

  /**
   * Parent: Create a new lead
   */
  async createParentLead(leadData: Partial<StudentLead>) {
    const response = await apiClient.post("/leads/create", leadData);
    return response.data;
  },

  /**
   * Parent: Get my leads
   */
  async getParentLeads() {
    const response = await apiClient.get("/leads/my-requests");
    return response.data;
  },

  /**
   * Parent: Close a lead
   */
  async closeLead(leadId: string) {
    const response = await apiClient.post("/leads/close", { leadId });
    return response.data;
  },

  // Admin APIs
  /**
   * Admin: Get all student leads
   */
  async adminGetAllLeads() {
    const response = await apiClient.get("/leads/admin/student-leads");
    return response.data;
  },

  /**
   * Admin: Create a student lead
   */
  async adminCreateLead(leadData: any) {
    const response = await apiClient.post("/leads/admin/student-leads", leadData);
    return response.data;
  },

  /**
   * Admin: Update a student lead
   */
  async adminUpdateLead(leadId: string, leadData: any) {
    const response = await apiClient.put(`/leads/admin/student-leads/${leadId}`, leadData);
    return response.data;
  },

  /**
   * Admin: Delete a student lead
   */
  async adminDeleteLead(leadId: string) {
    const response = await apiClient.delete(`/leads/admin/student-leads/${leadId}`);
    return response.data;
  },

  /**
   * Admin: Get unlock history for a lead
   */
  async adminGetLeadUnlocks(leadId: string) {
    const response = await apiClient.get(`/leads/admin/lead-unlocks/${leadId}`);
    return response.data;
  },
};

export default leadService;

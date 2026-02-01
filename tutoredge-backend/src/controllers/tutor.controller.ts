import { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from "mongoose";
import { TutorService } from '../services/tutor.service';
import { saveFile } from '../utils/upload';
import { MultipartValue, MultipartFile } from '@fastify/multipart';
import User from "../models/User";
import Student from "../models/Student";
import StudentRequest from "../models/StudentRequest";
import StudyMaterial from "../models/StudyMaterial";
import StudentStudyMaterial from "../models/StudentStudyMaterial";
const tutorService = new TutorService();
import StudentQuiz from "../models/StudentQuiz";
import fs from "fs";
import path from "path";
import StudentAssignment from "../models/StudentAssignment";
import Assignment from "../models/Assignment";
import Quiz from "../models/Quiz";
// 🔥 MODEL IMPORT (THIS WAS MISSING)
import ParentRequest from "../models/ParentRequest";
export class TutorController {
  // 🔹 GET LOGGED-IN TUTOR PROFILE
  // 🔹 Get Featured Tutors (Public)
async getFeaturedTutors(req: FastifyRequest, reply: FastifyReply) {
  try {
    const tutors = await User.find({
      role: "tutor",
      status: "approved",
      isProfileComplete: true
    })
      .select(
        "fullName profileImage headline subjects rating yearsOfExperience price priceType totalStudents profileViews"
      )
      .sort({ rating: -1, profileViews: -1 })
      .limit(4)
      .lean();

    return reply.send({
      success: true,
      data: tutors,
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to fetch featured tutors" });
  }
}

// 🔹 Get All Tutors (Public)
async getAllTutors(req: FastifyRequest, reply: FastifyReply) {
  try {
    const page = Number((req.query as any).page) || 1;
    const limit = Number((req.query as any).limit) || 12;
    const skip = (page - 1) * limit;

    const tutors = await User.find({
      role: "tutor",
      status: "approved",
      isProfileComplete: true,
    })
      .select(
        "fullName profileImage headline subjects rating yearsOfExperience price priceType totalStudents profileViews teachingMode availability"
      )
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({
      role: "tutor",
      status: "approved",
      isProfileComplete: true,
    });

    return reply.send({
      success: true,
      data: tutors,
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    return reply.status(500).send({ message: "Failed to fetch tutors" });
  }
}


// 🔹 Get Tutor By ID (Public Profile)
// 🔹 Get Tutor Public Profile By ID
async getTutorById(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };

    const tutor = await User.findOne({
      _id: id,
      role: "tutor",
      status: "approved",
      isProfileComplete: true,
    })
      .select("-password")
      .lean();

    if (!tutor) {
      return reply.status(404).send({ message: "Tutor not found" });
    }

    return reply.send({
      success: true,
      data: tutor,
    });
  } catch (err) {
    console.error(err);
    return reply.status(400).send({ message: "Invalid tutor id" });
  }
}


  async getMyProfile(req: any, reply: any) {
    try {
      const tutor = await User.findOne({
        _id: req.user.id,
        role: "tutor"
      }).select("-password");

      if (!tutor) {
        return reply.status(404).send({ message: "Tutor not found" });
      }

      return reply.send({
        success: true,
        data: tutor
      });
    } catch (error) {
      return reply.status(500).send({ message: "Server error" });
    }
  }

  
  async updateMyProfile(req: any, reply: any) {
  try {
    const tutorId = req.user.id;

    const updates: any = {};

    const allowedFields = [
      "fullName",
      "phone",
      "bio",
      "headline",
      "gender",

      "subjects",
      "languages",
      "classesTaught",

      "qualification",
      "college",
      "certifications",

      "yearsOfExperience",
      "experienceDescription",

      "price",
      "priceType",
      "teachingMode",
      "availability",
      "demoAvailable",
      "profileImage",
    ];

    // ✅ Apply updates safely
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 1️⃣ Update tutor
    let tutor = await User.findOneAndUpdate(
      { _id: tutorId, role: "tutor" },
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!tutor) {
      return reply.status(404).send({ message: "Tutor not found" });
    }

    // 2️⃣ PROFILE COMPLETION CHECK (80%)
    const profileFields = [
      tutor.fullName,
      tutor.phone,
      tutor.bio,
      tutor.headline,
      tutor.gender,

      tutor.subjects?.length,
      tutor.languages?.length,
      tutor.classesTaught?.length,

      tutor.qualification,
      tutor.college,

      tutor.yearsOfExperience !== undefined,
      tutor.price > 0,
      tutor.priceType,
      tutor.teachingMode,
      tutor.profileImage,
    ];

    const filledCount = profileFields.filter(Boolean).length;
    const completionPercent = (filledCount / profileFields.length) * 100;

    const shouldBeComplete = completionPercent >= 80;

    // 3️⃣ Update isProfileComplete if changed
    if (tutor.isProfileComplete !== shouldBeComplete) {
      tutor.isProfileComplete = shouldBeComplete;
      await tutor.save();
    }

    return reply.send({
      success: true,
      message: "Profile updated successfully",
      profileCompletion: Math.round(completionPercent),
      isProfileComplete: tutor.isProfileComplete,
      data: tutor,
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to update profile" });
  }
}



  // 🔹 UPLOAD PROFILE IMAGE  ✅ ADD THIS HERE
  async uploadProfileImage(req: any, reply: any) {
    try {
      const tutorId = req.user.id;
      const data = await req.file();

      if (!data) {
        return reply.status(400).send({ message: "No file uploaded" });
      }

      const uploadDir = path.join(process.cwd(), "uploads/profile");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${tutorId}-${Date.now()}-${data.filename}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, await data.toBuffer());

      const imageUrl = `/uploads/profile/${fileName}`;

      await User.findByIdAndUpdate(tutorId, {
        profileImage: imageUrl
      });

      return reply.send({
        success: true,
        message: "Profile image uploaded successfully",
        imageUrl
      });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ message: "Image upload failed" });
    }
  }

  // 🔹 PROFILE VIEW ANALYTICS
 async incrementProfileView(req: any, reply: any) {
  try {
    const tutorId = req.params.id;

    await User.findOneAndUpdate(
      { _id: tutorId, role: "tutor" },
      {
        $inc: { profileViews: 1 },
        lastActiveAt: new Date()
      }
    );

    return reply.send({ success: true });
  } catch (err) {
    return reply.status(500).send({ message: "Failed to update profile views" });
  }
}


  // async createAssignment(req: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     if (!req.isMultipart()) {
  //       return reply
  //         .status(400)
  //         .send({ error: 'Request must be multipart/form-data' });
  //     }

  //     const parts = req.parts();
  //     const fields: Record<string, any> = {};
  //     const attachments: { filename: string; url: string }[] = [];

  //     // parse files + fields
  //     for await (const part of parts) {
  //       if (part.type === 'file') {
  //         const chunks: Buffer[] = [];
  //         for await (const chunk of part.file) chunks.push(Buffer.from(chunk));
  //         const buffer = Buffer.concat(chunks);
  //         const mimetype = part.mimetype || '';

  //         // file validations
  //         const allowed = [
  //           'application/pdf',
  //           'application/msword',
  //           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //           'image/jpeg',
  //           'image/png',
  //         ];
  //         if (!allowed.includes(mimetype)) {
  //           return reply.status(400).send({ error: 'Invalid file type' });
  //         }
  //         if (buffer.length > 10 * 1024 * 1024) {
  //           return reply
  //             .status(400)
  //             .send({ error: 'File too large (max 10MB)' });
  //         }

  //         // save file
  //         const saved = await saveFile(
  //           buffer,
  //           part.filename || 'file',
  //           mimetype,
  //         );
  //         attachments.push({ filename: saved.filename, url: saved.url });
  //       } else {
  //         // collect text fields
  //         fields[part.fieldname] = part.value;
  //       }
  //     }

  //     // required field validation
  //     const title = fields.title?.trim();
  //     const subject = fields.subject?.trim();
  //     const class_grade = fields.class_grade?.trim();
  //     const due_date = fields.due_date?.trim();
  //     const allow_submission_online =
  //       fields.allow_submission_online === 'true' ||
  //       fields.allow_submission_online === true;

  //     if (!title || !subject || !class_grade || !due_date) {
  //       return reply.status(400).send({
  //         error:
  //           'Missing required fields: title, subject, class_grade, due_date',
  //       });
  //     }

  //     // simple date format validation
  //     if (!/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
  //       return reply
  //         .status(400)
  //         .send({ error: 'due_date must be in YYYY-MM-DD format' });
  //     }

  //     // get user from middleware
  //     const user = (req as any).user;
  //     if (!user || user.role !== 'tutor') {
  //       return reply.status(403).send({ error: 'Forbidden' });
  //     }

  //     // call service
  //     const assignment = await tutorService.createAssignment({
  //       title,
  //       subject,
  //       class_grade,
  //       instructions: fields.instructions || '',
  //       due_date,
  //       allow_submission_online,
  //       attachments,
  //       created_by: user.id,
  //     });

  //     return reply.status(201).send({
  //       message: 'Assignment created successfully',
  //       assignment: {
  //         id: assignment._id,
  //         title: assignment.title,
  //         subject: assignment.subject,
  //         class_grade: assignment.class_grade,
  //         instructions: assignment.instructions,
  //         attachments: assignment.attachments || [],
  //         due_date: assignment.due_date,
  //         allow_submission_online: assignment.allow_submission_online,
  //         created_at: assignment.createdAt,
  //       },
  //     });
  //   } catch (err: any) {
  //     console.error('createAssignment error:', err);
  //     return reply.status(500).send({ error: 'Internal Server Error' });
  //   }
  // }

  async createAssignment(req: FastifyRequest, reply: FastifyReply) {
  try {
    if (!req.isMultipart()) {
      return reply
        .status(400)
        .send({ error: "Request must be multipart/form-data" });
    }

    const parts = req.parts();
    const fields: Record<string, any> = {};
    const attachments: { filename: string; url: string }[] = [];

    const BASE_URL = process.env.BACKEND_URL || "http://localhost:3001";

    for await (const part of parts) {
      if (part.type === "file") {
        const chunks: Buffer[] = [];
        for await (const chunk of part.file) chunks.push(Buffer.from(chunk));
        const buffer = Buffer.concat(chunks);
        const mimetype = part.mimetype || "";

        const allowed = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
        ];

        if (!allowed.includes(mimetype)) {
          return reply.status(400).send({ error: "Invalid file type" });
        }

        if (buffer.length > 10 * 1024 * 1024) {
          return reply
            .status(400)
            .send({ error: "File too large (max 10MB)" });
        }

        const saved = await saveFile(
          buffer,
          part.filename || "file",
          mimetype
        );

        attachments.push({
          filename: saved.filename,
          url: `${BASE_URL}${saved.url}`, // 🔥 FIX
        });
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    const title = fields.title?.trim();
    const subject = fields.subject?.trim();
    const class_grade = fields.class_grade?.trim();
    const due_date = fields.due_date?.trim();
    const allow_submission_online =
      fields.allow_submission_online === "true" ||
      fields.allow_submission_online === true;

    if (!title || !subject || !class_grade || !due_date) {
      return reply.status(400).send({
        error: "Missing required fields: title, subject, class_grade, due_date",
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
      return reply
        .status(400)
        .send({ error: "due_date must be in YYYY-MM-DD format" });
    }

    const user = (req as any).user;
    if (!user || user.role !== "tutor") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const assignment = await tutorService.createAssignment({
      title,
      subject,
      class_grade,
      instructions: fields.instructions || "",
      due_date,
      allow_submission_online,
      attachments,
      created_by: user.id,
    });

    return reply.status(201).send({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (err) {
    console.error("createAssignment error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

  //update assignment
  async updateAssignment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as any;
      if (!id)
        return reply.status(400).send({ error: 'Missing assignment ID' });

      const user = (req as any).user;
      if (!user || user.role !== 'tutor')
        return reply.status(403).send({ error: 'Unauthorized' });

      if (!(req as any).isMultipart()) {
        return reply
          .status(400)
          .send({ error: 'Request must be multipart/form-data' });
      }

      const parts = (req as any).parts();
      const fields: Record<string, any> = {};
      const attachments: { filename: string; url: string }[] = [];

      for await (const part of parts) {
        if (part.type === 'file') {
          const chunks: Buffer[] = [];
          for await (const chunk of part.file) chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const mimetype = part.mimetype || '';

          const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
          ];
          if (!allowed.includes(mimetype))
            return reply.status(400).send({ error: 'Invalid file type' });
          if (buffer.length > 10 * 1024 * 1024)
            return reply
              .status(400)
              .send({ error: 'File too large (max 10MB)' });

          const saved = await saveFile(
            buffer,
            part.filename || 'file',
            mimetype,
          );
          attachments.push({ filename: saved.filename, url: saved.url });
        } else {
          fields[part.fieldname] = part.value;
        }
      }

      const { title, subject, class_grade, due_date } = fields;
      if (!title || !subject || !class_grade || !due_date)
        return reply.status(400).send({
          error:
            'Missing required fields: title, subject, class_grade, due_date',
        });

      const allow_submission_online =
        fields.allow_submission_online === 'true' ||
        fields.allow_submission_online === true;

      const assignment = await tutorService.updateAssignment(id, user.id, {
        title,
        subject,
        class_grade,
        instructions: fields.instructions,
        due_date,
        allow_submission_online,
        attachments,
      });

      reply.status(200).send({
        message: 'Assignment updated successfully',
        assignment: {
          id: assignment._id,
          title: assignment.title,
          subject: assignment.subject,
          class_grade: assignment.class_grade,
          instructions: assignment.instructions,
          attachments: assignment.attachments || [],
          due_date: assignment.due_date,
          allow_submission_online: assignment.allow_submission_online,
          updated_at: assignment.updatedAt,
        },
      });
    } catch (err: any) {
      console.error('updateAssignment error:', err);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  //delete assignment
  async deleteAssignment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const assignmentId = (req.params as any).id;
      if (!assignmentId) {
        return reply
          .status(400)
          .send({ error: 'Missing assignment id in params' });
      }

      const user = (req as any).user;
      if (!user || user.role !== 'tutor') {
        return reply.status(403).send({ error: 'Unauthorized access' });
      }

      const result = await tutorService.deleteAssignment(assignmentId, user.id);

      // optional audit log
      console.log(
        `Assignment deleted by tutor ${user.id} — assignment ${assignmentId}`,
      );

      return reply.status(200).send({
        message: 'Assignment deleted successfully',
        deleted_assignment_id: result.id,
      });
    } catch (err: any) {
      console.error('deleteAssignment error:', err);
      if (err.message === 'Assignment not found') {
        return reply.status(404).send({ error: 'Assignment not found' });
      }
      if (err.message === 'Forbidden') {
        return reply.status(403).send({ error: 'Unauthorized access' });
      }
      if (err.message && err.message.includes('Invalid')) {
        return reply.status(400).send({ error: err.message });
      }
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  // Quiz
  async createQuiz(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as any;
      const { title, subject, class_grade, description, questions } = body;

      //  1. Validate required fields
      if (!title || !subject || !class_grade || !questions) {
        return reply.status(400).send({
          error:
            'Missing required fields: title, subject, class_grade, questions',
        });
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        return reply
          .status(400)
          .send({ error: 'questions must be a non-empty array' });
      }

      //  2. Validate each question
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (
          !q ||
          typeof q.question !== 'string' ||
          !Array.isArray(q.options) ||
          q.options.length < 2 ||
          typeof q.correct_answer !== 'string'
        ) {
          return reply
            .status(400)
            .send({ error: `Invalid question at index ${i}` });
        }
        if (!q.options.includes(q.correct_answer)) {
          return reply.status(400).send({
            error: `correct_answer must be one of options for question index ${i}`,
          });
        }
      }

      //  3. Ensure tutor
      const user = (req as any).user;
      if (!user || user.role !== 'tutor') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      //  4. Create quiz
      const quizDoc = await tutorService.createQuiz({
        title,
        subject,
        class_grade,
        description,
        questions,
        created_by: user.id,
      });

      // Debug logging
      console.log('quizDoc type:', typeof quizDoc);
      console.log('quizDoc:', quizDoc);
      console.log('quizDoc._id:', (quizDoc as any)?._id);
      console.log('quizDoc.title:', (quizDoc as any)?.title);

      // 5. Convert mongoose document to plain object
      let quizData: any = {};
      
      if (quizDoc) {
        const doc = quizDoc as any;
        
        // Try toJSON first
        if (typeof doc.toJSON === 'function') {
          quizData = doc.toJSON();
          console.log('Used toJSON(), quizData:', quizData);
        }
        // Try toObject
        else if (typeof doc.toObject === 'function') {
          quizData = doc.toObject();
          console.log('Used toObject(), quizData:', quizData);
        }
        // Direct property access
        else {
          quizData = {
            _id: doc._id,
            id: doc.id,
            title: doc.title,
            subject: doc.subject,
            class_grade: doc.class_grade,
            description: doc.description,
            questions: doc.questions,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
          console.log('Used direct access, quizData:', quizData);
        }
      }
      
      // Fallback to request values if quizData is empty
      if (!quizData || Object.keys(quizData).length === 0 || !quizData.title) {
        console.log('Using fallback - request values');
        quizData = {
          title,
          subject,
          class_grade,
          description: description || '',
          questions: questions || [],
        };
      }

      // 6. Build response object with explicit primitive values
      const quizId = quizData._id ? String(quizData._id) : (quizData.id ? String(quizData.id) : '');
      const quizTitle = String(quizData.title || title || '');
      const quizSubject = String(quizData.subject || subject || '');
      const quizClassGrade = String(quizData.class_grade || class_grade || '');
      const quizDescription = String(quizData.description !== undefined ? quizData.description : (description || ''));
      const quizQuestionsCount = Number(Array.isArray(quizData.questions) ? quizData.questions.length : (Array.isArray(questions) ? questions.length : 0));
      const quizCreatedAt = String(quizData.createdAt || quizData.created_at || new Date().toISOString());

      console.log('Extracted values:', {
        quizId,
        quizTitle,
        quizSubject,
        quizClassGrade,
        quizDescription,
        quizQuestionsCount,
        quizCreatedAt
      });

      // 7. Build plain object from primitives
      const responseQuiz = {
        id: quizId,
        title: quizTitle,
        subject: quizSubject,
        class_grade: quizClassGrade,
        description: quizDescription,
        questions_count: quizQuestionsCount,
        created_at: quizCreatedAt,
      };

      // Ensure it's a clean serializable object
      const cleanQuiz = JSON.parse(JSON.stringify(responseQuiz));

      console.log('Final response quiz object:', JSON.stringify(cleanQuiz, null, 2));
      console.log('Type of cleanQuiz:', typeof cleanQuiz);
      console.log('Keys in cleanQuiz:', Object.keys(cleanQuiz));

      // 8. Send clean response
      const response = {
        message: 'Quiz created successfully',
        quiz: cleanQuiz,
      };

      console.log('Full response object:', JSON.stringify(response, null, 2));

      return reply.code(201).send(response);
    } catch (err: any) {
      console.error('createQuiz error:', err);
      if (err.message && err.message.includes('Invalid')) {
        return reply.status(400).send({ error: err.message });
      }
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  //update quiz
  async updateQuiz(req: FastifyRequest, reply: FastifyReply) {
    try {
      const quizId = (req.params as any).id;
      const payload = req.body as any;

      // Basic request validation
      if (!quizId)
        return reply.status(400).send({ error: 'Missing quiz id in params' });

      if (!payload.title || !payload.subject || !payload.class_grade) {
        return reply.status(400).send({
          error: 'Missing required fields: title, subject, class_grade',
        });
      }

      // Validate questions shape (optional quick check)
      if (payload.questions && !Array.isArray(payload.questions)) {
        return reply.status(400).send({ error: 'questions must be an array' });
      }

      const user = (req as any).user;
      if (!user || user.role !== 'tutor') {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      const updated = await tutorService.updateQuiz(quizId, user.id, payload);

      return reply.status(200).send({
        message: 'Quiz updated successfully',
        quiz: {
          id: updated._id,
          title: updated.title,
          subject: updated.subject,
          class_grade: updated.class_grade,
          description: updated.description,
          questions_count: updated.questions.length,
          updated_at: updated.updatedAt,
        },
      });
    } catch (err: any) {
      console.error('updateQuiz error:', err);
      if (err.message === 'Quiz not found')
        return reply.status(404).send({ error: err.message });
      if (err.message === 'Forbidden: you are not the creator of this quiz')
        return reply.status(403).send({ error: err.message });
      if (
        err.message &&
        (err.message.includes('Missing') ||
          err.message.includes('correct_answer') ||
          err.message.includes('Invalid'))
      ) {
        return reply.status(400).send({ error: err.message });
      }
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  // delete quiz
  async deleteQuiz(req: FastifyRequest, reply: FastifyReply) {
    try {
      const quizId = (req.params as any).id;
      if (!quizId)
        return reply.status(400).send({ error: 'Missing quiz id in params' });

      const user = (req as any).user;
      if (!user || user.role !== 'tutor') {
        return reply.status(403).send({ error: 'Unauthorized access' });
      }

      // call service
      const result = await tutorService.deleteQuiz(quizId, user.id);

      // log deletion for audit (optional)
      console.log(`Quiz deleted by tutor ${user.id} — quiz ${quizId}`);

      return reply.status(200).send({
        message: 'Quiz deleted successfully',
        deleted_quiz_id: String(result.id),
      });
    } catch (err: any) {
      console.error('deleteQuiz error:', err);
      if (err.message === 'Quiz not found')
        return reply.status(404).send({ error: 'Quiz not found' });
      if (err.message === 'Forbidden')
        return reply.status(403).send({ error: 'Unauthorized access' });
      if (err.message && err.message.includes('Invalid'))
        return reply.status(400).send({ error: err.message });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  //upload study material
  async uploadStudyMaterial(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (!(req as any).isMultipart || !(req as any).parts) {
        return reply
          .status(400)
          .send({
            success: false,
            message: 'Request must be multipart/form-data',
          });
      }

      const parts = (req as any).parts();
      const fields: Record<string, any> = {};
      const files: {
        filename: string;
        url: string;
        size?: number;
        mimetype?: string;
      }[] = [];

      // Accept multiple files and fields
      for await (const part of parts) {
        if (part.type === 'file') {
          const chunks: Buffer[] = [];
          for await (const chunk of part.file) chunks.push(Buffer.from(chunk));
          const buffer = Buffer.concat(chunks);
          const mimetype = part.mimetype || '';
          // Allowed types: pdf, doc, docx, images, videos
          const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'video/mp4',
            'video/webm',
            'video/quicktime',
          ];
          if (!allowed.includes(mimetype)) {
            return reply
              .status(400)
              .send({ success: false, message: 'Invalid file type' });
          }
          // limit per-file size (adjust as needed)
          if (buffer.length > 50 * 1024 * 1024) {
            // example 50MB limit for videos
            return reply
              .status(400)
              .send({ success: false, message: 'File too large' });
          }

          const saved = await saveFile(
            buffer,
            part.filename || 'file',
            mimetype,
          );
          files.push({
            filename: saved.filename,
            url: saved.url,
            size: buffer.length,
            mimetype,
          });
        } else {
          // field
          fields[part.fieldname] = part.value;
        }
      }

      // required fields
      const material_title = (fields.material_title || '').trim();
      const subject = (fields.subject || '').trim();
      const class_grade = (fields.class_grade || '').trim();
      const description = fields.description || '';
      const share_with_all =
        fields.share_with_all === 'true' || fields.share_with_all === true;

      if (!material_title || !subject || !class_grade) {
        return reply
          .status(400)
          .send({ success: false, message: 'Missing required fields' });
      }
      if (!files.length) {
        return reply
          .status(400)
          .send({ success: false, message: 'At least one file is required' });
      }

      // auth
      const user = (req as any).user;
      if (!user || user.role !== 'tutor') {
        return reply.status(403).send({ success: false, message: 'Forbidden' });
      }

      const material = await tutorService.uploadStudyMaterial({
        material_title,
        subject,
        class_grade,
        description,
        files,
        share_with_all,
        created_by: user.id,
      });

      return reply.status(200).send({
        success: true,
        message: 'Study material uploaded successfully.',
        data: {
          id: material.id,
          material_title: material.material_title,
          subject: material.subject,
          class_grade: material.class_grade,
          description: material.description,
          share_with_all: material.share_with_all,
          files: material.files,
          uploaded_at: material.createdAt,
        },
      });
    } catch (err: any) {
      console.error('uploadStudyMaterial error:', err);
      return reply
        .status(500)
        .send({ success: false, message: 'Internal Server Error' });
    }
  }

    // Get tutor quizzes
  // async getTutorQuizzes(req: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     const user = (req as any).user;
  //     if (!user || user.role !== 'tutor') {
  //       return reply.status(403).send({ 
  //         success: false, 
  //         message: 'Forbidden' 
  //       });
  //     }

  //     const query = req.query as any;
  //     const subject = query.subject?.trim();
  //     const class_grade = query.class_grade?.trim();
  //     const page = query.page ? Number(query.page) : 1;
  //     const limit = query.limit ? Number(query.limit) : 10;

  //     const result = await tutorService.getTutorQuizzes(user.id, {
  //       subject,
  //       class_grade,
  //       page,
  //       limit,
  //     });

  //     // If no quizzes found, return 404 as per spec
  //     if (!result.quizzes || result.quizzes.length === 0) {
  //       return reply.status(404).send({
  //         success: false,
  //         message: 'No quizzes found for this tutor.',
  //       });
  //     }

  //     // Format response to match spec exactly
  //     const formattedQuizzes = result.quizzes.map((quiz: any) => ({
  //       id: String(quiz._id),
  //       title: quiz.title,
  //       subject: quiz.subject,
  //       class_grade: quiz.class_grade,
  //       due_date: quiz.due_date || null, // Quiz model doesn't have due_date, so null
  //       total_questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
  //       status: 'Active', // Default status since Quiz model doesn't have status field
  //     }));

  //     return reply.status(200).send({
  //       success: true,
  //       data: formattedQuizzes,
  //     });
  //   } catch (err: any) {
  //     console.error('getTutorQuizzes error:', err);
  //     return reply.status(500).send({ 
  //       success: false, 
  //       message: 'Internal Server Error' 
  //     });
  //   }
  // }


  // Get tutor quizzes
async getTutorQuizzes(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'tutor') {
      return reply.status(403).send({
        success: false,
        message: 'Forbidden',
      });
    }

    const query = req.query as any;
    const subject = query.subject?.trim();
    const class_grade = query.class_grade?.trim();
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    const result = await tutorService.getTutorQuizzes(user.id, {
      subject,
      class_grade,
      page,
      limit,
    });

    // 👇 IMPORTANT: even if empty, return []
    const quizzes = result.quizzes || [];

    const formattedQuizzes = quizzes.map((quiz: any) => ({
      id: String(quiz._id),
      title: quiz.title,
      subject: quiz.subject,
      class_grade: quiz.class_grade,
      due_date: null, // quiz has no due_date
      total_questions: Array.isArray(quiz.questions)
        ? quiz.questions.length
        : 0,
      status: 'Active',
    }));

    return reply.status(200).send({
      success: true,
      data: formattedQuizzes, // [] allowed
      pagination: {
        page,
        limit,
        total: result.total ?? formattedQuizzes.length,
      },
    });
  } catch (err: any) {
    console.error('getTutorQuizzes error:', err);
    return reply.status(500).send({
      success: false,
      message: 'Internal Server Error',
    });
  }
}


  // Get tutor assignments
  // async getTutorAssignments(req: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     const user = (req as any).user;
  //     if (!user || user.role !== 'tutor') {
  //       return reply.status(403).send({
  //         success: false,
  //         message: 'Forbidden',
  //       });
  //     }

  //     const query = req.query as any;
  //     const subject = query.subject?.trim();
  //     const class_grade = query.class_grade?.trim();
  //     const page = query.page ? Number(query.page) : 1;
  //     const limit = query.limit ? Number(query.limit) : 10;

  //     const result = await tutorService.getTutorAssignments(user.id, {
  //       subject,
  //       class_grade,
  //       page,
  //       limit,
  //     });

  //     // If no assignments, return 404 as per spec
  //     if (!result.assignments || result.assignments.length === 0) {
  //       return reply.status(404).send({
  //         success: false,
  //         message: 'No assignments found for this tutor.',
  //       });
  //     }

  //     // Compute status based on due_date (simple example: Active / Past Due)
  //     const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  //     const formattedAssignments = result.assignments.map((assignment: any) => {
  //       const status =
  //         assignment.due_date && assignment.due_date >= today
  //           ? 'Active'
  //           : 'Past Due';

  //       return {
  //         id: String(assignment._id),
  //         title: assignment.title,
  //         subject: assignment.subject,
  //         class_grade: assignment.class_grade,
  //         due_date: assignment.due_date,
  //         allow_submission_online: assignment.allow_submission_online,
  //         status,
  //       };
  //     });

  //     return reply.status(200).send({
  //       success: true,
  //       data: formattedAssignments,
  //     });
  //   } catch (err: any) {
  //     console.error('getTutorAssignments error:', err);
  //     return reply.status(500).send({
  //       success: false,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }

  // Get tutor assignments
async getTutorAssignments(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'tutor') {
      return reply.status(403).send({
        success: false,
        message: 'Forbidden',
      });
    }

    const query = req.query as any;
    const subject = query.subject?.trim();
    const class_grade = query.class_grade?.trim();
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    const result = await tutorService.getTutorAssignments(user.id, {
      subject,
      class_grade,
      page,
      limit,
    });

    // 👇 IMPORTANT: even if empty, return 200 with []
    const assignments = result.assignments || [];

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const formattedAssignments = assignments.map((assignment: any) => {
      const status =
        assignment.due_date && assignment.due_date >= today
          ? 'Active'
          : 'Past Due';

      return {
        id: String(assignment._id),
        title: assignment.title,
        subject: assignment.subject,
        class_grade: assignment.class_grade,
        due_date: assignment.due_date,
        allow_submission_online: assignment.allow_submission_online,
        status,
      };
    });

    return reply.status(200).send({
      success: true,
      data: formattedAssignments, // [] bhi ho sakta hai
      pagination: {
        page,
        limit,
        total: result.total ?? formattedAssignments.length,
      },
    });
  } catch (err: any) {
    console.error('getTutorAssignments error:', err);
    return reply.status(500).send({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

  
async getDashboardSummary(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== "tutor") {
      return reply.status(403).send({ success: false, message: "Forbidden" });
    }

    const tutorId = user.id;

    const assignmentsCount = await Assignment.countDocuments({
      created_by: tutorId,
    });

    const quizzesCount = await Quiz.countDocuments({
      created_by: tutorId,
    });

    return reply.send({
      success: true,
      data: {
        assignmentsCount,
        quizzesCount,
        totalEarnings: 0,
        totalStudents: 0,
      },
    });
  } catch (err) {
    console.error("getDashboardSummary error:", err);
    return reply
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
}

 // ✅ Tutor Dashboard → Parent Student Requests
  // async getTutorDashboardRequests(
  //   req: FastifyRequest,
  //   reply: FastifyReply
  // ) {
  //   try {
  //     const user = (req as any).user;

  //     if (!user || user.role !== "tutor") {
  //       return reply.status(403).send({ error: "Forbidden" });
  //     }

  //     const requests = await ParentRequest.find({
  //       tutor: user.id,
  //     })
  //       .populate("student", "full_name class_grade")
  //       .populate("parent", "fullName phone")
  //       .sort({ createdAt: -1 })
  //       .lean();

  //     return reply.send({
  //       success: true,
  //       data: requests.map((r) => ({
  //         id: r._id,
  //         academicNeeds: r.academicNeeds,
  //         scheduling: r.scheduling,
  //         urgency: r.urgency,
  //         status: r.status,
  //         location: r.location,
  //         createdAt: r.createdAt,

  //         student: r.student
  //           ? {
  //               name: (r.student as any).full_name,
  //               class_grade: (r.student as any).class_grade,
  //             }
  //           : null,

  //         parent: {
  //           name: (r.parent as any).fullName,
  //           phone: (r.parent as any).phone,
  //         },
  //       })),
  //     });
  //   } catch (err) {
  //     console.error("Tutor dashboard error:", err);
  //     return reply.status(500).send({ error: "Internal Server Error" });
  //   }
  // }

  async getTutorDashboardRequests(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== "tutor") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const requests = await ParentRequest.find({
      $or: [
        { status: "pending" }, // 🔥 ALL pending (no tutor assigned yet)
        {
          tutor: user.id,
          status: { $in: ["contacted", "assigned"] }, // 🔥 forwarded or assigned
        },
      ],
    })
      .populate("student", "full_name class_grade")
      .populate("parent", "fullName phone")
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: requests.map((r) => ({
        _id: r._id,
        academicNeeds: r.academicNeeds,
        scheduling: r.scheduling,
        urgency: r.urgency,
        status: r.status,
        location: r.location,
        createdAt: r.createdAt,

        student: r.student
          ? {
              name: (r.student as any).full_name,
              class_grade: (r.student as any).class_grade,
            }
          : null,

        parent: {
          name: (r.parent as any).fullName,
          phone: (r.parent as any).phone,
        },
      })),
    });
  } catch (err) {
    console.error("Tutor dashboard error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}



 // ✅ Tutor clicks "Request to Teach"
  // async requestToTeach(req: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     const user = (req as any).user;
  //     const { requestId } = req.params as any;
  //     const { note } = req.body as any;

  //     if (!user || user.role !== "tutor") {
  //       return reply.status(403).send({ error: "Forbidden" });
  //     }

  //     const request = await ParentRequest.findById(requestId);

  //     if (!request) {
  //       return reply.status(404).send({ error: "Parent request not found" });
  //     }

  //     // ❌ Prevent duplicate action
  //     if (request.status !== "pending") {
  //       return reply.status(400).send({
  //         error: "Request already processed by admin",
  //       });
  //     }

  //     // ✅ Mark as contacted (means tutor interested)
  //     request.status = "contacted";

  //     // Optional admin note
  //     if (note) {
  //       request.adminNote = `Tutor ${user.id}: ${note}`;
  //     }

  //     await request.save();

  //     return reply.send({
  //       success: true,
  //       message: "Request sent to admin for approval",
  //     });
  //   } catch (err) {
  //     console.error("requestToTeach error:", err);
  //     return reply.status(500).send({ error: "Internal Server Error" });
  //   }
  // }

  // ✅ Tutor clicks "Request to Teach"
// async requestToTeach(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     const user = (req as any).user;
//     const { requestId } = req.params as any;
//     const { note } = req.body as any;

//     if (!user || user.role !== "tutor") {
//       return reply.status(403).send({ error: "Forbidden" });
//     }

//     const request = await ParentRequest.findById(requestId);

//     if (!request) {
//       return reply.status(404).send({ error: "Parent request not found" });
//     }

//     // ❌ Already processed
//     if (request.status !== "pending") {
//       return reply.status(400).send({
//         error: "Request already processed by admin",
//       });
//     }

//     // ✅ IMPORTANT FIX (NO save())
//     await ParentRequest.findByIdAndUpdate(
//       requestId,
//       {
//         $set: {
//           status: "contacted",
//           interestedTutor: user.id, // 🔥 MAIN FIX
//           adminNote: note
//             ? `Tutor ${user.id}: ${note}`
//             : request.adminNote,
//         },
//       },
//       { new: true }
//     );

//     return reply.send({
//       success: true,
//       message: "Request sent to admin for approval",
//     });
//   } catch (err) {
//     console.error("requestToTeach error:", err);
//     return reply.status(500).send({ error: "Internal Server Error" });
//   }
// }

 async requestToTeach(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const { requestId } = req.params as any;
    const { note } = req.body as any;

    if (!user || user.role !== "tutor") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const request = await ParentRequest.findById(requestId);
    if (!request) {
      return reply.status(404).send({ error: "Parent request not found" });
    }

    // ❌ Already processed by admin
    if (!["pending"].includes(request.status)) {
      return reply.status(400).send({
        error: "Request already processed by admin",
      });
    }

    const newNote = note
      ? `Tutor ${user.id}: ${note}`
      : null;

   await ParentRequest.findByIdAndUpdate(
          requestId,
          {
            status: "contacted",
            interestedTutor: user.id,
            adminNote: note
              ? `Tutor note: ${note}`
              : request.adminNote || "",
          },
          { new: true }
        );


    return reply.send({
      success: true,
      message: "Request sent to admin for approval",
    });
  } catch (err) {
    console.error("requestToTeach error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}


// async getMyStudents(req: FastifyRequest, reply: FastifyReply) {
//   const user = (req as any).user;

//   if (!user || user.role !== "tutor") {
//     return reply.status(403).send({ error: "Forbidden" });
//   }

//   const requests = await ParentRequest.find({
//     tutor: user.id,
//     status: "assigned",
//     student: { $ne: null }, // 🔥 ADD THIS
//   })
//     .populate("parent", "fullName email phone")
//     .populate(
//       "student",
//       "full_name class board institution_name subjects_required"
//     )
//     .sort({ updatedAt: -1 })
//     .lean();

//   const studentMap: Record<string, any> = {};

//   for (const r of requests) {
//     if (!r.student) {
//       console.log("⚠️ Assigned request without student:", r._id);
//       continue;
//     }

//     const student = r.student as any;
//     const studentId = String(student._id);

//     if (!studentMap[studentId]) {
//       studentMap[studentId] = {
//         studentId,
//         student: {
//           _id: student._id,
//           full_name: student.full_name,
//           class: student.class,
//           board: student.board,
//           institution_name: student.institution_name,
//           subjects: [...(student.subjects_required || [])],
//         },
//         parent: r.parent,
//         location: r.location,
//         urgency: r.urgency,
//         assignedAt: r.createdAt,
//       };
//     }

//     r.academicNeeds?.forEach((sub: string) => {
//       if (!studentMap[studentId].student.subjects.includes(sub)) {
//         studentMap[studentId].student.subjects.push(sub);
//       }
//     });
//   }

//   return reply.send({
//     success: true,
//     count: Object.keys(studentMap).length,
//     data: Object.values(studentMap),
//   });
// }


async getMyStudents(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user;

  if (!user || user.role !== "tutor") {
    return reply.status(403).send({ error: "Forbidden" });
  }

  const requests = await ParentRequest.find({
    tutor: user.id,
    status: "assigned",
    // 🔥 IMPORTANT: remove student != null filter
  })
    .populate("parent", "fullName email phone")
    .populate(
      "student",
      "full_name class board institution_name subjects_required"
    )
    .sort({ updatedAt: -1 })
    .lean();

  const studentMap: Record<string, any> = {};

  for (const r of requests) {
    // 🔥 CASE 1: Linked student
    if (r.student) {
      const student = r.student as any;
      const studentId = String(student._id);

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          studentId,
          student: {
            _id: student._id,
            full_name: student.full_name,
            class: student.class,
            board: student.board,
            institution_name: student.institution_name,
            subjects: [...(student.subjects_required || [])],
          },
          parent: r.parent,
          location: r.location,
          urgency: r.urgency,
          assignedAt: r.createdAt,
        };
      }

      r.academicNeeds?.forEach((sub: string) => {
        if (
          !studentMap[studentId].student.subjects.includes(sub)
        ) {
          studentMap[studentId].student.subjects.push(sub);
        }
      });

      continue;
    }

    // 🔥 CASE 2: Manual student (studentName)
    if (r.studentName) {
      const virtualStudentId = `manual-${r._id}`;

      studentMap[virtualStudentId] = {
        studentId: virtualStudentId,
        student: {
          _id: null,
          full_name: r.studentName,
          class: r.classGrade,
          board: r.board,
          institution_name: "Not provided",
          subjects: [...(r.academicNeeds || [])],
        },
        parent: r.parent,
        location: r.location,
        urgency: r.urgency,
        assignedAt: r.createdAt,
      };
    }
  }

  return reply.send({
    success: true,
    count: Object.keys(studentMap).length,
    data: Object.values(studentMap),
  });
}




  // 🔥 GET STUDENT FULL DETAILS
 async getParentDetailForTutor(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { parentId } = req.params as any;

  // 1️⃣ Validate parentId
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    return reply.status(400).send({
      error: "Invalid parentId",
    });
  }

  // 2️⃣ Fetch parent (User)
  const parent = await User.findById(parentId)
    .select("fullName email phone createdAt")
    .lean();

  if (!parent) {
    return reply.status(404).send({
      error: "Parent not found",
    });
  }

  // 3️⃣ Fetch students of this parent
  const students = await Student.find({
    parent_id: parentId,
  }).lean();

  // 4️⃣ Fetch ALL requests for these students
  const studentIds = students.map((s) => s._id);

  const requests = await StudentRequest.find({
    student: { $in: studentIds },
  })
    .sort({ createdAt: -1 })
    .lean();

  // 5️⃣ Attach requests to respective students
  const studentsWithRequests = students.map((student) => {
    const studentRequests = requests.filter(
      (r) => String(r.student) === String(student._id)
    );

    return {
      _id: student._id,
      full_name: student.full_name,
      class: student.class,
      board: student.board,
      institution_name: student.institution_name,
      subjects_required: student.subjects_required,
      additional_notes: student.additional_notes,
      createdAt: student.createdAt,

      requirements: studentRequests.map((r) => ({
        requestId: r._id,
        subject: r.subject,
        class: r.class,
        description: r.description,
        mode: r.mode,
        location: r.location,
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  });

  // 6️⃣ Final response
  return reply.send({
    success: true,
    data: {
      parent: {
        _id: parent._id,
        fullName: parent.fullName,
        email: parent.email,
        phone: parent.phone,
        totalStudents: students.length,
        joinedAt: parent.createdAt,
      },
      students: studentsWithRequests,
    },
  });
}

// 🔥 GET STUDENT FULL DETAILS
  async getStudentById(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const { studentId } = req.params as any;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return reply.status(400).send({
        error: "Invalid studentId",
      });
    }

    // 1️⃣ Student basic info
    const student = await Student.findById(studentId)
      .populate("parent_id", "fullName email phone")
      .lean();

    if (!student) {
      return reply.status(404).send({
        error: "Student not found",
      });
    }

    // 2️⃣ Student learning requests
    const requests = await StudentRequest.find({
      student: studentId,
    })
      .populate("parent", "fullName email phone")
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: {
        student: {
          _id: student._id,
          full_name: student.full_name,
          class_grade: student.class_grade,
          createdAt: student.createdAt,
        },
        parent: student.parent_id,
        requests: requests.map((r) => ({
          requestId: r._id,
          subject: r.subject,
          class_grade: r.class_grade,
          description: r.description,
          mode: r.mode,
          location: r.location,
          status: r.status,
          createdAt: r.createdAt,
        })),
      },
    });
  }
 async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      // JWT based logout → frontend token removal is enough
      return reply.send({
        success: true,
        message: "Tutor logged out successfully",
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Logout failed",
      });
    }
  }

  // assignAssignmentToStudents upper missing h es liye bna rahu eska 
  //eska service main koi code nahi h
// Tutor → Library (Assignment)

async assignAssignmentToStudents(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const tutor = (req as any).user;
      const { assignmentId, studentIds } = req.body as any;

      if (!assignmentId || !Array.isArray(studentIds) || studentIds.length === 0) {
        return reply.status(400).send({
          success: false,
          message: "assignmentId and studentIds are required"
        });
      }

      // 🔐 ensure tutor owns the assignment
      const assignment = await Assignment.findOne({
        _id: assignmentId,
        created_by: tutor.id
      });

      if (!assignment) {
        return reply.status(404).send({
          success: false,
          message: "Assignment not found or not authorized"
        });
      }

      // 📦 prepare assignment mappings
      const docs = studentIds.map((studentId: string) => ({
        assignment_id: assignment._id,
        student_id: studentId,
        tutor_id: tutor.id,
        due_date: assignment.due_date,
        status: "assigned",
        assigned_at: new Date()
      }));

      // 🚀 bulk insert
      await StudentAssignment.insertMany(docs, { ordered: false });

      return reply.status(200).send({
        success: true,
        message: "Assignment assigned successfully",
        assigned_count: docs.length
      });

    } catch (err: any) {
      // duplicate assignment ignore
      if (err.code === 11000) {
        return reply.status(200).send({
          success: true,
          message: "Assignment already assigned to some students"
        });
      }

      console.error("assignAssignmentToStudents error:", err);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error"
      });
    }
  }
// getSubmittedAssignmentsForTutor

async getSubmittedAssignments(req: FastifyRequest, reply: FastifyReply) {
  try {
    const tutor = (req as any).user;

    if (!tutor || tutor.role !== "tutor") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const submissions = await StudentAssignment.find({
      tutor_id: tutor.id,
      status: "submitted",
    })
      .populate("assignment_id", "title subject class_grade")
      .populate("student_id", "full_name class")
      .sort({ updatedAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: submissions.map((s) => ({
        studentAssignmentId: s._id,
        assignment: s.assignment_id,
        studentName: s.submission?.student_name || s.student_id?.full_name,
        submittedAt: s.submission?.submitted_at,
        files: s.submission?.files || [],
        status: s.status,
      })),
    });
  } catch (err) {
    console.error("getSubmittedAssignments error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

/* =====================================
     ASSIGN QUIZ TO STUDENTS
  ====================================== */
 async assignQuizToStudents(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tutor = (req as any).user;
    const { quizId, studentIds } = req.body as any;

    // ✅ VALIDATION
    if (!quizId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return reply.status(400).send({
        success: false,
        message: "quizId and studentIds are required"
      });
    }

    // 🔐 ensure tutor owns the quiz
    const quiz = await Quiz.findOne({
      _id: quizId,
      created_by: tutor.id
    });

    if (!quiz) {
      return reply.status(404).send({
        success: false,
        message: "Quiz not found or not authorized"
      });
    }

    // 📦 prepare quiz-student mappings
    const docs = studentIds.map((studentId: string) => ({
      quiz_id: quiz._id,
      student_id: studentId,
      tutor_id: tutor.id,
      due_date: quiz.due_date,
      status: "assigned",
      assigned_at: new Date()
    }));

    // 🚀 bulk insert
    await StudentQuiz.insertMany(docs, { ordered: false });

    return reply.status(200).send({
      success: true,
      message: "Quiz assigned successfully",
      assigned_count: docs.length
    });

  } catch (err: any) {

    // ⚠️ duplicate quiz assign ignore
    if (err.code === 11000) {
      return reply.status(200).send({
        success: true,
        message: "Quiz already assigned to some students"
      });
    }

    console.error("assignQuizToStudents error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}

// GET /tutor/quizzes/submitted
async getSubmittedQuizzes(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tutor = (req as any).user;

    // 🔐 AUTH CHECK
    if (!tutor || tutor.role !== "tutor") {
      return reply.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }

    // 📥 FETCH SUBMITTED QUIZZES
    const quizzes = await StudentQuiz.find({
      tutor_id: tutor.id,
      status: "submitted",
    })
      .populate({
        path: "quiz_id",
        select: "title subject class_grade",
      })
      .populate({
        path: "student_id",
        select: "full_name class_grade",
      })
      .sort({ "submission.submitted_at": -1 })
      .lean();

    // 🧹 CLEAN RESPONSE (Dashboard-friendly)
    return reply.send({
      success: true,
      data: quizzes.map((q: any) => ({
        studentQuizId: q._id,

        quiz: q.quiz_id,
        student: q.student_id,

        submittedAt: q.submission?.submitted_at || null,

        status: "Submitted",
        score: q.score ?? null,
      })),
    });

  } catch (err) {
    console.error("getSubmittedQuizzes error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// GET /tutor/quizzes/:studentQuizId
async getTutorQuizForCheck(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tutor = (req as any).user;
    const { studentQuizId } = req.params as any;

    if (!tutor || tutor.role !== "tutor") {
      return reply.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }

    const quizEntry = await StudentQuiz.findById(studentQuizId)
      .populate({
        path: "quiz_id",
        select: "title subject class_grade questions",
      })
      .populate({
        path: "student_id",
        select: "full_name class_grade",
      })
      .lean();

    if (!quizEntry) {
      return reply.status(404).send({
        success: false,
        message: "Quiz not found",
      });
    }

    // 🔐 Tutor ownership check
    if (quizEntry.tutor_id.toString() !== tutor.id) {
      return reply.status(403).send({
        success: false,
        message: "Not authorized",
      });
    }

    if (quizEntry.status !== "submitted") {
      return reply.status(400).send({
        success: false,
        message: "Quiz not submitted yet",
      });
    }

    return reply.send({
      success: true,
      data: {
        studentQuizId: quizEntry._id,
        status: quizEntry.status,
        student: quizEntry.student_id,
        quiz: quizEntry.quiz_id,
        submission: quizEntry.submission,
      },
    });

  } catch (err) {
    console.error("getTutorQuizForCheck error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// POST /tutor/quizzes/:studentQuizId/check
async checkQuiz(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tutor = (req as any).user;
    const { studentQuizId } = req.params as any;
    const { score } = req.body as any;

    if (!tutor || tutor.role !== "tutor") {
      return reply.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }

    if (typeof score !== "number") {
      return reply.status(400).send({
        success: false,
        message: "Score is required",
      });
    }

    const quizEntry = await StudentQuiz.findById(studentQuizId);

    if (!quizEntry) {
      return reply.status(404).send({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quizEntry.tutor_id.toString() !== tutor.id) {
      return reply.status(403).send({
        success: false,
        message: "Not authorized",
      });
    }

    if (quizEntry.status !== "submitted") {
      return reply.status(400).send({
        success: false,
        message: "Quiz already checked",
      });
    }

    // ✅ CHECK QUIZ
    quizEntry.score = score;
    quizEntry.status = "checked";
    quizEntry.checked_at = new Date();

    await quizEntry.save();

    return reply.send({
      success: true,
      message: "Quiz checked successfully",
    });

  } catch (err) {
    console.error("checkQuiz error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
}


/* =====================================
     ASSIGN STUDY MATERIAL TO STUDENTS
  ====================================== */
  async assignStudyMaterial(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const tutor = (req as any).user;
      const { materialId, studentIds } = req.body as any;

      // 🔴 validation
      if (!materialId || !Array.isArray(studentIds) || studentIds.length === 0) {
        return reply.status(400).send({
          success: false,
          message: "materialId and studentIds are required"
        });
      }

      // 🔐 ownership check (IMPORTANT)
      const material = await StudyMaterial.findOne({
        _id: materialId,
        uploaded_by: tutor.id // ⚠️ must match StudyMaterial model
      });

      if (!material) {
        return reply.status(404).send({
          success: false,
          message: "Study material not found or not authorized"
        });
      }

      // 📦 mapping docs
      const docs = studentIds.map((studentId: string) => ({
        material_id: material._id,
        student_id: studentId,
        tutor_id: tutor.id,
        assigned_at: new Date()
      }));

      // 🚀 bulk insert
      await StudentStudyMaterial.insertMany(docs, { ordered: false });

      return reply.status(200).send({
        success: true,
        message: "Study material assigned successfully",
        assigned_count: docs.length
      });

    } catch (err: any) {
      // duplicate assignment ignore
      if (err.code === 11000) {
        return reply.status(200).send({
          success: true,
          message: "Study material already assigned to some students"
        });
      }

      console.error("assignStudyMaterial error:", err);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error"
      });
    }
  }

}


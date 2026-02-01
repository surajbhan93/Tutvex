// lib/filterTutor.ts

export interface TutorFilters {
  subject: string;
  price: number;
  classLevel: string;
  board: string;
  location: string;
}

const normalize = (v: string) =>
  v.toLowerCase().trim().replace(/s$/, "");

export const filterTutors = (
  tutors: any[],
  filters: TutorFilters
) => {
  let result = [...tutors];

  /* SUBJECT */
  if (filters.subject) {
    const sub = normalize(filters.subject);
    result = result.filter((t) =>
      Array.isArray(t.subjects)
        ? t.subjects.some(
            (s: string) => normalize(s) === sub
          )
        : false
    );
  }

  /* PRICE */
  result = result.filter(
    (t) => typeof t.price === "number" && t.price <= filters.price
  );

  /* CLASS */
  if (filters.classLevel) {
    result = result.filter((t) =>
      Array.isArray(t.classesTaught)
        ? t.classesTaught.includes(filters.classLevel)
        : true
    );
  }

  /* BOARD */
  if (filters.board) {
    result = result.filter(
      (t) =>
        t.board &&
        normalize(t.board) === normalize(filters.board)
    );
  }

  /* LOCATION */
  if (filters.location) {
    const loc = normalize(filters.location);
    result = result.filter(
      (t) =>
        t.location &&
        normalize(t.location).includes(loc)
    );
  }

  return result;
};

export const FAQ_BY_INTENT: Record<
  string,
  { q: string; a: string }[]
> = {
  "home-tutor": [
    {
      q: "How much does a home tutor cost in {location}?",
      a: "Home tutor fees in {location}, {city} depend on class and subject.",
    },
    {
      q: "Are tutors available near me?",
      a: "Yes, verified tutors are available near {location}.",
    },
  ],

  "become-tutor": [
    {
      q: "How can I become a tutor in {city}?",
      a: "You can register online and start teaching students nearby.",
    },
  ],
};

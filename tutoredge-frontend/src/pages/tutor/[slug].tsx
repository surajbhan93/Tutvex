import { GetServerSideProps } from "next";
import ssrApi from "@/lib/ssrApi";
import TutorProfile from "@/pages/tutors/[id]";
import { generateTutorSlug } from "@/lib/seo/generateTutorSEO";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = (ctx.params?.slug || ctx.params?.id) as string;

  try {
    const res = await ssrApi.get(`/tutors/${id}`);
    const tutor = res.data?.data;

    if (!tutor) {
      return { notFound: true };
    }

    const slug = tutor.slug || generateTutorSlug(tutor);

    // 🚀 SEO PERMANENT REDIRECT: If requested via Mongo ObjectId, redirect to SEO Slug URL!
    if (id !== slug && /^[0-9a-fA-F]{24}$/.test(id)) {
      return {
        redirect: {
          destination: `/tutor/${slug}`,
          permanent: true,
        },
      };
    }

    return {
      props: {
        tutor,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};

export default TutorProfile;

import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import data from "@/content/case-studies/doodlelearning";

export default function Page() {
  return <CaseStudyPage data={data} nextHref="/soakmaster" />;
}

import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import data from "@/content/case-studies/soldesignsystem";

// The original links this card to "./"; the card shows SoakMaster, so it points there.
export default function Page() {
  return <CaseStudyPage data={data} nextHref="/soakmaster" />;
}

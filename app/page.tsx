import Invitation from "@/components/Invitation";
import { FALLBACK_GUEST } from "@/data/guests";
export default function Page() {
  return <Invitation guest={FALLBACK_GUEST} />;
}

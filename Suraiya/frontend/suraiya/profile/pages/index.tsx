import ProfileContent, { UserBanner } from "../components/ProfileContent";
import DailyEcoTip from "../../../shared/components/DailyEcoTip";
import QuickStats from "../../../shared/components/QuickStats";
import CollapsibleSidebar from "../components/CollapsibleSidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-green-50">
      <CollapsibleSidebar />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-8">
            <UserBanner />
            <DailyEcoTip />
            <QuickStats />
            <ProfileContent />
          </div>
        </div>
      </div>
    </div>
  );
}


import { Banner } from "@/components/cards/Banner";
import useSettings from "@/hooks/useSettings";
import AppLayout from "@/layouts/AppLayout";

export default function NarrowcastPage() {
  const { pageHeight } = useSettings();
  return (
    <AppLayout>
      <div
        className="px-4 flex flex-col items-center justify-center"
        style={{
          height: `${pageHeight}px`,
        }}
      >
        <Banner
          italic={false}
          title="Narrowcasting coming soon!"
          description="In the meantime, grow your social graph by tapping the wristband of friends and new people you meet."
        />
      </div>
    </AppLayout>
  );
}

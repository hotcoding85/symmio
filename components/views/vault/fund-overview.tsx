import { Card, CardContent } from "@/components/ui/card"
import { iconComponents, fundOverviewData } from "@/lib/IndexDetailData";
import { Cpu, MapPin } from "lucide-react"

export default function FundOverview() {
  const {
    asOfDate,
    topSector,
    topCountry,
    objective,
    strategy,
    risk,
    disclosures
  } = fundOverviewData;

  // Get icon components
  const SectorIcon = iconComponents[topSector.iconName as keyof typeof iconComponents];
  const CountryIcon = iconComponents[topCountry.iconName as keyof typeof iconComponents];

  return (
    <Card className="w-full min-w-[350px] h-[430px] border-none bg-foreground flex flex-1 p-2 gap-2">
      {/* Header */}
      <div className="px-3 pb-1 border-b border-gray-200">
        <h2 className="text-[16px] font-semibold">Fund Overview</h2>
      </div>

      {/* Content */}
      <CardContent className="p-4 overflow-y-auto flex-1 space-y-5">
        {/* Top Sector & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-1">Top Sector</div>
            <div className="text-[12px] text-muted-foreground mb-2">AS OF {asOfDate}</div>
            <div className="flex items-center gap-2">
              <SectorIcon className="h-15 w-15 text-gray-600" />
              <div>
                <div className="font-medium text-[13px]">{topSector.name}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">Top Country</div>
            <div className="text-[12px] text-muted-foreground mb-2">AS OF {asOfDate}</div>
            <div className="flex items-center gap-2">
              <div className="rounded-sm flex items-center justify-center">
                <CountryIcon className="h-15 w-15 " />
              </div>
              <div>
                <div className="font-medium text-[13px]">{topCountry.name}</div>
                <div className="font-medium text-[13px]">{topCountry.weight}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">Objective</div>
          <p className="text-[13px] leading-relaxed">{objective}</p>
        </div>

        {/* Strategy */}
        <div>
          <div className="font-medium mb-2">Strategy</div>
          <p className="text-[13px] leading-relaxed whitespace-pre-line">{strategy}</p>
        </div>

        {/* Risk */}
        <div>
          <div className="font-medium mb-2">Risk</div>
          <p className="text-[13px] leading-relaxed whitespace-pre-line">{risk}</p>
        </div>

        {/* Disclosures */}
        <div>
          <div className="font-medium mb-2">Additional Disclosures</div>
          <p className="text-[13px] leading-relaxed whitespace-pre-line">{disclosures}</p>
        </div>
      </CardContent>
    </Card>
  );
}

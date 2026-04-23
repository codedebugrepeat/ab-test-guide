"use client";

import { useState } from "react";
import { MarbleSamplingWidget } from "./marble-sampling-widget";
import { DiscreteSamplingDistribution } from "./discrete-sampling-distribution";

export function SamplingDistributionBuilder() {
  const [counts, setCounts] = useState<number[]>([]);

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-6">
      <div className="shrink-0">
        <MarbleSamplingWidget
          onSample={(count) => setCounts((prev) => [...prev, count])}
          onReset={() => setCounts([])}
        />
      </div>
      <div className="flex w-full min-w-0 justify-center md:flex-1 md:pt-2">
        <DiscreteSamplingDistribution counts={counts} />
      </div>
    </div>
  );
}

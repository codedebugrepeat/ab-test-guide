"use client";

import { useState } from "react";
import { MarbleSamplingWidget } from "./marble-sampling-widget";
import { DiscreteSamplingDistribution } from "./discrete-sampling-distribution";

export function SamplingDistributionBuilder() {
  const [counts, setCounts] = useState<number[]>([]);

  return (
    <div className="flex flex-col items-center gap-6">
      <MarbleSamplingWidget
        onSample={(count) => setCounts((prev) => [...prev, count])}
        onReset={() => setCounts([])}
      />
      <DiscreteSamplingDistribution counts={counts} />
    </div>
  );
}

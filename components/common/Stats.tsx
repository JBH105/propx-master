"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Users } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useStatsStore from "@/zustandStore/stats.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const StateCards = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { data, getAllStats } = useStatsStore();

  useEffect(() => {
    getAllStats(
      date?.from &&
        date?.to && {
          start_date: format(date?.from, "yyyy-MM-dd"),
          end_date: format(date?.to, "yyyy-MM-dd"),
        }
    );
  }, [date?.from, date?.to]);

  return (
    <>
      <div>
        <div className="mb-5 flex justify-end">
          <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"purple"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 w-full">
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              TOTAL INVESTMENTS
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
              <div className="text-base md:text-lg font-bold text-[#549355]">
                CA$
                {data?.stats?.data?.total_investments_raised?.toFixed?.(4) || 0}
              </div>
              {/* {metric.change && (
              <div
                className={`text-xs ${
                  metric.isProfit ? "text-[#549355]" : "text-[#D54A1D]"
                } flex items-center`}
              >
                {metric.isProfit ? (
                  <ChevronUp size={12} className="stroke-[4]" />
                ) : (
                  <ChevronDown size={12} className="stroke-[4]" />
                )}
                {metric.change}
              </div>
            )} */}
            </div>
            {/* <div className="flex justify-between text-xs text-gray-500 gap-2 flex-wrap mt-2">
            <div>{metric.period}</div>
            {metric.timePeriod && (
              <div className="text-[#666666]">{metric.timePeriod}</div>
            )}
          </div> */}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              TOTAL INVESTORS
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
              <div className="text-base md:text-lg font-bold">
                {data?.stats?.data?.total_investors || 0}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              ACTIVE PROPERTIES
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
              <div className="text-base md:text-lg font-bold">
                {data?.stats?.data?.active_properties || 0}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              AVG. INVESTMENT PER INVESTOR
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
              <div className="text-base md:text-lg font-bold">
                CA$
                {data?.stats?.data?.average_investment_per_investor?.toFixed?.(
                  4
                ) || 0}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              AVG. INVESTMENT PER PROPERTY
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
              <div className="text-base md:text-lg font-bold break-words whitespace-normal overflow-hidden">
                CA$
                {data?.stats?.data?.average_investment_per_property?.toFixed?.(
                  4
                ) || 0}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              AVG. ORDER VALUE
            </div>
            <div className="flex gap-2 justify-between flex-wrap">
              <div className="text-base md:text-lg font-bold break-words whitespace-normal overflow-hidden">
                CA${data?.stats?.data?.average_order_value?.toFixed?.(4) || 0}
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 w-auto">
            <div className="text-[11px] text-[#4A4949] mb-1 font-[600]">
              TOP PROPERTY MANAGEMEMT
            </div>
            <div className="flex gap-3 justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-base md:text-lg font-bold truncate">
                      {data?.stats?.data?.most_bought_property?.property
                        ?.name || ""}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {data?.stats?.data?.most_bought_property?.property
                        ?.name || ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-[#549355]" />
                <div className="text-base text-[#549355] font-semibold">
                  {data?.stats?.data?.most_bought_property?.buy_metrics
                    ?.units_bought || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StateCards;

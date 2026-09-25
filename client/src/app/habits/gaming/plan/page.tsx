"use client";
import PlanSelection from "@/components/PlanSelection";
import { usePlanBackground } from "@/hooks/usePlanBackground";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlanDay } from "@/domain/interface";
import { apiService } from "@/service/ApiService";



export default function PlansPage() {
  const [days, setDays] = useState<PlanDay[]>([]);
  const cardBackgrounds = usePlanBackground();

  useEffect(() => {
    const loadDays = async () => {
      try
      {
        const response = await apiService.apiClient.get("/planDay");
        
        console.log(response.data);
        setDays(response.data);

      }
      catch(error)
      {
        console.error(error);
      }
    };
    loadDays();
  }, [])

  return (
    <PlanSelection slug="gaming" days={days} cardBackgrounds={cardBackgrounds} />
  );

}

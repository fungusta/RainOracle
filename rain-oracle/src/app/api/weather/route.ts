import { getWeatherForecast } from "@/services/weather/weatherService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const datetime = searchParams.get("datetime");

  if (!latitude || !longitude ) {
    return NextResponse.json({ error: "Latitude, longitude are required" }, { status: 400 });
  }

  // If datetime is not provided, use the current date/time
  const targetDate = datetime ? new Date(datetime) : new Date();
  const weatherForecast = await getWeatherForecast(Number(latitude), Number(longitude), targetDate);

  return NextResponse.json(weatherForecast);
}
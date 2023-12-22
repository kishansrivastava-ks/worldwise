import { useSearchParams } from "react-router-dom";

export function useURLPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat"); // this needs to match the "lat" in the url
  const lng = searchParams.get("lng");

  return [lat, lng];
}

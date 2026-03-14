import { useQuery } from "@tanstack/react-query";
import { weddingService } from "../services/weddingService";

const WEDDING_QUERY_KEY = ["wedding", "my"];

export const useWedding = () => {
  return useQuery({
    queryKey: WEDDING_QUERY_KEY,
    queryFn: () => weddingService.getMy(),
  });
};

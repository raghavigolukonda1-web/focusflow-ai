import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAnalytics, getAISuggestions as getLocalSuggestions } from "@/lib/store";

export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>(getLocalSuggestions());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAISuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const analytics = getAnalytics();
      const { data, error: fnError } = await supabase.functions.invoke("ai-suggestions", {
        body: { analytics },
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to get AI suggestions");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.suggestions?.length) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error("AI suggestions error:", err);
      setError(err instanceof Error ? err.message : "Failed to load AI suggestions");
      // Fall back to local suggestions
      setSuggestions(getLocalSuggestions());
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suggestions, isLoading, error, fetchAISuggestions };
}

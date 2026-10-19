import fs from "fs/promises";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import { defaultPortfolioData } from "@/data/defaultPortfolioData";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/supabase";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio.json");

export async function getPortfolioData(): Promise<PortfolioData> {
  // 1. Try Supabase first if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("portfolio_content")
          .select("data")
          .eq("id", "main")
          .maybeSingle();

        if (!error && data?.data) {
          const parsed = data.data as PortfolioData;
          // Asynchronously update local file backup
          fs.writeFile(DATA_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8").catch(() => {});
          return {
            ...defaultPortfolioData,
            ...parsed,
            hero: {
              ...defaultPortfolioData.hero,
              ...(parsed.hero || {}),
              socialLinks: {
                ...defaultPortfolioData.hero.socialLinks,
                ...(parsed.hero?.socialLinks || {}),
              },
            },
            education: Array.isArray(parsed.education) ? parsed.education : defaultPortfolioData.education,
            research: Array.isArray(parsed.research) ? parsed.research : defaultPortfolioData.research,
            policy: Array.isArray(parsed.policy) ? parsed.policy : defaultPortfolioData.policy,
            teaching: Array.isArray(parsed.teaching) ? parsed.teaching : defaultPortfolioData.teaching,
            writing: {
              intro: parsed.writing?.intro ?? defaultPortfolioData.writing.intro,
              articles: Array.isArray(parsed.writing?.articles)
                ? parsed.writing.articles
                : defaultPortfolioData.writing.articles,
            },
          };
        }
      }
    } catch (supabaseErr) {
      console.warn("Supabase fetch failed, falling back to local file:", supabaseErr);
    }
  }

  // 2. Fall back to local portfolio.json file
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultPortfolioData,
      ...parsed,
      hero: {
        ...defaultPortfolioData.hero,
        ...(parsed.hero || {}),
        socialLinks: {
          ...defaultPortfolioData.hero.socialLinks,
          ...(parsed.hero?.socialLinks || {}),
        },
      },
      education: Array.isArray(parsed.education) ? parsed.education : defaultPortfolioData.education,
      research: Array.isArray(parsed.research) ? parsed.research : defaultPortfolioData.research,
      policy: Array.isArray(parsed.policy) ? parsed.policy : defaultPortfolioData.policy,
      teaching: Array.isArray(parsed.teaching) ? parsed.teaching : defaultPortfolioData.teaching,
      writing: {
        intro: parsed.writing?.intro ?? defaultPortfolioData.writing.intro,
        articles: Array.isArray(parsed.writing?.articles)
          ? parsed.writing.articles
          : defaultPortfolioData.writing.articles,
      },
    };
  } catch (err) {
    console.warn("Could not read portfolio.json, using default data.", err);
    return defaultPortfolioData;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  let fileSaved = false;
  let supabaseSaved = false;

  // 1. Save to local JSON file
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    fileSaved = true;
  } catch (err) {
    console.error("Failed to write portfolio.json:", err);
  }

  // 2. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("portfolio_content").upsert({
          id: "main",
          data,
          updated_at: new Date().toISOString(),
        });
        if (!error) {
          supabaseSaved = true;
        } else {
          console.error("Supabase upsert error:", error);
        }
      }
    } catch (supabaseErr) {
      console.error("Supabase save exception:", supabaseErr);
    }
  }

  // Successful if either the file or Supabase succeeded
  return fileSaved || supabaseSaved;
}

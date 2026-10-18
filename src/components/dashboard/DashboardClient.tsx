"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  User,
  GraduationCap,
  BookOpen,
  Briefcase,
  FileText,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Save,
  AlertCircle,
  X,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  Share2,
  LogOut,
  Upload,
} from "lucide-react";

import { usePortfolio } from "@/context/PortfolioContext";
import { AdminLogin } from "./AdminLogin";
import {
  PortfolioData,
  EducationItem,
  ResearchItem,
  PolicyItem,
  TeachingItem,
  WritingItem,
} from "@/types/portfolio";

type TabKey = "hero" | "education" | "research" | "policy" | "teaching" | "writing";

type SectionItem = EducationItem | ResearchItem | PolicyItem | TeachingItem | WritingItem;

type ModalFormData = {
  degree?: string;
  institution?: string;
  period?: string;
  year?: string;
  title?: string;
  authors?: string;
  status?: string;
  url?: string;
  abstract?: string;
  tags?: string | string[];
  description?: string;
  badge?: string;
  [key: string]: unknown;
};

const emptySubscribe = () => () => {};

function useMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function DashboardClient() {
  const { data, updateData, resetToDefault, isSaving, lastSaved } = usePortfolio();
  const { setTheme, resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<TabKey>("hero");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const mounted = useMounted();

  // CV Upload state
  const [isUploadingCv, setIsUploadingCv] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((resData) => setIsAuthenticated(Boolean(resData.authenticated)))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleCvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showToast("Please select a PDF file (.pdf)", "error");
      return;
    }
    setIsUploadingCv(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setHeroForm((prev) => ({ ...prev, cvUrl: result.url }));
        showToast("CV uploaded successfully! Remember to save profile changes.", "success");
      } else {
        showToast(result.error || "Failed to upload CV", "error");
      }
    } catch {
      showToast("Error uploading CV file", "error");
    } finally {
      setIsUploadingCv(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    showToast("Logged out successfully", "info");
  };

  // Toast notification state
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<{ section: TabKey; item: SectionItem } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ section: TabKey; id: string; title: string } | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);

  // Hero form local draft
  const [heroForm, setHeroForm] = React.useState(data.hero);
  const [prevHero, setPrevHero] = React.useState(data.hero);
  if (data.hero !== prevHero) {
    setPrevHero(data.hero);
    setHeroForm(data.hero);
  }

  // Writing intro local draft
  const [writingIntro, setWritingIntro] = React.useState(data.writing.intro);
  const [prevWritingIntro, setPrevWritingIntro] = React.useState(data.writing.intro);
  if (data.writing.intro !== prevWritingIntro) {
    setPrevWritingIntro(data.writing.intro);
    setWritingIntro(data.writing.intro);
  }

  // Save Hero
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PortfolioData = {
      ...data,
      hero: heroForm,
    };
    const ok = await updateData(updated);
    if (ok) showToast("Hero profile updated successfully!");
    else showToast("Failed to save hero profile", "error");
  };

  // Save Writing Intro
  const handleSaveWritingIntro = async () => {
    const updated: PortfolioData = {
      ...data,
      writing: {
        ...data.writing,
        intro: writingIntro,
      },
    };
    const ok = await updateData(updated);
    if (ok) showToast("Writing introductory note updated!");
    else showToast("Failed to save note", "error");
  };

  // Delete item
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    const { section, id } = deleteConfirm;

    const updated: PortfolioData = { ...data };

    if (section === "education") {
      updated.education = data.education.filter((i) => i.id !== id);
    } else if (section === "research") {
      updated.research = data.research.filter((i) => i.id !== id);
    } else if (section === "policy") {
      updated.policy = data.policy.filter((i) => i.id !== id);
    } else if (section === "teaching") {
      updated.teaching = data.teaching.filter((i) => i.id !== id);
    } else if (section === "writing") {
      updated.writing = {
        ...data.writing,
        articles: data.writing.articles.filter((i) => i.id !== id),
      };
    }

    const ok = await updateData(updated);
    setDeleteConfirm(null);
    if (ok) showToast("Item deleted successfully");
    else showToast("Failed to delete item", "error");
  };

  // Move item up or down
  const handleMove = async (section: TabKey, index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    const swapInArray = <T,>(arr: T[]): T[] => {
      if (targetIndex < 0 || targetIndex >= arr.length) return arr;
      const copy = [...arr];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    };

    const updated: PortfolioData = { ...data };

    if (section === "education") {
      updated.education = swapInArray(data.education);
    } else if (section === "research") {
      updated.research = swapInArray(data.research);
    } else if (section === "policy") {
      updated.policy = swapInArray(data.policy);
    } else if (section === "teaching") {
      updated.teaching = swapInArray(data.teaching);
    } else if (section === "writing") {
      updated.writing = {
        ...data.writing,
        articles: swapInArray(data.writing.articles),
      };
    }

    const ok = await updateData(updated);
    if (ok) showToast("Order updated");
  };

  // Save Add or Edit modal
  const handleSaveModalItem = async (formData: Record<string, unknown>) => {
    const section = editingItem ? editingItem.section : activeTab;
    const updated: PortfolioData = { ...data };

    if (editingItem) {
      // Edit mode
      const id = editingItem.item.id;
      if (section === "education") {
        updated.education = data.education.map((i) => (i.id === id ? ({ ...i, ...formData, id } as EducationItem) : i));
      } else if (section === "research") {
        updated.research = data.research.map((i) => (i.id === id ? ({ ...i, ...formData, id } as ResearchItem) : i));
      } else if (section === "policy") {
        updated.policy = data.policy.map((i) => (i.id === id ? ({ ...i, ...formData, id } as PolicyItem) : i));
      } else if (section === "teaching") {
        updated.teaching = data.teaching.map((i) => (i.id === id ? ({ ...i, ...formData, id } as TeachingItem) : i));
      } else if (section === "writing") {
        updated.writing = {
          ...data.writing,
          articles: data.writing.articles.map((i) => (i.id === id ? ({ ...i, ...formData, id } as WritingItem) : i)),
        };
      }
    } else {
      // Add mode
      const newItem = {
        ...formData,
        id: `${section}-${Date.now()}`,
      };
      if (section === "education") {
        updated.education = [newItem as unknown as EducationItem, ...data.education];
      } else if (section === "research") {
        updated.research = [newItem as unknown as ResearchItem, ...data.research];
      } else if (section === "policy") {
        updated.policy = [newItem as unknown as PolicyItem, ...data.policy];
      } else if (section === "teaching") {
        updated.teaching = [newItem as unknown as TeachingItem, ...data.teaching];
      } else if (section === "writing") {
        updated.writing = {
          ...data.writing,
          articles: [newItem as unknown as WritingItem, ...data.writing.articles],
        };
      }
    }

    const ok = await updateData(updated);
    setIsAddModalOpen(false);
    setEditingItem(null);
    if (ok) showToast(editingItem ? "Item updated successfully!" : "New item added successfully!");
    else showToast("Failed to save changes", "error");
  };

  // Reset to default
  const handleConfirmReset = async () => {
    const ok = await resetToDefault();
    setResetConfirmOpen(false);
    if (ok) showToast("All content restored to original default!");
    else showToast("Failed to reset content", "error");
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "hero", label: "Profile & Bio", icon: <User className="h-4 w-4" /> },
    { key: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" />, count: data.education.length },
    { key: "research", label: "Academic Papers", icon: <BookOpen className="h-4 w-4" />, count: data.research.length },
    { key: "policy", label: "Research Experience", icon: <Briefcase className="h-4 w-4" />, count: data.policy.length },
    { key: "teaching", label: "Outreach", icon: <FileText className="h-4 w-4" />, count: data.teaching.length },
    { key: "writing", label: "Writing", icon: <Share2 className="h-4 w-4" />, count: data.writing.articles.length },
  ];

  // Auth gate check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-mono text-muted-foreground">Verifying administrator access...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors selection:bg-primary selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-serif font-bold text-lg shadow-sm">
              IH
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-medium text-foreground tracking-tight">
                  Portfolio Management Dashboard
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Admin
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Manage, add, update, and reorder all portfolio sections
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground">
              {isSaving ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#FF4F00] animate-ping" />
                  <span>Saving to disk...</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Synced"}</span>
                </>
              )}
            </div>

            {/* Live Site Preview */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-full border border-border hover:border-primary/60 hover:text-primary transition-all bg-card shadow-xs"
              title="View live portfolio website in new tab"
            >
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Reset to Default */}
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-full border border-border hover:border-destructive/60 hover:text-destructive transition-all bg-card shadow-xs cursor-pointer text-muted-foreground"
              title="Reset all sections to initial original content"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-primary/50 text-foreground transition-all bg-card cursor-pointer"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Logout / Lock Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans rounded-full border border-border hover:border-destructive/60 hover:text-destructive hover:bg-destructive/5 transition-all bg-card shadow-xs cursor-pointer text-muted-foreground"
              title="Lock and sign out of dashboard"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 border-b border-border scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-sans transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary text-white font-medium shadow-sm shadow-primary/20"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted/80 bg-card border border-border"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-0.5 text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile & Bio */}
        {activeTab === "hero" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
          >
            {/* Form */}
            <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-1">
                Profile & Header Information
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Update your public name, primary affiliation title, biography narrative, and social media handles.
              </p>

              <form onSubmit={handleSaveHero} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={heroForm.name}
                    onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                    placeholder="Imran Hossain"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Affiliation & Role (supports multiple lines)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={heroForm.affiliation}
                    onChange={(e) => setHeroForm({ ...heroForm, affiliation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans leading-relaxed"
                    placeholder="Research Associate&#10;BRAC Institute of Governance and Development (BIGD), BRAC University"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Press Enter to put your role or university on a new line.</p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Biography / About Paragraphs (supports multiple paragraphs)
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={heroForm.bio}
                    onChange={(e) => setHeroForm({ ...heroForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans leading-relaxed"
                    placeholder="First paragraph...&#10;&#10;Second paragraph..."
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Separate paragraphs with a blank line (double Enter).</p>
                </div>

                {/* CV PDF Management */}
                <div className="pt-2 border-t border-border/80">
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Curriculum Vitae (CV) PDF File
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={heroForm.cvUrl || "/imranh_cv.pdf"}
                      onChange={(e) => setHeroForm({ ...heroForm, cvUrl: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm font-mono focus:outline-none focus:border-primary"
                      placeholder="/imranh_cv.pdf"
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleCvFileUpload}
                      className="hidden"
                      id="cv-upload-input"
                    />

                    <button
                      type="button"
                      disabled={isUploadingCv}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl border border-primary/50 text-primary hover:bg-primary/10 text-xs font-sans font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploadingCv ? "Uploading..." : "Upload New PDF"}</span>
                    </button>

                    <a
                      href={heroForm.cvUrl || "/imranh_cv.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-sans text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Open tab</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Clicking the CV button on the website will open this PDF in a new tab. You can upload a new PDF or set a custom link.
                  </p>
                </div>

                <div className="pt-2 border-t border-border/80">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                    Social Media & Contact Links
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-foreground/80 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={heroForm.socialLinks.linkedin}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, linkedin: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                        placeholder="https://www.linkedin.com/in/..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-foreground/80 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={heroForm.socialLinks.github}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, github: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-foreground/80 mb-1">X (Twitter) URL</label>
                      <input
                        type="url"
                        value={heroForm.socialLinks.twitter}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, twitter: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                        placeholder="https://x.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-foreground/80 mb-1">Email Address</label>
                      <input
                        type="text"
                        value={heroForm.socialLinks.email}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            socialLinks: { ...heroForm.socialLinks, email: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                        placeholder="imranh.econ@gmail.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-[#E04500] text-white text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Card Preview */}
            <div className="lg:col-span-4 rounded-2xl border border-border bg-muted/30 p-5 sticky top-24">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block mb-2">
                Live Preview
              </span>
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <h3 className="font-serif text-2xl font-medium text-foreground mb-1">
                  {heroForm.name || "Your Name"}
                </h3>
                <p className="font-sans text-xs text-primary font-medium mb-3 leading-snug">
                  {heroForm.affiliation || "Affiliation"}
                </p>
                <p className="font-sans text-xs text-foreground/75 leading-relaxed mb-4 line-clamp-4">
                  {heroForm.bio || "Biography narrative..."}
                </p>
                <div className="flex gap-2 text-xs font-mono text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-muted/60 border border-border text-[10px]">
                    4 Socials Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Education Section */}
        {activeTab === "education" && (
          <SectionManager
            title="Education"
            description="Manage your academic degrees, colleges, universities, and graduation periods."
            items={data.education}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddNew={() => setIsAddModalOpen(true)}
            onEdit={(item) => setEditingItem({ section: "education", item })}
            onDelete={(item) => setDeleteConfirm({ section: "education", id: item.id, title: item.degree })}
            onMove={(idx, dir) => handleMove("education", idx, dir)}
            renderItemContent={(item: EducationItem) => (
              <div className="flex-1 pr-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <strong className="font-serif text-base sm:text-lg font-medium text-foreground">
                    {item.degree}
                  </strong>
                  <span className="font-mono text-xs text-muted-foreground">({item.period})</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-foreground/75">{item.institution}</p>
              </div>
            )}
          />
        )}

        {/* Tab 3: Academic Papers Section */}
        {activeTab === "research" && (
          <SectionManager
            title="Academic Papers"
            description="Manage working papers, published manuscripts, conferences, abstracts, and academia links."
            items={data.research}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddNew={() => setIsAddModalOpen(true)}
            onEdit={(item) => setEditingItem({ section: "research", item })}
            onDelete={(item) => setDeleteConfirm({ section: "research", id: item.id, title: item.title })}
            onMove={(idx, dir) => handleMove("research", idx, dir)}
            renderItemContent={(item: ResearchItem) => (
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {item.year}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{item.status}</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-foreground/70 mb-2 font-sans">Authors: {item.authors}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 italic font-sans leading-relaxed">
                  &ldquo;{item.abstract}&rdquo;
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-2 font-mono"
                  >
                    <span>Paper Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          />
        )}

        {/* Tab 4: Research Experience Section */}
        {activeTab === "policy" && (
          <SectionManager
            title="Research Experience"
            description="Manage research projects, field evaluations, survey designs, and research roles."
            items={data.policy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddNew={() => setIsAddModalOpen(true)}
            onEdit={(item) => setEditingItem({ section: "policy", item })}
            onDelete={(item) => setDeleteConfirm({ section: "policy", id: item.id, title: item.title })}
            onMove={(idx, dir) => handleMove("policy", idx, dir)}
            renderItemContent={(item: PolicyItem) => (
              <div className="flex-1 pr-4">
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-foreground/75 mb-3 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          />
        )}

        {/* Tab 5: Outreach Section */}
        {activeTab === "teaching" && (
          <SectionManager
            title="Outreach"
            description="Manage booklets, translations, student workshops, and outreach materials."
            items={data.teaching}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddNew={() => setIsAddModalOpen(true)}
            onEdit={(item) => setEditingItem({ section: "teaching", item })}
            onDelete={(item) => setDeleteConfirm({ section: "teaching", id: item.id, title: item.title })}
            onMove={(idx, dir) => handleMove("teaching", idx, dir)}
            renderItemContent={(item: TeachingItem) => (
              <div className="flex-1 pr-4">
                {item.badge && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border inline-block mb-1.5">
                    {item.badge}
                  </span>
                )}
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}
          />
        )}

        {/* Tab 6: Writing & Features */}
        {activeTab === "writing" && (
          <div className="space-y-6">
            {/* Intro statement editor */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-foreground mb-1">
                Writing Section Introduction Note
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                This introductory sentence appears at the top of the Writing section.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={writingIntro}
                  onChange={(e) => setWritingIntro(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  placeholder="Between 2024 and 2026, I wrote over a hundred research-driven features..."
                />
                <button
                  type="button"
                  onClick={handleSaveWritingIntro}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-[#E04500] transition-all cursor-pointer shrink-0"
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* Articles list */}
            <SectionManager
              title="Articles and Publications"
              description="Manage public newspaper articles, essays, and analysis op-eds."
              items={data.writing.articles}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddNew={() => setIsAddModalOpen(true)}
              onEdit={(item) => setEditingItem({ section: "writing", item })}
              onDelete={(item) => setDeleteConfirm({ section: "writing", id: item.id, title: item.title })}
              onMove={(idx, dir) => handleMove("writing", idx, dir)}
              renderItemContent={(item: WritingItem) => (
                <div className="flex-1 pr-4">
                  <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                  >
                    <span className="truncate max-w-sm sm:max-w-md">{item.url}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              )}
            />
          </div>
        )}

      </div>

      {/* Item Form Modal (Add / Edit) */}
      <AnimatePresence>
        {(isAddModalOpen || editingItem) && (
          <ItemModal
            section={editingItem ? editingItem.section : activeTab}
            initialData={editingItem ? editingItem.item : null}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingItem(null);
            }}
            onSave={handleSaveModalItem}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 text-destructive mb-3">
                <AlertCircle className="h-6 w-6 shrink-0" />
                <h3 className="font-serif text-lg font-medium text-foreground">Confirm Deletion</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                Are you sure you want to delete <strong className="text-foreground">&ldquo;{deleteConfirm.title}&rdquo;</strong>? This item will be removed from your public portfolio.
              </p>
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-full border border-border text-xs sm:text-sm hover:bg-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-full bg-destructive text-white text-xs sm:text-sm font-medium hover:bg-destructive/90 transition-all cursor-pointer"
                >
                  Delete Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 text-[#FF4F00] mb-3">
                <RotateCcw className="h-6 w-6 shrink-0" />
                <h3 className="font-serif text-lg font-medium text-foreground">Reset All Portfolio Content</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                This will overwrite any additions and edits with the original Imran Hossain default content. Do you wish to continue?
              </p>
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-full border border-border text-xs sm:text-sm hover:bg-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-4 py-2 rounded-full bg-[#FF4F00] text-white text-xs sm:text-sm font-medium hover:bg-[#E04500] transition-all cursor-pointer"
                >
                  Reset Content
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-xs sm:text-sm font-sans ${
              toast.type === "error"
                ? "bg-destructive text-white border-destructive/80"
                : "bg-card text-foreground border-primary/40 shadow-primary/10"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Section Manager Component with Search, Add, List, Move, Edit, Delete
function SectionManager<T extends { id: string }>({
  title,
  description,
  items,
  searchQuery,
  setSearchQuery,
  onAddNew,
  onEdit,
  onDelete,
  onMove,
  renderItemContent,
}: {
  title: string;
  description: string;
  items: T[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddNew: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onMove: (index: number, dir: "up" | "down") => void;
  renderItemContent: (item: T) => React.ReactNode;
}) {
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary hover:bg-[#E04500] text-white text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      {items.length > 2 && (
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${title.toLowerCase()}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary transition-all font-sans"
          />
        </div>
      )}

      {/* List of Items */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-dashed border-border bg-muted/20">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            {searchQuery ? "No matching items found." : "No items added to this section yet."}
          </p>
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-sans hover:bg-primary/20 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add the first item</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, idx) => {
            const originalIndex = items.indexOf(item);
            return (
              <motion.div
                key={item.id || idx}
                layout
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-4.5 rounded-xl border border-border bg-background hover:border-primary/50 transition-all gap-3"
              >
                {renderItemContent(item)}

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto justify-end">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={originalIndex === 0}
                    onClick={() => onMove(originalIndex, "up")}
                    className="h-8 w-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move item up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={originalIndex === items.length - 1}
                    onClick={() => onMove(originalIndex, "down")}
                    className="h-8 w-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move item down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center border border-border hover:border-primary/50 text-foreground/80 hover:text-primary hover:bg-primary/5 cursor-pointer"
                    title="Edit item"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center border border-border hover:border-destructive/60 text-foreground/80 hover:text-destructive hover:bg-destructive/5 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Modal for Adding or Editing any section item
function ItemModal({
  section,
  initialData,
  onClose,
  onSave,
}: {
  section: TabKey;
  initialData: (SectionItem & { tags?: string | string[] }) | null;
  onClose: () => void;
  onSave: (formData: Record<string, unknown>) => void;
}) {
  const [formData, setFormData] = React.useState<ModalFormData>(() => {
    if (initialData) return { ...initialData };
    if (section === "education") {
      return { degree: "", institution: "", period: "" };
    }
    if (section === "research") {
      return { year: new Date().getFullYear().toString(), title: "", authors: "Imran Hossain", status: "Working paper", url: "", abstract: "" };
    }
    if (section === "policy") {
      return { title: "", tags: "", description: "" };
    }
    if (section === "teaching") {
      return { badge: new Date().getFullYear().toString(), title: "", description: "" };
    }
    if (section === "writing") {
      return { title: "", url: "" };
    }
    return {};
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (section === "policy" && typeof formData.tags === "string") {
      const parsedTags = formData.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      onSave({ ...formData, tags: parsedTags });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="max-w-lg w-full rounded-2xl border border-border bg-card p-6 shadow-2xl my-8"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <h3 className="font-serif text-lg font-medium text-foreground">
            {initialData ? "Edit Item" : "Add New Item"} — {
              {
                hero: "Profile",
                education: "Education",
                research: "Academic Paper",
                policy: "Research Experience",
                teaching: "Outreach",
                writing: "Article",
              }[section] || section
            }
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Education Form */}
          {section === "education" && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Degree Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. MS in Mathematics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Institution / University
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. Jahangirnagar University"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Period / Year
                </label>
                <input
                  type="text"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. 2025–present or 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </>
          )}

          {/* Research Form */}
          {section === "research" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    Status / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="Working paper / Conference"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Paper Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Does Crop Diversification Improve Rural Household Income...?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Authors
                </label>
                <input
                  type="text"
                  required
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="Imran Hossain, Co-Author..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Paper / Academia URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.academia.edu/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Abstract
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="This paper examines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Policy Form */}
          {section === "policy" && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Family Card Programme: PMT evaluation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Targeting, Survey design, Fieldwork"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Evaluating the proxy means test scoring system..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Teaching Form */}
          {section === "teaching" && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Badge / Year
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="2026 or In progress"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="A Backbencher's Guide to Econometrics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A plain-language introductory econometrics booklet..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Writing Form */}
          {section === "writing" && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="The PhD landscape in Bangladesh: A reality check"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Article URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.tbsnews.net/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-3 flex justify-end gap-2.5 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-border text-xs sm:text-sm hover:bg-muted transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary hover:bg-[#E04500] text-white text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-sm"
            >
              {initialData ? "Save Changes" : "Add Item"}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}

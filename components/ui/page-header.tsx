interface PageHeaderProps {
  arabicText?: string;
  arabicColor?: string;
  badge?: string;
  title: string;
  description: string;
  gradient?: string;
}

export function PageHeader({
  arabicText,
  arabicColor = "text-emerald-600 dark:text-emerald-400",
  badge,
  title,
  description,
  gradient = "from-emerald-600/10 via-transparent to-transparent",
}: PageHeaderProps) {
  return (
    <div className="relative mb-10 overflow-hidden">
      {/* Background gradient blob */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl pointer-events-none`} />

      <div className="relative text-center py-10 px-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]">
        {arabicText && (
          <p className={`text-3xl sm:text-4xl font-arabic leading-loose mb-2 ${arabicColor}`}>
            {arabicText}
          </p>
        )}
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800 mb-3">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-geist), sans-serif" }}>{title}</h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

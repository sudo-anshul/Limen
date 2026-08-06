type RewriteSuggestionEntry = {
  fieldType: string;
  originalText: string;
  suggestion: string;
  rationale: string;
  audienceFitNote: string;
};

type RewriteSuggestionsProps = {
  suggestions: RewriteSuggestionEntry[];
};

export function RewriteSuggestions({ suggestions }: RewriteSuggestionsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Rewrite studio</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Suggested copy improvements</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <div key={`${suggestion.fieldType}-${suggestion.originalText}`} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{labelForField(suggestion.fieldType)}</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
                <Block label="Original" value={suggestion.originalText} />
                <Block label="Suggested rewrite" value={suggestion.suggestion} />
                <Block label="Why" value={suggestion.rationale} />
                <Block label="Audience fit" value={suggestion.audienceFitNote} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-400">Rewrite suggestions will appear after synthesis runs.</p>
        )}
      </div>
    </section>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function labelForField(fieldType: string) {
  switch (fieldType) {
    case 'hero_headline':
      return 'Hero headline';
    case 'hero_subhead':
      return 'Hero support line';
    case 'primary_cta':
      return 'Primary CTA';
    case 'trust_section':
      return 'Trust section';
    default:
      return fieldType;
  }
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "@/lib/api";
import { formatDateId } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";

function renderMarkdown(md) {
  const lines = md.split(/\n/);
  const out = [];
  let listType = null;
  let listItems = [];
  const renderInline = (text) =>
    text.split(/(\*\*.+?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

  const flushList = () => {
    if (!listType) return;
    const Tag = listType;
    out.push(
      <Tag key={`l-${out.length}`}>
        {listItems.map((li, i) => <li key={i}>{renderInline(li)}</li>)}
      </Tag>,
    );
    listType = null;
    listItems = [];
  };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (line.startsWith("## ")) { flushList(); out.push(<h2 key={`h-${out.length}`}>{line.slice(3)}</h2>); }
    else if (/^\d+\.\s/.test(line)) { if (listType !== "ol") { flushList(); listType = "ol"; } listItems.push(line.replace(/^\d+\.\s/, "")); }
    else if (line.startsWith("- ")) { if (listType !== "ul") { flushList(); listType = "ul"; } listItems.push(line.slice(2)); }
    else if (line === "") { flushList(); }
    else { flushList(); out.push(<p key={`p-${out.length}`}>{renderInline(line)}</p>); }
  });
  flushList();
  return out;
}

export default function PanduanDetail() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getGuide(id).then((r) => setGuide(r.data)).catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <div>
        <PageHeader title="Tidak ditemukan" backTo="" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );

  if (!guide)
    return <div className="h-32 rounded border border-border bg-card animate-pulse" />;

  return (
    <article className="max-w-3xl mx-auto">
      <PageHeader
        breadcrumbs={[
          { label: "Beranda", to: "/" },
          { label: "Panduan", to: "/panduan" },
          { label: guide.title },
        ]}
        kicker={`Panduan - ${formatDateId(guide.published_at)}`}
        title={guide.title}
      />
      {guide.cover_image_url && (
        <div className="rounded border border-border overflow-hidden mb-8 aspect-[16/9] bg-muted">
          <img src={guide.cover_image_url} alt={guide.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div data-testid="panduan-detail-content" className="prose-id">
        {renderMarkdown(guide.content || "")}
      </div>
    </article>
  );
}

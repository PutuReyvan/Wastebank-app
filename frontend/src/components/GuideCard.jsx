import { Link } from "react-router-dom";
import { formatDateId } from "@/lib/utils";

export default function GuideCard({ guide }) {
  return (
    <Link
      to={`/panduan/${guide.id}`}
      data-testid={`guide-card-${guide.id}`}
      className="block rounded border border-border bg-card hover:border-primary hover:shadow-card transition-all overflow-hidden group"
    >
      {guide.cover_image_url && (
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={guide.cover_image_url}
            alt={guide.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="kicker">Panduan Daur Ulang</div>
        <h3 className="font-bold text-foreground leading-snug mt-1.5 line-clamp-2">
          {guide.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{guide.excerpt}</p>
        <div className="mt-3 text-xs text-muted-foreground">{formatDateId(guide.published_at)}</div>
      </div>
    </Link>
  );
}

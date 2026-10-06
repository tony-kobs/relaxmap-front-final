import { getLocationById } from '@/lib/api/locations';
import css from './LocationMap.module.css';

type LocationMapProps = {
  locationId: string;
};

/**
 * Карта місця. Координат у моделі локації немає, тому шукаємо за назвою
 * та регіоном через вбудовану Google Maps без API-ключа.
 */
export default async function LocationMap({ locationId }: LocationMapProps) {
  const location = await getLocationById(locationId);

  if (!location) return null;

  const query = [location.name, location.region?.name, 'Україна']
    .filter(Boolean)
    .join(', ');
  const encodedQuery = encodeURIComponent(query);
  const embedUrl = `https://www.google.com/maps?q=${encodedQuery}&hl=uk&z=10&output=embed`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  return (
    <section
      className={css.section}
      data-section="LocationMap"
      data-location-id={locationId}
    >
      <div className={css.frameWrap}>
        <iframe
          className={css.frame}
          src={embedUrl}
          title={`Карта: ${location.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        className={css.link}
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Відкрити в Google Maps
      </a>
    </section>
  );
}

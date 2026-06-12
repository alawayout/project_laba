interface OrderPhotosProps {
  photos: readonly string[];
}

/** Reference photos attached to the order. */
export function OrderPhotos({ photos }: OrderPhotosProps) {
  if (photos.length === 0) return null;

  return (
    <div className="mt-4 flex gap-3.5">
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={`Фото работы ${i + 1}`}
          className="h-28 w-28 rounded-image object-cover md:h-[150px] md:w-[150px]"
        />
      ))}
    </div>
  );
}

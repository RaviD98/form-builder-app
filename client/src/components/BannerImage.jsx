const BannerImage = ({ src, alt = "Header" }) => (
  <div className="w-full overflow-hidden rounded-xl border border-gray-200">
    {/* 2 : 1 aspect ratio – adjust if you like */}
    <div className="relative pt-[50%] bg-gray-100">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </div>
);
export default BannerImage;

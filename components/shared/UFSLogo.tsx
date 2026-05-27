import React from "react";

interface UFSLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}

export const UFSLogo: React.FC<UFSLogoProps> = ({ 
  className = "", 
  size = "md",
  withTagline = false 
}) => {
  const dimensions = {
    sm: { width: "w-28", height: "h-9", text: "text-sm" },
    md: { width: "w-36", height: "h-12", text: "text-lg" },
    lg: { width: "w-48", height: "h-16", text: "text-2xl" }
  };

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <img
        src="/logo-ufs.png"
        alt="United Facility Services"
        className={`${dimensions[size].width} ${dimensions[size].height} object-contain filter drop-shadow-[0_0_8px_rgba(0,163,224,0.35)]`}
        onError={(e) => {
          // If the corporate image asset fails to load, gracefully switch to a glowing modern typographic markup
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const fallback = document.createElement("div");
            fallback.className = "font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-ufs-accent to-ufs-secondary";
            fallback.innerText = "UFS FIELD OS";
            parent.appendChild(fallback);
          }
        }}
      />
      {withTagline && (
        <span className="text-[9px] font-bold tracking-wider text-ufs-accent uppercase mt-1 drop-shadow-[0_0_5px_rgba(0,163,224,0.5)]">
          "Servimos con pasión, por el bienestar"
        </span>
      )}
    </div>
  );
};
export default UFSLogo;

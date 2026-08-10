export default function Footer() {
  return (
    <footer className="w-full border-t border-[#EFE6DD] bg-[#F5EFEB] py-6 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2D1A17]/80 font-medium text-center sm:text-left">
        <span>Comisión de Padres y Egresados 2026 🎓</span>
        <span>
          Desarrollado con ❤️ por{' '}
          <a
            href="https://ashtech-solutions-portfolio.vercel.app/es"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#800020] hover:underline decoration-2 underline-offset-2 transition-all"
          >
            Ayelen Llampa
          </a>
        </span>
      </div>
    </footer>
  );
}
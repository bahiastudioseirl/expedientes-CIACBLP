import type { FC } from "react"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import { Link } from "react-router-dom"

export const Footer: FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-100">
     
       
      {/* Línea inferior */}
      <div className="border-t border-slate-800 py-10 text-center text-sm text-slate-400">
        © {year} Bahia. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer

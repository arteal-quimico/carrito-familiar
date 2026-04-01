import { useState, useEffect } from 'react'

const FRASES = [
  { texto: "Ahorra el 10% de cada ingreso antes de gastar — págate a ti primero.", icono: "💰" },
  { texto: "Tus gastos no deben crecer más rápido que tus ingresos.", icono: "📊" },
  { texto: "Invierte una parte de lo que ahorras — el dinero quieto pierde valor.", icono: "📈" },
  { texto: "La libertad económica se construye con hábitos pequeños y constantes.", icono: "🌱" },
  { texto: "Planificar las compras evita gastos impulsivos y protege tu bolsillo.", icono: "📝" },
  { texto: "Regla 50/30/20: 50% necesidades, 30% gustos, 20% ahorro.", icono: "🥧" },
  { texto: "No trabajes solo por dinero — haz que el dinero trabaje por ti.", icono: "⚙️" },
  { texto: "Disfruta tus ganancias, pero solo una parte — el resto que genere más.", icono: "🎯" },
  { texto: "Un presupuesto familiar no limita — te da control y tranquilidad.", icono: "🏠" },
  { texto: "Comprar con lista reduce el desperdicio y cuida tus finanzas.", icono: "✅" },
  { texto: "Pequeños ahorros diarios se convierten en grandes metas anuales.", icono: "🗓️" },
  { texto: "La riqueza no es cuánto ganas — es cuánto logras conservar e invertir.", icono: "🏦" },
  { texto: "Evita deudas en cosas que pierden valor — invierte en lo que lo gana.", icono: "⚠️" },
  { texto: "El 10% ahorrado hoy puede ser tu libertad económica mañana.", icono: "🔑" },
  { texto: "Enseñar a los niños sobre el dinero es el mejor regalo del futuro.", icono: "👧" },
  { texto: "Múltiples fuentes de ingreso te dan estabilidad y libertad.", icono: "🌊" },
  { texto: "Gasta menos de lo que ganas — esa diferencia es tu poder.", icono: "💪" },
  { texto: "Comprar al por mayor lo que usas siempre puede generar gran ahorro.", icono: "🛒" },
]

// Determina qué frase mostrar según la media hora actual del día
function getFraseDelMomento() {
  const ahora = new Date()
  const minutosDelDia = ahora.getHours() * 60 + ahora.getMinutes()
  const indice = Math.floor(minutosDelDia / 30) % FRASES.length
  return indice
}

export default function FinancialTicker() {
  const [indiceActual, setIndiceActual] = useState(getFraseDelMomento)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Revisar cada minuto si cambió la media hora
    const interval = setInterval(() => {
      const nuevoIndice = getFraseDelMomento()
      if (nuevoIndice !== indiceActual) {
        // Fade out, cambiar, fade in
        setVisible(false)
        setTimeout(() => {
          setIndiceActual(nuevoIndice)
          setVisible(true)
        }, 600)
      }
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [indiceActual])

  const frase = FRASES[indiceActual]

  return (
    <div className="financial-ticker">
      <div className={`ticker-inner ${visible ? 'visible' : 'hidden'}`}>
        <span className="ticker-icon">{frase.icono}</span>
        <span className="ticker-text">{frase.texto}</span>
      </div>
    </div>
  )
}

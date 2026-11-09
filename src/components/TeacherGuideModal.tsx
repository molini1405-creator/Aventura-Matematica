import React from 'react';
import { X, BookOpen, Heart, Sparkles, Check } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-2 border-sky-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-sky-950">
                Guía Pedagógica para la Seño y la Familia
              </h2>
              <span className="text-xs text-sky-600 font-medium">
                Diseño Curricular de Educación Primaria · DGE Mendoza (2° Grado)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
            <h3 className="font-extrabold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🎯</span>
              <span>Propósito Didáctico: De la Suma al «Por» (×)</span>
            </h3>
            <p className="text-amber-900 leading-relaxed">
              En segundo grado los niños y niñas no deben memorizar las tablas de forma mecánica sin
              sentido. Este juego acompaña la construcción del <strong>sentido de la multiplicación</strong>{' '}
              a través de tres pasos clave:
            </p>
            <ul className="mt-2 space-y-1.5 text-amber-950 font-medium">
              <li className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>1. Suma Repetitiva:</strong> Agrupar colecciones iguales (ej: 2 uvas + 2 uvas + 2 uvas).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>2. La palabra «VECES»:</strong> Contar los grupos para descubrir cuántas veces se repite el número (¡3 veces 2!).
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>3. El signo «×» (por):</strong> Comprender que multiplicar es un atajo para no escribir sumas tan largas (3 × 2 = 6).
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-sky-950 mb-1">
              🏔️ Contexto Regional Mendocino
            </h4>
            <p className="leading-relaxed">
              Las actividades utilizan elementos cotidianos de Mendoza: los racimos de uva de nuestros
              viñedos, las manzanas del Valle de Uco, las cerezas de Tunuyán, las 4 patitas del Zorro Culpeo
              y los 5 dedos de las manos cosechadoras en la vendimia.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-sky-950 mb-1">
              💡 Sugerencias de Uso en Clase o en Casa
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                Invita al estudiante a <strong>tocar las frutas en pantalla</strong> para contarlas una a una con el sonido interactivo.
              </li>
              <li>
                Usa el botón <strong>«Escuchar»</strong> para que escuchen la consigna hablada en voz alta con entonación amable.
              </li>
              <li>
                En la <strong>«Máquina Mágica»</strong>, pueden experimentar libremente creando sus propios canastos y frutas.
              </li>
              <li>
                En el <strong>«Modo Desafío»</strong>, los niños ponen a prueba su rapidez mental resolviendo 5 multiplicaciones aleatorias contra el tiempo para ganar estrellas extra y superar sus récords.
              </li>
              <li>
                Al finalizar el recorrido, pueden personalizar e imprimir el <strong>Diploma de Honor</strong> con su nombre y el de la escuela.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-sky-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer"
          >
            Entendido, ¡a seguir jugando!
          </button>
        </div>
      </div>
    </div>
  );
};
